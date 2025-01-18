package com.constructi.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {

        http
//                .cors(customizer -> customizer.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authz -> authz
                                .requestMatchers("/register", "/login", "/projects/**",
                                        "/tasks/**","/users/**").permitAll()
//                        .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
//                        .requestMatchers("/user/**").hasAuthority("ROLE_USER")
//                        .requestMatchers("/organizer/**").hasAuthority("ROLE_ORGANIZER")
                                .anyRequest().authenticated()
                )
                .csrf(customizer -> customizer.disable());

        return http.build();
    }


}

