package com.constructi.custom;

import com.constructi.DTO.ProjectRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


import java.time.LocalDate;

public class EndDateAfterStartDateValidator implements ConstraintValidator<EndDateAfterStartDate, ProjectRequestDTO> {

    @Override
    public boolean isValid(ProjectRequestDTO dto, ConstraintValidatorContext context) {
        LocalDate startDate = dto.getStartDate();
        LocalDate endDate = dto.getEndDate();

        if (startDate == null || endDate == null) {
            return true;
        }

        return endDate.isAfter(startDate) || endDate.isEqual(startDate);
    }
}

