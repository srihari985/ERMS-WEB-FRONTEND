package com.erms.ERMS_Application.FoodAllowance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodAllowanceRepo extends JpaRepository<FoodAllowanceEntity,Long> {

    List<FoodAllowanceEntity> findAllBySalesId(Long sId);
}
