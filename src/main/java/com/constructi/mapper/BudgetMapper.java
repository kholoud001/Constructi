package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BudgetMapper {

    BudgetMapper INSTANCE = Mappers.getMapper(BudgetMapper.class);

    @Mapping(target = "project", source = "entity.project")
    BudgetDTO entityToDto(Budget entity);

    @Mapping(target = "project", source = "dto.project")
    Budget dtoToEntity(BudgetDTO dto);
}

