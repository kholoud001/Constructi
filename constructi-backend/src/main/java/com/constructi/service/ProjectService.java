package com.constructi.service;


import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;

import java.util.List;

public interface ProjectService {


    ProjectResponseDTO createProject(ProjectRequestDTO dto);

    ProjectResponseDTO updateProject(Long id, ProjectRequestDTO dto);

    void deleteProject(Long id);

    ProjectResponseDTO getProjectById(Long id);

    ProjectResponseDTO getProjectByIdForAssignedUser(Long id);

    List<ProjectResponseDTO> getAllProjects();

    List<ProjectResponseDTO> getMyProjects();

//    double getProjectProgress(Long projectId);

    ProjectResponseDTO getProjectDetails(Long projectId);

    boolean isAssignedToProjectViaTask(String email, Long projectId);
}
