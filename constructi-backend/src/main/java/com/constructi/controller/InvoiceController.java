package com.constructi.controller;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.model.entity.Invoice;
import com.constructi.model.entity.User;
import com.constructi.repository.UserRepository;
import com.constructi.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import java.nio.charset.StandardCharsets;
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

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoice(@PathVariable Long invoiceId) {
        InvoiceResponseDTO invoiceResponseDTO = invoiceService.getInvoiceById(invoiceId);
        return ResponseEntity.ok(invoiceResponseDTO);
    }


//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
//    @GetMapping("/download/{invoiceId}")
//    public ResponseEntity<Resource> downloadInvoice(@PathVariable Long invoiceId) {
//        // Fetch the invoice from the database
//        Invoice invoice = invoiceService.getInvoiceById(invoiceId);
//
//        // Generate the invoice content as a string
//        String invoiceContent = generateInvoiceContent(invoice);
//
//        // Convert the content to a byte array
//        byte[] invoiceBytes = invoiceContent.getBytes(StandardCharsets.UTF_8);
//
//        // Create a Resource from the byte array
//        ByteArrayResource resource = new ByteArrayResource(invoiceBytes);
//
//        // Set headers for the response
//        HttpHeaders headers = new HttpHeaders();
//        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + invoiceId + ".txt");
//        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE);
//
//        return ResponseEntity.ok()
//                .headers(headers)
//                .contentLength(invoiceBytes.length)
//                .body(resource);
//    }
//
//    private String generateInvoiceContent(Invoice invoice) {
//        StringBuilder content = new StringBuilder();
//        content.append("Invoice ID: ").append(invoice.getId()).append("\n");
//        content.append("Amount: ").append(invoice.getAmount()).append("\n");
//        content.append("Emission Date: ").append(invoice.getEmissionDate()).append("\n");
//        content.append("State: ").append(invoice.getState()).append("\n");
//        content.append("User ID: ").append(invoice.getUser() != null ? invoice.getUser().getId() : "N/A").append("\n");
//        content.append("Task ID: ").append(invoice.getTask() != null ? invoice.getTask().getId() : "N/A").append("\n");
//        content.append("Material ID: ").append(invoice.getMaterial() != null ? invoice.getMaterial().getId() : "N/A").append("\n");
//        return content.toString();
//    }

}
