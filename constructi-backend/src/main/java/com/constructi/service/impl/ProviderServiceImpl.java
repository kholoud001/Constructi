package com.constructi.service.impl;

import com.constructi.DTO.ProviderRequestDTO;
import com.constructi.DTO.ProviderResponseDTO;
import com.constructi.exception.ResourceNotFoundException;
import com.constructi.mapper.ProviderMapper;
import com.constructi.model.entity.Provider;
import com.constructi.repository.ProviderRepository;
import com.constructi.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;
    private final ProviderMapper providerMapper;

    @Override
    public ProviderResponseDTO createProvider(ProviderRequestDTO providerRequestDTO) {
        Provider provider = providerMapper.toEntity(providerRequestDTO);
        Provider savedProvider = providerRepository.save(provider);
        return providerMapper.toResponseDTO(savedProvider);
    }

    @Override
    public ProviderResponseDTO getProviderById(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        return providerMapper.toResponseDTO(provider);
    }

    @Override
    public List<ProviderResponseDTO> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(providerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProviderResponseDTO updateProvider(Long id, ProviderRequestDTO providerRequestDTO) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        provider.setName(providerRequestDTO.getName());
        provider.setPhone(providerRequestDTO.getPhone());
        provider.setAddress(providerRequestDTO.getAddress());
        Provider updatedProvider = providerRepository.save(provider);
        return providerMapper.toResponseDTO(updatedProvider);
    }

    @Override
    public void deleteProvider(Long id) {
        if (!providerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Provider not found with id: " + id);
        }
        providerRepository.deleteById(id);
    }
}