package com.constructi.service.impl;

import com.constructi.DTO.ProjectDTO;
import com.constructi.mapper.ProjectMapper;
import com.constructi.mapper.UserMapper;
import com.constructi.model.entity.Project;
import com.constructi.repository.ProjectRepository;
import com.constructi.service.ProjectService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserMapper userMapper;

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = projectMapper.dtoToEntity(projectDTO);
        Project savedProject = projectRepository.save(project);
        return projectMapper.entityToDto(savedProject);
    }

    @Override
    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO) {
        Optional<Project> existingProject = projectRepository.findById(projectId);
        if (existingProject.isPresent()) {
            Project project = existingProject.get();
            project.setName(projectDTO.getName());
            project.setDescription(projectDTO.getDescription());
            project.setStartDate(projectDTO.getStartDate());
            project.setEndDate(projectDTO.getEndDate());
            project.setState(projectDTO.getState());
            project.setInitialBudget(projectDTO.getInitialBudget());
            project.setActualBudget(projectDTO.getActualBudget());
            project.setUser(userMapper.dtoToEntity(projectDTO.getUser()));
            Project updatedProject = projectRepository.save(project);
            return projectMapper.entityToDto(updatedProject);
        }
        return null;
    }

    @Transactional
    @Override
    public Optional<ProjectDTO> getProjectById(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        project.ifPresent(p -> Hibernate.initialize(p.getBudgets()));
        return project.map(projectMapper::entityToDto);
    }


    @Override
    public List<ProjectDTO> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projectMapper.entityListToDtoList(projects);
    }

    @Override
    public boolean deleteProject(Long projectId) {
        if (projectRepository.existsById(projectId)) {
            projectRepository.deleteById(projectId);
            return true;
        } else {
            return false;
        }
    }

//    @Override
//    public void trackProgress(Long id) {
//        // Here you can implement logic to track project progress
//        // You can calculate how many tasks are completed, check delays, etc.
//        Optional<Project> project = projectRepository.findById(id);
//        if (project.isPresent()) {
//            // Implement logic to track project progress based on the tasks
//            Project existingProject = project.get();
//            // Example: You can check the project's tasks and update its status
//        }
//    }
//
//    @Override
//    public void alertOnDelays(Long id) {
//        // Implement logic to alert if there are delays on the project
//        // Example: If a task is overdue, send an alert
//        Optional<Project> project = projectRepository.findById(id);
//        if (project.isPresent()) {
//            // Check if any task is overdue and alert
//            Project existingProject = project.get();
//            // Example: You can check if any tasks have deadlines that have passed and trigger alerts
//        }
//    }


}
