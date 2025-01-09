package com.constructi.controller;

import com.constructi.DTO.ProjectDTO;
import com.constructi.service.ProjectService;
import lombok.NoArgsConstructor;
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
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        ProjectDTO createdProject = projectService.createProject(projectDTO);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long projectId, @RequestBody ProjectDTO projectDTO) {
        ProjectDTO updatedProject = projectService.updateProject(projectId, projectDTO);
        if (updatedProject != null) {
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long projectId) {
        Optional<ProjectDTO> projectDTO = projectService.getProjectById(projectId);
        return projectDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/{projectId}/progress")
//    public ResponseEntity<Void> trackProjectProgress(@PathVariable Long projectId) {
//        projectService.trackProjectProgress(projectId);
//        return ResponseEntity.ok().build();
//    }

}
