package com.constructi.repository;

import com.constructi.model.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
    List<Project> findByUserId(Long userId);

    @Query("""
        SELECT COUNT(t) > 0
        FROM Task t
        JOIN t.user u
        WHERE u.email = :email\s
        AND t.project.id = :projectId
   \s""")
    boolean isUserAssignedToProjectThroughTask(@Param("email") String email, @Param("projectId") Long projectId);

    @Query("SELECT p FROM Project p JOIN p.tasks t WHERE t.user.id = :userId")
    List<Project> findProjectsByAssignedUser(@Param("userId") Long userId);

}
