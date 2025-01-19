package com.constructi.controller;


import com.constructi.DTO.ProviderRequestDTO;
import com.constructi.DTO.ProviderResponseDTO;
import com.constructi.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @PostMapping("/add")
    public ResponseEntity<ProviderResponseDTO> createProvider(@Valid @RequestBody ProviderRequestDTO providerRequestDTO) {
        ProviderResponseDTO createdProvider = providerService.createProvider(providerRequestDTO);
        return new ResponseEntity<>(createdProvider, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderResponseDTO> getProviderById(@PathVariable Long id) {
        ProviderResponseDTO provider = providerService.getProviderById(id);
        return ResponseEntity.ok(provider);
    }

    @GetMapping
    public ResponseEntity<List<ProviderResponseDTO>> getAllProviders() {
        List<ProviderResponseDTO> providers = providerService.getAllProviders();
        return ResponseEntity.ok(providers);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProviderResponseDTO> updateProvider(@PathVariable Long id, @Valid @RequestBody ProviderRequestDTO providerRequestDTO) {
        ProviderResponseDTO updatedProvider = providerService.updateProvider(id, providerRequestDTO);
        return ResponseEntity.ok(updatedProvider);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.ok("Provider deleted successfully.");
    }
}
