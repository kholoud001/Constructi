package com.constructi.DTO;

import lombok.Data;

@Data
public class MaterialResponseDTO {

    private Long id;
    private String name;
    private Integer quantity;
    private Double priceUnit;
    private Long projectId;
    private Long providerId;
    private String providerName;

}
