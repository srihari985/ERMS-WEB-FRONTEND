package com.erms.ERMS_Application.FoodAllowance;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodAllowanceService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private FoodAllowanceRepo foodAllowanceRepo;

    // Save new Food Allowance method
    public void saveFoodAllowance(Long sId,String name, LocalDate date, String customerName, String noOfPersons, float foodCost) {
        Sales sales = salesRepository.findById(sId)
                .orElseThrow(() -> new EntityNotFoundException("Sales not found with id: " + sId));

        FoodAllowanceEntity foodAllowance = new FoodAllowanceEntity(name,
                date, customerName, noOfPersons, foodCost, sales);

        foodAllowanceRepo.save(foodAllowance);
    }

    // Fetch all Food Allowances
    public List<FoodAllowanceDTO> getAllFoodAllowances() {
        return foodAllowanceRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Fetch Food Allowances by Sales ID
    public List<FoodAllowanceDTO> getFoodAllowancesBySalesId(Long sId) {
        List<FoodAllowanceEntity> allowances = foodAllowanceRepo.findAllBySalesId(sId);
        return allowances.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert FoodAllowanceEntity to FoodAllowanceDTO
    private FoodAllowanceDTO convertToDTO(FoodAllowanceEntity foodAllowanceEntity) {
        FoodAllowanceDTO dto = new FoodAllowanceDTO();
        dto.setFoId(foodAllowanceEntity.getFoId());
        dto.setName(foodAllowanceEntity.getName());
        dto.setDate(foodAllowanceEntity.getDate());
        dto.setCustomerName(foodAllowanceEntity.getCustomerName());
        dto.setNoOfPersons(foodAllowanceEntity.getNoOfPersons());
        dto.setFoodCost(foodAllowanceEntity.getFoodCost());
        dto.setSalesId(foodAllowanceEntity.getSales().getSalesId());
        return dto;
    }
}
