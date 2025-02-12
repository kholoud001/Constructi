package com.constructi.service;

import com.constructi.DTO.ProviderRequestDTO;
import com.constructi.DTO.ProviderResponseDTO;

import java.util.List;

public interface ProviderService {
    ProviderResponseDTO createProvider(ProviderRequestDTO providerRequestDTO);

    ProviderResponseDTO getProviderById(Long id);

    List<ProviderResponseDTO> getAllProviders();

    ProviderResponseDTO updateProvider(Long id, ProviderRequestDTO providerRequestDTO);

    void deleteProvider(Long id);
}
