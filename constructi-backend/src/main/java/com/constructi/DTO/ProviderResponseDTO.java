package com.constructi.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ProviderResponseDTO {
    private Long id;
    private String name;
    private String phone;
    private String address;
    private List<MaterialResponseDTO> materials;
}