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

//        @Query("SELECT new com.constructi.DTO.TaskResponseDTO( " +
//                "t.id, t.description, t.status, t.beginDate, t.dateEndEstimated, t.effectiveTime, " +
//                "t.project.id, u.id, u.email) " +
//                "FROM Task t JOIN t.user u WHERE t.project.id = :projectId")
//        List<TaskResponseDTO> findTasksByProjectId(@Param("projectId") Long projectId);


}
