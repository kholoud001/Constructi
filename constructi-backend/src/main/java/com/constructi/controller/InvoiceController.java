package com.constructi.controller;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.model.entity.Invoice;
import com.constructi.model.entity.User;
import com.constructi.repository.UserRepository;
import com.constructi.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final UserRepository userRepository;


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/material/{materialId}/create")
    public ResponseEntity<InvoiceResponseDTO> createMaterialInvoice(
            @PathVariable Long materialId,
            @RequestParam Double amount,
            @RequestParam("justificationFile") MultipartFile justificationFile) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User adminUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        InvoiceResponseDTO response = invoiceService.createMaterialInvoice(materialId, adminUser.getId(), amount, justificationFile);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
    @GetMapping("/my")
    public ResponseEntity<List<InvoiceResponseDTO>> getMyInvoices(@RequestParam Long userId) {
        return ResponseEntity.ok(invoiceService.getMyInvoices(userId));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/pay")
    public ResponseEntity<InvoiceResponseDTO> paySomeone(
            @RequestParam Long userId,
            @RequestParam Double amount,
            @RequestParam("justificationFile") MultipartFile justificationFile,
            @RequestParam Long projectId,
            @RequestParam Long taskId) {

        InvoiceResponseDTO response = invoiceService.paySomeone(userId, amount, justificationFile, projectId, taskId);
        return ResponseEntity.ok(response);
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InvoiceResponseDTO>> getUserInvoices(@PathVariable Long userId) {
        return ResponseEntity.ok(invoiceService.getUserInvoices(userId));
    }



    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/material/{materialId}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByMaterialId(@PathVariable Long materialId) {
        List<InvoiceResponseDTO> invoices = invoiceService.getInvoicesByMaterialId(materialId);
        return ResponseEntity.ok(invoices);
    }

}
