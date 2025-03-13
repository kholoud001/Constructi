package com.constructi.service.impl;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.exception.ResourceNotFoundException;
import com.constructi.mapper.InvoiceMapper;
import com.constructi.model.entity.*;
import com.constructi.model.enums.InvoiceState;
import com.constructi.repository.*;
import com.constructi.service.InvoiceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class InvoiceServiceImplTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private InvoiceMapper invoiceMapper;

    @Mock
    private MultipartFile justificationFile;

    @InjectMocks
    private InvoiceServiceImpl invoiceService;


    private User user;
    private Project project;
    private Task task;
    private Material material;
    private Invoice invoice;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        project = new Project();
        project.setId(1L);
        project.setInitialBudget(1000.0);
        project.setActualBudget(500.0);

        task = new Task();
        task.setId(1L);
        task.setProject(project);
        task.setBudgetLimit(200.0);

        material = new Material();
        material.setId(1L);
        material.setPriceUnit(50.0);
        material.setQuantity(10);

        invoice = new Invoice();
        invoice.setId(1L);
        invoice.setUser(user);
        invoice.setAmount(100.0);
        invoice.setEmissionDate(LocalDateTime.now());
        invoice.setState(InvoiceState.PENDING);
    }

    @Test
    void createInvoice_ShouldReturnInvoiceResponseDTO_WhenUserExists() {
        Long userId = 1L;
        Double amount = 100.0;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(invocation -> {
            Invoice savedInvoice = invocation.getArgument(0);
            savedInvoice.setId(1L);
            return savedInvoice;
        });

        InvoiceResponseDTO expectedResponse = new InvoiceResponseDTO();
        expectedResponse.setId(1L);
        expectedResponse.setAmount(amount);
        expectedResponse.setState(InvoiceState.PENDING);

        when(invoiceMapper.toDto(any(Invoice.class))).thenReturn(expectedResponse);

        InvoiceResponseDTO actualResponse = invoiceService.createInvoice(userId, amount);

        assertNotNull(actualResponse);
        assertEquals(expectedResponse.getId(), actualResponse.getId());
        assertEquals(expectedResponse.getAmount(), actualResponse.getAmount());
        assertEquals(expectedResponse.getState(), actualResponse.getState());
        verify(userRepository, times(1)).findById(userId);
        verify(invoiceRepository, times(1)).save(any(Invoice.class));
        verify(invoiceMapper, times(1)).toDto(any(Invoice.class));
    }


    @Test
    void createInvoice_ShouldThrowException_WhenUserNotFound() {
        Long userId = 99L;
        Double amount = 100.0;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            invoiceService.createInvoice(userId, amount);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(userId);
        verify(invoiceRepository, never()).save(any(Invoice.class));
        verify(invoiceMapper, never()).toDto(any(Invoice.class));
    }

    @Test
    void createMaterialInvoice_ShouldReturnInvoiceResponseDTO_WhenValidDataIsProvided() {
        Long materialId = 1L;
        Long userId = 1L;
        Double amount = 100.0;
        String fakeFilePath = "uploads/justification.pdf";

        when(materialRepository.findById(materialId)).thenReturn(Optional.of(material));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(invoiceRepository.sumAmountByMaterialId(materialId)).thenReturn(50.0);
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);
        when(invoiceMapper.toDto(any(Invoice.class))).thenReturn(new InvoiceResponseDTO());

        // spy invoiceService
        InvoiceServiceImpl spyInvoiceService = Mockito.spy(invoiceService);
        doReturn(fakeFilePath).when(spyInvoiceService).saveJustificationFile(any(MultipartFile.class));

        InvoiceResponseDTO response = spyInvoiceService.createMaterialInvoice(materialId, userId, amount, justificationFile);

        assertNotNull(response);
        verify(materialRepository, times(1)).findById(materialId);
        verify(userRepository, times(1)).findById(userId);
        verify(invoiceRepository, times(1)).sumAmountByMaterialId(materialId);
        verify(invoiceRepository, times(1)).save(any(Invoice.class));
        verify(invoiceMapper, times(1)).toDto(any(Invoice.class));
    }


    @Test
    void createMaterialInvoice_ShouldThrowException_WhenAmountExceedsMaterialValue() {
        Long materialId = 1L;
        Long userId = 1L;
        Double amount = 500.0;

        when(materialRepository.findById(materialId)).thenReturn(Optional.of(material));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(invoiceRepository.sumAmountByMaterialId(materialId)).thenReturn(450.0);

        Double totalMaterialValue = material.getPriceUnit() * material.getQuantity();

        Exception exception = assertThrows(RuntimeException.class, () -> {
            invoiceService.createMaterialInvoice(materialId, userId, amount, justificationFile);
        });

        assertTrue(exception.getMessage().contains("Le montant du paiement dépasse la valeur totale restante du matériau"));

        verify(invoiceRepository, never()).save(any(Invoice.class));
        verify(invoiceMapper, never()).toDto(any(Invoice.class));
    }




    @Test
    void getMyInvoices_ShouldReturnListOfInvoiceResponseDTO() {
        when(invoiceRepository.findByUserId(any(Long.class))).thenReturn(Collections.singletonList(invoice));
        when(invoiceMapper.toDto(any(Invoice.class))).thenReturn(new InvoiceResponseDTO());

        List<InvoiceResponseDTO> response = invoiceService.getMyInvoices(1L);

        assertNotNull(response);
        assertEquals(1, response.size());
        verify(invoiceRepository, times(1)).findByUserId(1L);
    }


    @Test
    void paySomeone_ShouldReturnInvoiceResponseDTO() throws IOException {
        // Arrange
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(user));
        when(projectRepository.findById(any(Long.class))).thenReturn(Optional.of(project));
        when(taskRepository.findById(any(Long.class))).thenReturn(Optional.of(task));
        when(invoiceRepository.sumAmountByTaskId(any(Long.class))).thenReturn(0.0);
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);
        when(invoiceMapper.toDto(any(Invoice.class))).thenReturn(new InvoiceResponseDTO());


        lenient().when(justificationFile.getOriginalFilename()).thenReturn("test.txt");
        lenient().when(justificationFile.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        lenient().when(justificationFile.isEmpty()).thenReturn(false);

        when(projectRepository.save(any(Project.class))).thenReturn(project);

        when(budgetRepository.save(any(Budget.class))).thenReturn(new Budget());

        InvoiceResponseDTO response = invoiceService.paySomeone(1L, 100.0, justificationFile, 1L, 1L);

        assertNotNull(response);
        verify(userRepository, times(1)).findById(1L);
        verify(projectRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).findById(1L);
        verify(invoiceRepository, times(1)).save(any(Invoice.class));

        verify(projectRepository, times(1)).save(any(Project.class));
        verify(budgetRepository, times(1)).save(any(Budget.class));
    }


    @Test
    void getInvoicesByMaterialId_ShouldReturnListOfInvoiceResponseDTO() {
        when(invoiceRepository.findByMaterialId(any(Long.class))).thenReturn(Collections.singletonList(invoice));
        when(invoiceMapper.toDto(any(Invoice.class))).thenReturn(new InvoiceResponseDTO());

        List<InvoiceResponseDTO> response = invoiceService.getInvoicesByMaterialId(1L);

        assertNotNull(response);
        assertEquals(1, response.size());
        verify(invoiceRepository, times(1)).findByMaterialId(1L);
    }

    @Test
    void getInvoiceById_ShouldReturnInvoiceResponseDTO() {
        when(invoiceRepository.findById(any(Long.class))).thenReturn(Optional.of(invoice));
        when(invoiceMapper.toDto(any(Invoice.class))).thenReturn(new InvoiceResponseDTO());

        InvoiceResponseDTO response = invoiceService.getInvoiceById(1L);

        assertNotNull(response);
        verify(invoiceRepository, times(1)).findById(1L);
    }

    @Test
    void getInvoiceById_ShouldThrowResourceNotFoundException() {
        when(invoiceRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> invoiceService.getInvoiceById(1L));
        verify(invoiceRepository, times(1)).findById(1L);
    }
}