package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);

    RoleResponseDTO toResponseDTO(Role role);

    Role toEntity(RoleRequestDTO roleRequestDTO);
}
