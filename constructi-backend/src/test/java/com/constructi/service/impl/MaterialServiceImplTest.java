package com.constructi.service.impl;
import com.constructi.DTO.MaterialRequestDTO;
import com.constructi.DTO.MaterialResponseDTO;
import com.constructi.exception.ResourceNotFoundException;
import com.constructi.mapper.MaterialMapper;
import com.constructi.model.entity.Material;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.Provider;
import com.constructi.repository.MaterialRepository;
import com.constructi.repository.ProjectRepository;
import com.constructi.repository.ProviderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MaterialServiceImplTest {

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private MaterialMapper materialMapper;

    @InjectMocks
    private MaterialServiceImpl materialService;

    private MaterialRequestDTO materialRequestDTO;
    private MaterialResponseDTO materialResponseDTO;
    private Material material;
    private Project project;
    private Provider provider;

    @BeforeEach
    void setUp() {
        materialRequestDTO = new MaterialRequestDTO();
        materialRequestDTO.setName("Material A");
        materialRequestDTO.setQuantity(10);
        materialRequestDTO.setPriceUnit(100.0);
        materialRequestDTO.setProjectId(1L);
        materialRequestDTO.setProviderId(1L);

        materialResponseDTO = new MaterialResponseDTO();
        materialResponseDTO.setId(1L);
        materialResponseDTO.setName("Material A");
        materialResponseDTO.setQuantity(10);
        materialResponseDTO.setPriceUnit(100.0);

        project = new Project();
        project.setId(1L);
        project.setName("Project A");

        provider = new Provider();
        provider.setId(1L);
        provider.setName("Provider A");

        material = new Material();
        material.setId(1L);
        material.setName("Material A");
        material.setQuantity(10);
        material.setPriceUnit(100.0);
        material.setProject(project);
        material.setProvider(provider);
    }


    @Test
    void createMaterial_ShouldReturnMaterialResponseDTO() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(providerRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(materialMapper.toEntity(materialRequestDTO)).thenReturn(material);
        when(materialRepository.save(material)).thenReturn(material);
        when(materialMapper.toResponseDTO(material)).thenReturn(materialResponseDTO);

        MaterialResponseDTO result = materialService.createMaterial(materialRequestDTO);

        assertNotNull(result);
        assertEquals("Material A", result.getName());
        verify(materialRepository).save(any(Material.class));
    }

    @Test
    void createMaterial_ShouldThrowResourceNotFoundException_WhenProjectNotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> materialService.createMaterial(materialRequestDTO));
    }

    @Test
    void getMaterialById_ShouldReturnMaterialResponseDTO() {
        when(materialRepository.findById(1L)).thenReturn(Optional.of(material));
        when(materialMapper.toResponseDTO(material)).thenReturn(materialResponseDTO);

        MaterialResponseDTO result = materialService.getMaterialById(1L);

        assertNotNull(result);
        assertEquals("Material A", result.getName());
    }

    @Test
    void getMaterialById_ShouldThrowResourceNotFoundException_WhenMaterialNotFound() {
        when(materialRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> materialService.getMaterialById(1L));
    }

    @Test
    void getAllMaterials_ShouldReturnListOfMaterialResponseDTO() {
        when(materialRepository.findAll()).thenReturn(List.of(material));
        when(materialMapper.toResponseDTO(material)).thenReturn(materialResponseDTO);

        List<MaterialResponseDTO> result = materialService.getAllMaterials();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Material A", result.get(0).getName());
    }


    @Test
    void updateMaterial_ShouldReturnUpdatedMaterialResponseDTO() {
        // Initialize updatedMaterialRequestDTO using setters
        MaterialRequestDTO updatedMaterialRequestDTO = new MaterialRequestDTO();
        updatedMaterialRequestDTO.setName("Updated Material");
        updatedMaterialRequestDTO.setQuantity(20);
        updatedMaterialRequestDTO.setPriceUnit(150.0);
        updatedMaterialRequestDTO.setProjectId(1L);
        updatedMaterialRequestDTO.setProviderId(1L);

        // Mock the repository methods
        when(materialRepository.findById(1L)).thenReturn(Optional.of(material));
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(providerRepository.findById(1L)).thenReturn(Optional.of(provider));

        // Update the material entity with new values before saving
        material.setName(updatedMaterialRequestDTO.getName());
        material.setQuantity(updatedMaterialRequestDTO.getQuantity());
        material.setPriceUnit(updatedMaterialRequestDTO.getPriceUnit());
        material.setProject(project);
        material.setProvider(provider);

        // Mock the repository save to return the updated material
        when(materialRepository.save(material)).thenReturn(material);

        // Update the materialResponseDTO to reflect the updated material
        materialResponseDTO.setId(1L);
        materialResponseDTO.setName(updatedMaterialRequestDTO.getName());
        materialResponseDTO.setQuantity(updatedMaterialRequestDTO.getQuantity());
        materialResponseDTO.setPriceUnit(updatedMaterialRequestDTO.getPriceUnit());

        // Mock materialMapper to return the updated materialResponseDTO
        when(materialMapper.toResponseDTO(material)).thenReturn(materialResponseDTO);

        // Call the method
        MaterialResponseDTO result = materialService.updateMaterial(1L, updatedMaterialRequestDTO);

        // Verify the results
        assertNotNull(result);
        assertEquals("Updated Material", result.getName());  // Ensure the name was updated
        verify(materialRepository).save(any(Material.class));  // Ensure save was called
    }


    @Test
    void updateMaterial_ShouldThrowResourceNotFoundException_WhenMaterialNotFound() {
        when(materialRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> materialService.updateMaterial(1L, materialRequestDTO));
    }

    @Test
    void deleteMaterial_ShouldThrowResourceNotFoundException_WhenMaterialNotFound() {
        // Mock dependencies
        when(materialRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> materialService.deleteMaterial(1L));
    }

    @Test
    void deleteMaterial_ShouldDeleteMaterial_WhenMaterialExists() {
        when(materialRepository.existsById(1L)).thenReturn(true);

        materialService.deleteMaterial(1L);

        verify(materialRepository).deleteById(1L);
    }
}
