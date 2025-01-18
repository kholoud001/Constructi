package com.constructi.repository;

import com.constructi.model.entity.Role;
import com.constructi.model.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {

    boolean existsByRoleType(RoleType roleType);

}
