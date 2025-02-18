package com.constructi.mapper;


import com.constructi.DTO.BudgetRequestDTO;
import com.constructi.DTO.BudgetResponseDTO;
import com.constructi.model.entity.Budget;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.*;

@Mapper(componentModel = "spring")
public interface BudgetMapper {
    BudgetMapper INSTANCE = Mappers.getMapper(BudgetMapper.class);

    @Mapping(source = "project.id", target = "projectId")
    BudgetResponseDTO toResponseDTO(Budget budget);

    @Mapping(source = "projectId", target = "project.id")
    Budget toEntity(BudgetRequestDTO budgetRequestDTO);

    List<BudgetResponseDTO> toDtoList(List<Budget> budgets);


}

