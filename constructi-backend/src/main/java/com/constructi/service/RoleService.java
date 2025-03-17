package com.constructi.service;

import java.util.List;
import com.constructi.model.entity.Role;


public interface RoleService {

    void seedRoles();

    List<Role> findAllRoles();
}
