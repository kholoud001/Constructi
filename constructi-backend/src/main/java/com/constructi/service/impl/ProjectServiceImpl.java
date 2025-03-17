package com.constructi.service.impl;

import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.exception.InvalidProjectDateException;
import com.constructi.mapper.ProjectMapper;
import com.constructi.mapper.UserMapper;
import com.constructi.mapper.TaskMapper;
import com.constructi.mapper.BudgetMapper;

import com.constructi.model.entity.Project;
import com.constructi.model.entity.User;
import com.constructi.model.entity.Task;
import com.constructi.model.enums.ProjectState;
import com.constructi.model.enums.StatusTask;

import com.constructi.repository.InvoiceRepository;
import com.constructi.repository.ProjectRepository;
import com.constructi.repository.UserRepository;
import com.constructi.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service("projectService")
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final TaskMapper taskMapper;
    private final BudgetMapper budgetMapper;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public ProjectResponseDTO createProject(ProjectRequestDTO dto) {
        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        validateProjectDates(dto.getStartDate(), dto.getEndDate());

        User user = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with email: " + authenticatedUserEmail));

        Project project = projectMapper.toEntity(dto);
        project.setUser(user);
        project.setActualBudget(0.0);

        project = projectRepository.save(project);
        return projectMapper.toDto(project);
    }



    @Override
    public ProjectResponseDTO updateProject(Long id, ProjectRequestDTO dto) {

        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with email: " + authenticatedUserEmail));

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        if (!existingProject.getUser().getEmail().equals(authenticatedUserEmail)) {
            throw new SecurityException("You do not have permission to update this project.");
        }

        validateProjectDates(dto.getStartDate(), dto.getEndDate());

        existingProject.setName(dto.getName());
        existingProject.setDescription(dto.getDescription());
        existingProject.setStartDate(dto.getStartDate());
        existingProject.setEndDate(dto.getEndDate());
//        existingProject.setState(ProjectState.valueOf(dto.getState()));
        existingProject.setInitialBudget(dto.getInitialBudget());

        Project updatedProject = projectRepository.save(existingProject);

        return projectMapper.toDto(updatedProject);
    }


    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }


    @Override
    public ProjectResponseDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return projectMapper.toDto(project);
    }

    @Override
    public ProjectResponseDTO getProjectByIdForAssignedUser(Long id) {
        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User authenticatedUser = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + authenticatedUserEmail));

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        ProjectResponseDTO projectDTO = projectMapper.toDto(project);

        List<TaskResponseDTO> userTasks = project.getTasks().stream()
                .filter(task -> task.getUser().getId().equals(authenticatedUser.getId()))
                .map(taskMapper::toTaskResponseDTO)
                .collect(Collectors.toList());

        projectDTO.setTasks(userTasks);
        return projectDTO;
    }


    @Override
    public List<ProjectResponseDTO> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponseDTO> getMyProjects() {
        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with email: " + authenticatedUserEmail));

        List<Project> myProjects = projectRepository.findProjectsByAssignedUser(authenticatedUser.getId());

        return myProjects.stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }


    private void validateProjectDates(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(LocalDate.now())) {
            throw new InvalidProjectDateException("Start date cannot be in the future.");
        }
        if (endDate.isBefore(startDate)) {
            throw new InvalidProjectDateException("End date cannot be before the start date.");
        }
    }


    @Override
    public ProjectResponseDTO getProjectDetails(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        ProjectResponseDTO responseDTO = projectMapper.toDto(project);

        responseDTO.setTasks(taskMapper.toDtoList(project.getTasks()));

        responseDTO.setBudgets(budgetMapper.toDtoList(project.getBudgets()));


        return responseDTO;
    }


    @Override
    public boolean isAssignedToProjectViaTask(String email, Long projectId) {
        return projectRepository.isUserAssignedToProjectThroughTask(email, projectId);
    }




}
