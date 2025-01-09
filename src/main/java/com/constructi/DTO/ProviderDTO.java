package com.constructi.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDTO {

    private Long id;

    @NotBlank(message = "Provider name is required.")
    @Size(max = 100, message = "Provider name must not exceed 100 characters.")
    private String name;

    //private List<Long> materialIds;
    private List<MaterialDTO> materialsList;

}