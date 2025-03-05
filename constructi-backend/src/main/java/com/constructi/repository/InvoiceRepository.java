package com.constructi.repository;

import com.constructi.model.entity.Invoice;
import com.constructi.model.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUserId(Long userId);

    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.task.id = :taskId")
    Double sumAmountByTaskId(@Param("taskId") Long taskId);

    List<Invoice> findByMaterialId(Long materialId);


    Collection<Invoice> findByMaterial(Material material);
}