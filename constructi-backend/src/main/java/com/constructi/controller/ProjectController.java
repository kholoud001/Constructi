package com.constructi.controller;


import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;
import com.constructi.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;


    @PreAuthorize("hasAuthority('ROLE_ADMIN') or " +
            "@projectService.isAssignedToProjectViaTask(authentication.principal.username, #projectId)")
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long projectId) {
        ProjectResponseDTO response = projectService.getProjectById(projectId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody ProjectRequestDTO dto) {
        ProjectResponseDTO response = projectService.createProject(dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{projectId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectRequestDTO dto) {
        ProjectResponseDTO response = projectService.updateProject(projectId, dto);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ProjectResponseDTO>> getAllProjects() {
        List<ProjectResponseDTO> response = projectService.getAllProjects();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-projects")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
    public ResponseEntity<List<ProjectResponseDTO>> getMyProjects() {
        List<ProjectResponseDTO> response = projectService.getMyProjects();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{projectId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok("Project with ID " + projectId + " has been successfully deleted.");
    }


    @GetMapping("/{projectId}/progress")
    public ResponseEntity<Double> getProjectProgress(@PathVariable Long projectId) {
        double progress = projectService.getProjectProgress(projectId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/{projectId}/details")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProjectResponseDTO> getProjectDetails(@PathVariable Long projectId) {
        ProjectResponseDTO projectDetails = projectService.getProjectDetails(projectId);
        return ResponseEntity.ok(projectDetails);
    }

    



}
