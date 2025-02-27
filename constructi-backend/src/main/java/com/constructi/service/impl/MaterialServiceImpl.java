package com.constructi.service.impl;

import com.constructi.DTO.MaterialRequestDTO;
import com.constructi.DTO.MaterialResponseDTO;
import com.constructi.exception.ResourceNotFoundException;
import com.constructi.mapper.MaterialMapper;
import com.constructi.model.entity.Budget;
import com.constructi.model.entity.Material;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.Provider;
import com.constructi.repository.BudgetRepository;
import com.constructi.repository.MaterialRepository;
import com.constructi.repository.ProjectRepository;
import com.constructi.repository.ProviderRepository;
import com.constructi.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final ProjectRepository projectRepository;
    private final ProviderRepository providerRepository;
    private final MaterialMapper materialMapper;
    private final BudgetRepository budgetRepository;


    @Override
    public MaterialResponseDTO createMaterial(MaterialRequestDTO materialRequestDTO) {
        Project project = projectRepository.findById(materialRequestDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + materialRequestDTO.getProjectId()));

        Provider provider = providerRepository.findById(materialRequestDTO.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + materialRequestDTO.getProviderId()));

        Double totalCost = materialRequestDTO.getPriceUnit() * materialRequestDTO.getQuantity();

        Double projectedBudget = project.getActualBudget() + totalCost;
        if (projectedBudget > project.getInitialBudget()) {
            throw new RuntimeException("Adding this material exceeds the project's initial budget. Remaining budget: " + (project.getInitialBudget() - project.getActualBudget()));
        }

        Material material = materialMapper.toEntity(materialRequestDTO);
        material.setProject(project);
        material.setProvider(provider);

        Material savedMaterial = materialRepository.save(material);

        project.setActualBudget(projectedBudget);
        projectRepository.save(project);

        Budget transaction = new Budget();
        transaction.setAmount(totalCost);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionType("material");
        transaction.setProject(project);
        budgetRepository.save(transaction);

        return materialMapper.toResponseDTO(savedMaterial);
    }
    @Override
    public MaterialResponseDTO getMaterialById(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        return materialMapper.toResponseDTO(material);
    }

    @Override
    public List<MaterialResponseDTO> getAllMaterials() {
        return materialRepository.findAll().stream()
                .map(materialMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MaterialResponseDTO updateMaterial(Long id, MaterialRequestDTO materialRequestDTO) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));

        Project project = projectRepository.findById(materialRequestDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + materialRequestDTO.getProjectId()));

        Provider provider = providerRepository.findById(materialRequestDTO.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + materialRequestDTO.getProviderId()));

        material.setName(materialRequestDTO.getName());
        material.setQuantity(materialRequestDTO.getQuantity());
        material.setPriceUnit(materialRequestDTO.getPriceUnit());
        material.setProject(project);
        material.setProvider(provider);

        Material updatedMaterial = materialRepository.save(material);

        return materialMapper.toResponseDTO(updatedMaterial);
    }


    @Override
    public void deleteMaterial(Long id) {
        if (!materialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Material not found with id: " + id);
        }
        materialRepository.deleteById(id);
    }



    @Override
    public void purchaseMaterial(Long projectId, Double materialCost) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setActualBudget(project.getActualBudget() + materialCost);

        Budget transaction = new Budget();
        transaction.setAmount(materialCost);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionType("material");
        transaction.setProject(project);

        budgetRepository.save(transaction);

        projectRepository.save(project);
    }

}
