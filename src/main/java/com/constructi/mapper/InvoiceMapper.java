package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    InvoiceMapper INSTANCE = Mappers.getMapper(InvoiceMapper.class);

    @Mapping(target = "user", source = "entity.user")
    InvoiceDTO entityToDto(Invoice entity);

    @Mapping(target = "user", source = "dto.user")
    Invoice dtoToEntity(InvoiceDTO dto);
}
