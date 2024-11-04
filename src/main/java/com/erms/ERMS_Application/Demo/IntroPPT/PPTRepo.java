package com.erms.ERMS_Application.Demo.IntroPPT;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PPTRepo extends JpaRepository<PPTEntity,Long> {
}
