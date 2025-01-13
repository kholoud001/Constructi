package com.constructi.mapper;


import org.mapstruct.Mapper;
import com.constructi.model.entity.Budget;
import com.constructi.DTO.BudgetDTO;

import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BudgetMapper {

    BudgetMapper INSTANCE = Mappers.getMapper(BudgetMapper.class);

    //@Mapping(target = "project", source = "entity.project")
    BudgetDTO entityToDto(Budget entity);

    //@Mapping(target = "project", source = "dto.project")
    Budget dtoToEntity(BudgetDTO dto);
}

