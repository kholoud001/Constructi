package com.constructi.controller;

import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;
import com.constructi.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/add")
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody ProjectRequestDTO dto) {
        ProjectResponseDTO response = projectService.createProject(dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectRequestDTO dto) {
        ProjectResponseDTO response = projectService.updateProject(projectId, dto);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long projectId) {
        ProjectResponseDTO response = projectService.getProjectById(projectId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getAllProjects() {
        List<ProjectResponseDTO> response = projectService.getAllProjects();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok("Project with ID " + projectId + " has been successfully deleted.");
    }

    @GetMapping("/my-projects/{userId}")
    public ResponseEntity<List<ProjectResponseDTO>> getMyProjects(@PathVariable Long userId) {
        List<ProjectResponseDTO> response = projectService.getMyProjects(userId);
        return ResponseEntity.ok(response);
    }

    



//    @GetMapping("/{projectId}/progress")
//    public ResponseEntity<Void> trackProjectProgress(@PathVariable Long projectId) {
//        projectService.trackProjectProgress(projectId);
//        return ResponseEntity.ok().build();
//    }

}
