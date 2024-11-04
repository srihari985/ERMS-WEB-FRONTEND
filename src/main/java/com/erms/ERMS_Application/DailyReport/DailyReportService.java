package com.erms.ERMS_Application.DailyReport;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DailyReportService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private DailyReportRepo dailyReportRepo;

    public DailyReportEntity saveDailyReport(Long sId, String name, String totalVisits, String requirements, String additionalComments, LocalDate date) {


        Sales sale = salesRepository.findById(sId)
                .orElseThrow(() -> new EntityNotFoundException("Sales not found with id: " + sId));

        DailyReportEntity newReport = new DailyReportEntity();

        newReport.setName(name);
        newReport.setDate(date);
        newReport.setTotalVisits(totalVisits);
        newReport.setRequirements(requirements);
        newReport.setAdditionalComments(additionalComments);
        newReport.setSales(sale);

        return dailyReportRepo.save(newReport);


    }

    public List<DailyReportDTO> getAllDailyReports() {
        return dailyReportRepo.findAll().stream()
                .map(this::convertToDTO) // Convert to DTO
                .collect(Collectors.toList());
    }

    private DailyReportDTO convertToDTO(DailyReportEntity dailyReportEntity) {
        DailyReportDTO dto = new DailyReportDTO();
        dto.setDrId(dailyReportEntity.getDrId());
        dto.setName(dailyReportEntity.getName());
        dto.setDate(dailyReportEntity.getDate());
        dto.setTotalVisits(dailyReportEntity.getTotalVisits());
        dto.setRequirements(dailyReportEntity.getRequirements());
        dto.setAdditionalComments(dailyReportEntity.getAdditionalComments());
        dto.setSalesId(dailyReportEntity.getSales().getSalesId());  // Assuming there's a salesId in Sales entity
        return dto;

    }

    public List<DailyReportDTO> getDailyReportsBySalesId(Long sId) {
        // Fetch all Daily Report  entities by salesId
        List<DailyReportEntity> dailyReport = dailyReportRepo.findAllBySalesId(sId);

        // Convert the list of entities to DTOs
        return dailyReport.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update Daily Report logic
    public boolean updateMultipleDailyReports(Long sId, List<Long> drIds, Optional<String> name,
                                              Optional<String> totalVisits, Optional<String> requirements,
                                              Optional<String> additionalComments) {

        boolean isUpdated = false;

        for (Long drId : drIds) {
            Optional<DailyReportEntity> optionalReport = dailyReportRepo.findById(drId);

            if (optionalReport.isPresent()) {
                DailyReportEntity report = optionalReport.get();

                // Check if the report belongs to the provided sId
                if (report.getSales().getId().equals(sId)) {
                    // Update only the provided fields
                    name.ifPresent(report::setName);
                    totalVisits.ifPresent(report::setTotalVisits);
                    requirements.ifPresent(report::setRequirements);
                    additionalComments.ifPresent(report::setAdditionalComments);

                    dailyReportRepo.save(report);
                    isUpdated = true;  // At least one report was updated
                }
            }
        }

        return isUpdated;
    }


}
