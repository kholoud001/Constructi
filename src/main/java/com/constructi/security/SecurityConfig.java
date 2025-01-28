package com.constructi.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .cors(customizer -> customizer.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/auth/register", "/auth/login").permitAll()
                        .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
//                        .requestMatchers("/architect/**").hasAuthority("ROLE_ARCHITECT")
//                        .requestMatchers("/worker/**").hasAuthority("ROLE_WORKER")
                                .requestMatchers(HttpMethod.GET, "/projects/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT", "ROLE_WORKER")
                                .requestMatchers(HttpMethod.POST, "/projects/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT")
                                .requestMatchers(HttpMethod.PUT, "/projects/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT")
                                .requestMatchers(HttpMethod.DELETE, "/projects/**").hasAuthority("ROLE_ADMIN")
                                .requestMatchers(HttpMethod.GET, "/tasks/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT", "ROLE_WORKER")
                                .requestMatchers(HttpMethod.POST, "/tasks/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT")
                                .requestMatchers(HttpMethod.PUT, "/tasks/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT")
                                .requestMatchers(HttpMethod.DELETE, "/tasks/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/resources/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/reports/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT")
                        .requestMatchers("/discussion/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ARCHITECT", "ROLE_WORKER")
//
                        .anyRequest().authenticated()
                )
                .csrf(customizer -> customizer.disable())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


}

