package com.constructi.mapper;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.model.entity.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface InvoiceMapper {
    InvoiceMapper INSTANCE = Mappers.getMapper(InvoiceMapper.class);

    @Mapping(source = "user.id", target = "userId")
    InvoiceResponseDTO toDto(Invoice invoice);
}