package com.busbooking.repository;

import com.busbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA repository for User entity.
 * Owner: Backend-1
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Used by AuthService to look up user during login and by SecurityConfig for UserDetailsService. */
    Optional<User> findByEmail(String email);

    /** Quick existence check during registration to prevent duplicates. */
    boolean existsByEmail(String email);
}
