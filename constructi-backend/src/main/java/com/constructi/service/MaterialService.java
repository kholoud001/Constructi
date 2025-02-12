package com.constructi.service;

import com.constructi.DTO.MaterialRequestDTO;
import com.constructi.DTO.MaterialResponseDTO;

import java.util.List;

public interface MaterialService {
    MaterialResponseDTO createMaterial(MaterialRequestDTO materialRequestDTO);

    MaterialResponseDTO getMaterialById(Long id);

    List<MaterialResponseDTO> getAllMaterials();

    MaterialResponseDTO updateMaterial(Long id, MaterialRequestDTO materialRequestDTO);

    void deleteMaterial(Long id);
}
