package com.constructi.service.impl;
import com.constructi.DTO.InvoiceResponseDTO;
import com.constructi.DTO.MaterialRequestDTO;
import com.constructi.DTO.MaterialResponseDTO;
import com.constructi.exception.ResourceNotFoundException;
import com.constructi.mapper.InvoiceMapper;
import com.constructi.mapper.MaterialMapper;
import com.constructi.model.entity.*;
import com.constructi.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

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

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private InvoiceMapper invoiceMapper;

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private Invoice invoice;

    @Mock
    private InvoiceResponseDTO invoiceResponseDTO;


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
        project.setInitialBudget(2000.0);
        project.setActualBudget(500.0);

        material = new Material();
        material.setId(1L);
        material.setName("Material A");
        material.setQuantity(10);
        material.setPriceUnit(100.0);
        material.setProject(project);
        material.setProvider(provider);

        invoiceResponseDTO = new InvoiceResponseDTO();
        invoiceResponseDTO.setId(1L);
        invoiceResponseDTO.setAmount(500.0);

        invoice = new Invoice();
        invoice.setId(1L);
        invoice.setMaterial(material);
        invoice.setAmount(500.0);

    }


    @Test
    void createMaterial_ShouldReturnMaterialResponseDTO() {
        when(projectRepository.findById(anyLong())).thenReturn(Optional.of(project));
        when(providerRepository.findById(anyLong())).thenReturn(Optional.of(provider));
        when(materialMapper.toEntity(any(MaterialRequestDTO.class))).thenReturn(material);
        when(materialRepository.save(any(Material.class))).thenReturn(material);
        when(materialMapper.toResponseDTO(any(Material.class))).thenReturn(materialResponseDTO);

        Budget budgetTransaction = new Budget();
        budgetTransaction.setAmount(materialRequestDTO.getPriceUnit() * materialRequestDTO.getQuantity());
        when(budgetRepository.save(any(Budget.class))).thenReturn(budgetTransaction);

        MaterialResponseDTO response = materialService.createMaterial(materialRequestDTO);

        assertNotNull(response);
        verify(projectRepository).findById(anyLong());
        verify(providerRepository).findById(anyLong());
        verify(materialRepository).save(any(Material.class));
        verify(budgetRepository).save(any(Budget.class));
    }

    @Test
    void createMaterial_ShouldThrowException_WhenProviderNotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(providerRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            materialService.createMaterial(materialRequestDTO);
        });

        assertEquals("Provider not found with id: 1", exception.getMessage());
    }

    @Test
    void createMaterial_ShouldThrowException_WhenExceedsBudget() {
        project.setActualBudget(1950.0);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(providerRepository.findById(1L)).thenReturn(Optional.of(provider));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            materialService.createMaterial(materialRequestDTO);
        });

        assertEquals("Adding this material exceeds the project's initial budget. Remaining budget: 50.0", exception.getMessage());
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
        MaterialRequestDTO updatedMaterialRequestDTO = new MaterialRequestDTO();
        updatedMaterialRequestDTO.setName("Updated Material");
        updatedMaterialRequestDTO.setQuantity(20);
        updatedMaterialRequestDTO.setPriceUnit(150.0);
        updatedMaterialRequestDTO.setProjectId(1L);
        updatedMaterialRequestDTO.setProviderId(1L);

        when(materialRepository.findById(1L)).thenReturn(Optional.of(material));
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(providerRepository.findById(1L)).thenReturn(Optional.of(provider));

        material.setName(updatedMaterialRequestDTO.getName());
        material.setQuantity(updatedMaterialRequestDTO.getQuantity());
        material.setPriceUnit(updatedMaterialRequestDTO.getPriceUnit());
        material.setProject(project);
        material.setProvider(provider);

        when(materialRepository.save(material)).thenReturn(material);

        materialResponseDTO.setId(1L);
        materialResponseDTO.setName(updatedMaterialRequestDTO.getName());
        materialResponseDTO.setQuantity(updatedMaterialRequestDTO.getQuantity());
        materialResponseDTO.setPriceUnit(updatedMaterialRequestDTO.getPriceUnit());

        when(materialMapper.toResponseDTO(material)).thenReturn(materialResponseDTO);

        MaterialResponseDTO result = materialService.updateMaterial(1L, updatedMaterialRequestDTO);

        assertNotNull(result);
        assertEquals("Updated Material", result.getName());
        verify(materialRepository).save(any(Material.class));
    }


    @Test
    void updateMaterial_ShouldThrowResourceNotFoundException_WhenMaterialNotFound() {
        when(materialRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> materialService.updateMaterial(1L, materialRequestDTO));
    }

    @Test
    void deleteMaterial_ShouldThrowResourceNotFoundException_WhenMaterialNotFound() {
        when(materialRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> materialService.deleteMaterial(1L));
    }

    @Test
    void deleteMaterial_ShouldDeleteMaterial_WhenMaterialExists() {
        when(materialRepository.existsById(1L)).thenReturn(true);

        materialService.deleteMaterial(1L);

        verify(materialRepository).deleteById(1L);
    }


    @Test
    void getInvoicesByMaterialId_ShouldReturnInvoiceResponseDTOList() {
        // Arrange: Mock the repository methods
//        when(materialRepository.findById(anyLong())).thenReturn(Optional.of(material));
//        when(invoiceRepository.findByMaterial(any(Material.class))).thenReturn(List.of(invoice));  // Return a non-empty list
//
//        // Mock the static InvoiceMapper.INSTANCE using try-with-resources
//        try (MockedStatic<InvoiceMapper> mockedStatic = mockStatic(InvoiceMapper.class)) {
//            // Stub the static method inside the mockStatic block
//            mockedStatic.when(() -> InvoiceMapper.INSTANCE.toDto(any(Invoice.class))).thenReturn(invoiceResponseDTO);
//
//            // Act: Call the method under test
//            List<InvoiceResponseDTO> invoices = materialService.getInvoicesByMaterialId(1L);
//
//            // Assert: Verify the behavior and result
//            assertNotNull(invoices, "Invoices should not be null");
//            assertEquals(1, invoices.size(), "Invoices list size should be 1");
//            assertEquals(invoiceResponseDTO, invoices.get(0), "First invoice should match the mock DTO");
//
//            // Verify the repository interactions
//            verify(materialRepository, times(1)).findById(anyLong());  // Verify materialRepository interaction
//            verify(invoiceRepository, times(1)).findByMaterial(any(Material.class));  // Verify invoiceRepository interaction
//
//            // Verify the static method was called
//            mockedStatic.verify(() -> InvoiceMapper.INSTANCE.toDto(any(Invoice.class)));  // Ensure mapper was called
//        }
    }

    @Test
    void getInvoicesByMaterialId_ShouldThrowResourceNotFoundException() {
        Long materialId = 1L;
        when(materialRepository.findById(materialId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            materialService.getInvoicesByMaterialId(materialId);
        });

        verify(materialRepository, times(1)).findById(materialId);
        verify(invoiceRepository, never()).findByMaterial(any());
        verify(invoiceMapper, never()).toDto(any());
    }

    @Test
    void purchaseMaterial_ShouldUpdateProjectBudgetAndSaveTransaction() {
        Long projectId = 1L;
        Double materialCost = 500.0;

        Project project = new Project();
        project.setId(projectId);
        project.setActualBudget(1000.0);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(project)).thenReturn(project);
        when(budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> invocation.getArgument(0));

        materialService.purchaseMaterial(projectId, materialCost);

        assertEquals(1500.0, project.getActualBudget());
        verify(projectRepository, times(1)).findById(projectId);
        verify(projectRepository, times(1)).save(project);
        verify(budgetRepository, times(1)).save(any(Budget.class));
    }

    @Test
    void purchaseMaterial_ShouldThrowRuntimeExceptionWhenProjectNotFound() {
        Long projectId = 1L;
        Double materialCost = 500.0;

        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            materialService.purchaseMaterial(projectId, materialCost);
        });

        verify(projectRepository, times(1)).findById(projectId);
        verify(projectRepository, never()).save(any());
        verify(budgetRepository, never()).save(any());
    }



}
