
package com.erms.ERMS_Application.DailyReport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyReportRepo extends JpaRepository<DailyReportEntity,Long> {

    List<DailyReportEntity> findAllBySalesId(Long sId);
}

