package com.constructi.service;

import com.constructi.DTO.ProjectDTO;

import java.util.List;
import java.util.Optional;

public interface ProjectService {

    ProjectDTO createProject(ProjectDTO projectDTO);

    ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO);

    Optional<ProjectDTO> getProjectById(Long projectId);

    List<ProjectDTO> getAllProjects();

    void deleteProject(Long projectId);
}
