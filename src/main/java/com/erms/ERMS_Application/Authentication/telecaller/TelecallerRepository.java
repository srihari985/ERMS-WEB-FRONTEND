package com.erms.ERMS_Application.Authentication.telecaller;

import com.erms.ERMS_Application.Authentication.technician.Technician;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TelecallerRepository extends JpaRepository<Telecaller, Long> {

    Optional<Telecaller> findByEmail(String email);

    @Query("SELECT t.telecallerId FROM Telecaller t ORDER BY t.telecallerId DESC")
    List<String> findUserRoleIdByRole(Pageable pageable);


    boolean existsByEmail(String email);
}
