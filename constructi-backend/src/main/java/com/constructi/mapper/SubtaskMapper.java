package com.constructi.mapper;

import com.constructi.DTO.SubtaskRequestDTO;
import com.constructi.DTO.SubtaskResponseDTO;
import com.constructi.model.entity.Subtask;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SubtaskMapper {

    SubtaskMapper INSTANCE = Mappers.getMapper(SubtaskMapper.class);

    @Mapping(source = "parentTaskId", target = "parentTask.id")
    @Mapping(source = "userId", target = "user.id")
    Subtask toSubtaskEntity(SubtaskRequestDTO subtaskRequestDTO);

    @Mapping(source = "parentTask.id", target = "parentTaskId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    SubtaskResponseDTO toSubtaskResponseDTO(Subtask subtask);
}