package com.constructi.mapper;

import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.model.entity.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    InvoiceMapper INSTANCE = Mappers.getMapper(InvoiceMapper.class);

    @Mapping(source = "user.id", target = "userId")
//    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "material.id", target = "materialId")
    InvoiceResponseDTO toDto(Invoice invoice);
}