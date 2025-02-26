package com.constructi.repository;

import com.constructi.model.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUserId(Long userId);

    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.task.id = :taskId")
    Double sumAmountByTaskId(@Param("taskId") Long taskId);

}