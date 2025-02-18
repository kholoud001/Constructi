package com.constructi.service.impl;

import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;
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

import com.constructi.repository.ProjectRepository;
import com.constructi.repository.UserRepository;
import com.constructi.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserMapper userMapper;
    private final TaskMapper taskMapper;
    private final BudgetMapper budgetMapper;
    private final UserRepository userRepository;

    @Override
    public ProjectResponseDTO createProject(ProjectRequestDTO dto) {

        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        validateProjectDates(dto.getStartDate(), dto.getEndDate());

        User user = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with email: " + authenticatedUserEmail));

        Project project = projectMapper.toEntity(dto);
        project.setUser(user);

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
        existingProject.setState(ProjectState.valueOf(dto.getState()));
        existingProject.setInitialBudget(dto.getInitialBudget());
        existingProject.setActualBudget(dto.getActualBudget());

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

        List<Project> myProjects = projectRepository.findAll().stream()
                .filter(project -> project.getUser().getId().equals(authenticatedUser.getId()))
                .toList();

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

    @Override
    public double getProjectProgress(Long projectId) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);
        if (optionalProject.isEmpty()) {
            throw new RuntimeException("Project not found");
        }

        Project project = optionalProject.get();
        List<Task> tasks = project.getTasks();

        if (tasks.isEmpty()) {
            return 0.0;
        }

        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == StatusTask.FINISHED)
                .count();

        return (double) completedTasks / tasks.size() * 100;
    }



    @Override
    public ProjectResponseDTO getProjectDetails(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        // Mapper l'entité Project vers DTO
        ProjectResponseDTO responseDTO = projectMapper.toDto(project);

        // Ajouter les tâches sous forme de DTOs
        responseDTO.setTasks(taskMapper.toDtoList(project.getTasks()));

        // Ajouter les budgets sous forme de DTOs
        responseDTO.setBudgets(budgetMapper.toDtoList(project.getBudgets()));

        // Calcul du progrès du projet
        responseDTO.setProgress(calculateProjectProgress(project));

        return responseDTO;
    }

    private double calculateProjectProgress(Project project) {
        List<Task> tasks = project.getTasks();
        if (tasks.isEmpty()) return 0.0;

        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == StatusTask.FINISHED)
                .count();

        return (double) completedTasks / tasks.size() * 100;
    }



}
