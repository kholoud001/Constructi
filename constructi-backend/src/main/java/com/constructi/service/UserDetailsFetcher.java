package com.constructi.service;


import com.constructi.model.entity.User;
import org.springframework.transaction.annotation.Transactional;

public interface UserDetailsFetcher {
    User findByEmail(String email);
}
