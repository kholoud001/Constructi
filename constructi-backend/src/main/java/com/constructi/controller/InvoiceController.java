package com.constructi.controller;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.model.entity.Invoice;
import com.constructi.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

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
            @RequestParam Long projectId) {

        InvoiceResponseDTO response = invoiceService.paySomeone(userId, amount, justificationFile, projectId);
        return ResponseEntity.ok(response);
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InvoiceResponseDTO>> getUserInvoices(@PathVariable Long userId) {
        return ResponseEntity.ok(invoiceService.getUserInvoices(userId));
    }
}
