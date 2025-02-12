package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MaterialMapper {

    MaterialMapper INSTANCE = Mappers.getMapper(MaterialMapper.class);

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "provider.id", target = "providerId")
    MaterialResponseDTO toResponseDTO(Material material);

    @Mapping(source = "projectId", target = "project.id")
    @Mapping(source = "providerId", target = "provider.id")
    Material toEntity(MaterialRequestDTO materialRequestDTO);
}
