package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "role.id", target = "roleId")
    @Mapping(target = "taskIds", expression = "java(mapTaskIds(user))")
    @Mapping(target = "invoiceIds", expression = "java(mapInvoiceIds(user))")
    @Mapping(target = "projectIds", expression = "java(mapProjectIds(user))")
    UserResponseDTO toResponseDTO(User user);

    @Mapping(source = "roleId", target = "role.id")
    User toEntity(UserRequestDTO userRequestDTO);

    default List<Long> mapTaskIds(User user) {
        return user.getTasks() != null ? user.getTasks().stream().map(Task::getId).collect(Collectors.toList()) : null;
    }

    default List<Long> mapInvoiceIds(User user) {
        return user.getInvoices() != null ? user.getInvoices().stream().map(Invoice::getId).collect(Collectors.toList()) : null;
    }

    default List<Long> mapProjectIds(User user) {
        return user.getProjects() != null ? user.getProjects().stream().map(Project::getId).collect(Collectors.toList()) : null;
    }
}
