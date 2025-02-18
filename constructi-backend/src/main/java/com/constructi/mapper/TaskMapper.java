package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.*;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "user.id", target = "userId")
    TaskResponseDTO toTaskResponseDTO(Task task);

    @Mapping(source = "projectId", target = "project.id")
    @Mapping(target = "user.id" , ignore = true)
    Task toTaskEntity(TaskRequestDTO taskRequestDTO);

    List<TaskResponseDTO> toDtoList(List<Task> tasks);




}
