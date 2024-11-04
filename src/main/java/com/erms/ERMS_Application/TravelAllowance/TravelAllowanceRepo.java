package com.erms.ERMS_Application.TravelAllowance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelAllowanceRepo extends JpaRepository<TravelAllowanceEntity,Long> {

    List<TravelAllowanceEntity> findAllBySalesId(Long sId);
}
