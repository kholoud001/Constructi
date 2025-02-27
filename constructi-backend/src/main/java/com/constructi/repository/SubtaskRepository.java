package com.constructi.repository;

import com.constructi.model.entity.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
    List<Subtask> findByParentTaskId(Long parentTaskId);
    List<Subtask> findByUserId(Long userId);

}