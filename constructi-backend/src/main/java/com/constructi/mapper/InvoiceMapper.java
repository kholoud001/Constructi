package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    InvoiceMapper INSTANCE = Mappers.getMapper(InvoiceMapper.class);

    @Mapping(source = "user.id", target = "userId")
    InvoiceResponseDTO toResponseDTO(Invoice invoice);

    @Mapping(source = "userId", target = "user.id")
    Invoice toEntity(InvoiceRequestDTO invoiceRequestDTO);
}
