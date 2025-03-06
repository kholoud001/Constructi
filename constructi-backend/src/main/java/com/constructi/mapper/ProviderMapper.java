package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = MaterialMapper.class)
public interface ProviderMapper {

    ProviderMapper INSTANCE = Mappers.getMapper(ProviderMapper.class);

    @Mapping(source = "materialsList", target = "materials")
    ProviderResponseDTO toResponseDTO(Provider provider);

    @Mapping(target = "materialsList", ignore = true)
    Provider toEntity(ProviderRequestDTO providerRequestDTO);
}