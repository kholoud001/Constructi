package com.constructi.repository;

import com.constructi.DTO.TaskResponseDTO;
import com.constructi.model.entity.Task;
import com.constructi.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {

    List<Task> findByUserId(Long userId);
    List<Task> findByUser(User user);



}
