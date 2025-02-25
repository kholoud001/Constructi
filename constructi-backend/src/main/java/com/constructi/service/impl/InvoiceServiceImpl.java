package com.constructi.service.impl;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.mapper.InvoiceMapper;
import com.constructi.model.entity.Budget;
import com.constructi.model.entity.Invoice;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.User;
import com.constructi.model.enums.InvoiceState;
import com.constructi.repository.BudgetRepository;
import com.constructi.repository.ProjectRepository;
import com.constructi.service.InvoiceService;
import com.constructi.repository.UserRepository;
import com.constructi.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final BudgetRepository budgetRepository;


    @Override
    public InvoiceResponseDTO createInvoice(Long userId, Double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invoice invoice = new Invoice();
        invoice.setUser(user);
        invoice.setAmount(amount);
        invoice.setEmissionDate(LocalDateTime.now());
        invoice.setState(InvoiceState.PENDING);

        return InvoiceMapper.INSTANCE.toDto(invoiceRepository.save(invoice));
    }

    @Override
    public List<InvoiceResponseDTO> getMyInvoices(Long userId) {
        return invoiceRepository.findByUserId(userId)
                .stream()
                .map(InvoiceMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceResponseDTO paySomeone(Long userId, Double amount, MultipartFile justificationFile, Long projectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String filePath = saveJustificationFile(justificationFile);

        Invoice invoice = new Invoice();
        invoice.setUser(user);
        invoice.setAmount(amount);
        invoice.setEmissionDate(LocalDateTime.now());
        invoice.setState(InvoiceState.PAID);
        invoice.setJustificationPath(filePath);

        invoice = invoiceRepository.save(invoice);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setActualBudget(project.getActualBudget() + amount);

        Budget transaction = new Budget();
        transaction.setAmount(amount);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionType("payment");
        transaction.setProject(project);
        budgetRepository.save(transaction);

        projectRepository.save(project);

        return InvoiceMapper.INSTANCE.toDto(invoice);
    }



    @Override
    public List<InvoiceResponseDTO> getUserInvoices(Long userId) {
        return invoiceRepository.findByUserId(userId)
                .stream()
                .map(InvoiceMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    private String saveJustificationFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Justification file is required");
        }

        try {
            Path uploadDir = Path.of("uploads/justifications");
            Files.createDirectories(uploadDir);

            Path filePath = uploadDir.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save justification file", e);
        }
    }

}
