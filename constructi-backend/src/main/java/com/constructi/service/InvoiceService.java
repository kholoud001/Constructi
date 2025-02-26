package com.constructi.service;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.model.entity.Invoice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InvoiceService {


    InvoiceResponseDTO createInvoice(Long userId, Double amount);

    List<InvoiceResponseDTO> getMyInvoices(Long userId);

//    InvoiceResponseDTO paySomeone(Long userId, Double amount, MultipartFile justificationFile);

//    InvoiceResponseDTO paySomeone(Long userId, Double amount, MultipartFile justificationFile, Long projectId);

    InvoiceResponseDTO paySomeone(Long userId, Double amount, MultipartFile justificationFile, Long projectId, Long taskId);

    List<InvoiceResponseDTO> getUserInvoices(Long userId);
}
