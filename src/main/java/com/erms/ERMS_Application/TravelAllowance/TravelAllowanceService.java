package com.erms.ERMS_Application.TravelAllowance;

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
public class TravelAllowanceService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private TravelAllowanceRepo travelAllowanceRepo;

    // Save new Travel Allowance method
    public void saveTravelAllowance(Long sId, String name, LocalDate date, String customerName, String travelFrom, String travelTo,
                                    String travelType, long noOfDays, float travelCost) {
        Sales sales = salesRepository.findById(sId)
                .orElseThrow(() -> new EntityNotFoundException("Sales not found with id: " + sId));

        TravelAllowanceEntity travelAllowance = new TravelAllowanceEntity(
                name, date, customerName, travelFrom, travelTo, travelType, noOfDays, travelCost, sales);

        travelAllowanceRepo.save(travelAllowance);
    }

    // Fetch all Travel Allowances
    public List<TravelAllowanceDTO> getAllTravelAllowances() {
        return travelAllowanceRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Fetch Travel Allowances by Sales ID
    public List<TravelAllowanceDTO> getTravelAllowancesBySalesId(Long sId) {
        List<TravelAllowanceEntity> allowances = travelAllowanceRepo.findAllBySalesId(sId);
        return allowances.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // The core method to update multiple daily reports
    public boolean updateMultipleTravelReports(Long sId, List<Long> tIds, Optional<String> name,
                                               Optional<String> totalVisits, Optional<String> requirements,
                                               Optional<String> additionalComments) {

        boolean isUpdated = false;

        for (Long tId : tIds) {
            Optional<TravelAllowanceEntity> optionalAllowance = travelAllowanceRepo.findById(tId);

            if (optionalAllowance.isPresent()) {
                TravelAllowanceEntity allowance = optionalAllowance.get();

                // Check if the Travel Allowance belongs to the provided Sales ID
                if (allowance.getSales().getSalesId().equals(sId)) {
                    // Update only the provided fields
                    name.ifPresent(allowance::setName);
                    totalVisits.ifPresent(tv -> allowance.setTravelCost(Float.parseFloat(tv)));  // Assuming totalVisits refers to travelCost here
                    requirements.ifPresent(allowance::setTravelType);  // Assuming requirements refers to travelType
                    additionalComments.ifPresent(allowance::setCustomerName);

                    travelAllowanceRepo.save(allowance);
                    isUpdated = true;  // At least one allowance was updated
                }
            }
        }

        return isUpdated;
    }

    // Convert TravelAllowanceEntity to TravelAllowanceDTO
    private TravelAllowanceDTO convertToDTO(TravelAllowanceEntity travelAllowanceEntity) {
        TravelAllowanceDTO dto = new TravelAllowanceDTO();
        dto.settId(travelAllowanceEntity.gettId());
        dto.setName(travelAllowanceEntity.getName());
        dto.setDate(travelAllowanceEntity.getDate());
        dto.setCustomerName(travelAllowanceEntity.getCustomerName());
        dto.setTravelFrom(travelAllowanceEntity.getTravelFrom());
        dto.setTravelTo(travelAllowanceEntity.getTravelTo());
        dto.setTravelType(travelAllowanceEntity.getTravelType());
        dto.setNoOfDays(travelAllowanceEntity.getNoOfDays());
        dto.setTravelCost(travelAllowanceEntity.getTravelCost());
        dto.setSalesId(travelAllowanceEntity.getSales().getSalesId());
        return dto;
    }
}