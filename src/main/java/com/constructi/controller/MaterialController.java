package com.constructi.controller;

import com.constructi.DTO.MaterialRequestDTO;
import com.constructi.DTO.MaterialResponseDTO;
import com.constructi.service.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;


    @PostMapping("/add")
    public ResponseEntity<MaterialResponseDTO> createMaterial(@Valid @RequestBody MaterialRequestDTO materialRequestDTO) {
        MaterialResponseDTO createdMaterial = materialService.createMaterial(materialRequestDTO);
        return new ResponseEntity<>(createdMaterial, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> getMaterialById(@PathVariable Long id) {
        MaterialResponseDTO material = materialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> getAllMaterials() {
        List<MaterialResponseDTO> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MaterialResponseDTO> updateMaterial(@PathVariable Long id, @Valid @RequestBody MaterialRequestDTO materialRequestDTO) {
        MaterialResponseDTO updatedMaterial = materialService.updateMaterial(id, materialRequestDTO);
        return ResponseEntity.ok(updatedMaterial);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok("Material deleted successfully.");
    }
}
