package com.erms.ERMS_Application.PertrolAllowance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PertrolAllowanceRepo extends JpaRepository<PetrolAllowanceEntity,Long> {

    List<PetrolAllowanceEntity> findAllBySalesId(Long sId);
}
