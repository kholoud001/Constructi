package com.constructi.service.impl;

import com.constructi.DTO.ProviderRequestDTO;
import com.constructi.DTO.ProviderResponseDTO;
import com.constructi.exception.ResourceNotFoundException;
import com.constructi.mapper.ProviderMapper;
import com.constructi.model.entity.Provider;
import com.constructi.repository.ProviderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProviderServiceImplTest {

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private ProviderMapper providerMapper;

    @InjectMocks
    private ProviderServiceImpl providerService;

    private Provider provider;
    private ProviderRequestDTO providerRequestDTO;
    private ProviderResponseDTO providerResponseDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        provider = new Provider();
        provider.setId(1L);
        provider.setName("Test Provider");

        providerRequestDTO = new ProviderRequestDTO();
        providerRequestDTO.setName("Test Provider");

        providerResponseDTO = new ProviderResponseDTO();
        providerResponseDTO.setId(1L);
        providerResponseDTO.setName("Test Provider");
    }

    @Test
    void testCreateProvider() {
        when(providerMapper.toEntity(any(ProviderRequestDTO.class))).thenReturn(provider);
        when(providerRepository.save(any(Provider.class))).thenReturn(provider);
        when(providerMapper.toResponseDTO(any(Provider.class))).thenReturn(providerResponseDTO);

        ProviderResponseDTO result = providerService.createProvider(providerRequestDTO);

        assertNotNull(result);
        assertEquals(providerResponseDTO.getId(), result.getId());
        assertEquals(providerResponseDTO.getName(), result.getName());

        verify(providerRepository, times(1)).save(any(Provider.class));
    }

    @Test
    void testGetProviderById_WhenExists() {
        when(providerRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(providerMapper.toResponseDTO(any(Provider.class))).thenReturn(providerResponseDTO);

        ProviderResponseDTO result = providerService.getProviderById(1L);

        assertNotNull(result);
        assertEquals(providerResponseDTO.getId(), result.getId());

        verify(providerRepository, times(1)).findById(1L);
    }

    @Test
    void testGetProviderById_WhenNotExists() {
        when(providerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> providerService.getProviderById(1L));

        verify(providerRepository, times(1)).findById(1L);
    }

    @Test
    void testGetAllProviders() {
        when(providerRepository.findAll()).thenReturn(List.of(provider));
        when(providerMapper.toResponseDTO(any(Provider.class))).thenReturn(providerResponseDTO);

        List<ProviderResponseDTO> result = providerService.getAllProviders();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(providerResponseDTO.getId(), result.get(0).getId());

        verify(providerRepository, times(1)).findAll();
    }

    @Test
    void testUpdateProvider_WhenExists() {
        when(providerRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(providerRepository.save(any(Provider.class))).thenReturn(provider);
        when(providerMapper.toResponseDTO(any(Provider.class))).thenReturn(providerResponseDTO);

        ProviderResponseDTO result = providerService.updateProvider(1L, providerRequestDTO);

        assertNotNull(result);
        assertEquals(providerResponseDTO.getId(), result.getId());
        assertEquals(providerResponseDTO.getName(), result.getName());

        verify(providerRepository, times(1)).save(any(Provider.class));
    }

    @Test
    void testUpdateProvider_WhenNotExists() {
        when(providerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> providerService.updateProvider(1L, providerRequestDTO));

        verify(providerRepository, never()).save(any(Provider.class));
    }

    @Test
    void testDeleteProvider_WhenExists() {
        when(providerRepository.existsById(1L)).thenReturn(true);

        providerService.deleteProvider(1L);

        verify(providerRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteProvider_WhenNotExists() {
        when(providerRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> providerService.deleteProvider(1L));

        verify(providerRepository, never()).deleteById(1L);
    }
}
