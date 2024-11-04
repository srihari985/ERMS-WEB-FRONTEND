package com.erms.ERMS_Application.PertrolAllowance;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class PertrolAllowanceService {

    @Autowired
    private PertrolAllowanceRepo pertrolAllowanceRepo;

    @Autowired
    private SalesRepository salesRepository;

    public PetrolAllowanceEntity savePetrolAllowance(
            Long salesId, String startTime, String startReading, String endTime,
            String endReading, float totalKm, float petrolChargePerKm,
            String additionalComments, MultipartFile choosePetrolInvoiceBill,
            LocalDate date) throws IOException {

        Sales sale = salesRepository.findById(salesId)
                .orElseThrow(() -> new EntityNotFoundException("Sales not found with id: " + salesId));

        // Create a new PetrolAllowance entity
        PetrolAllowanceEntity petrolAllowance = new PetrolAllowanceEntity();

        // Set the values to the entity from parameters
        petrolAllowance.setStartTime(startTime);
        petrolAllowance.setStartReading(startReading);
        petrolAllowance.setEndTime(endTime);
        petrolAllowance.setEndReading(endReading);
        petrolAllowance.setTotalKm(totalKm);
        petrolAllowance.setPetrolChargePerKm(petrolChargePerKm);
        petrolAllowance.setAdditionalComments(additionalComments);
        petrolAllowance.setSales(sale);
        petrolAllowance.setDate(date); // Set the auto-generated date in the entity

        // Compress and set the petrol invoice bill
        if (!choosePetrolInvoiceBill.isEmpty()) {
            byte[] compressedPetrolInvoiceBill = compressImage(choosePetrolInvoiceBill);
            petrolAllowance.setChoosePetrolInvoiceBill(compressedPetrolInvoiceBill);
        }

        // Save the petrol allowance entity
        return pertrolAllowanceRepo.save(petrolAllowance);
    }



    public List<TripDetailsDTO> getAllTripDetails() {
        return pertrolAllowanceRepo.findAll().stream()
                .map(this::convertToDTO) // Convert to DTO
                .collect(Collectors.toList());
    }



    // Method to compress an image
    private byte[] compressImage(MultipartFile imageFile) throws IOException {
        BufferedImage image = ImageIO.read(imageFile.getInputStream());
        ByteArrayOutputStream compressedImageStream = new ByteArrayOutputStream();

        ImageWriter jpgWriter = ImageIO.getImageWritersByFormatName("jpg").next();
        ImageWriteParam jpgWriteParam = jpgWriter.getDefaultWriteParam();
        jpgWriteParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        jpgWriteParam.setCompressionQuality(0.75f); // Change the quality level to desired value

        try (ImageOutputStream outputStream = ImageIO.createImageOutputStream(compressedImageStream)) {
            jpgWriter.setOutput(outputStream);
            jpgWriter.write(null, new javax.imageio.IIOImage(image, null, null), jpgWriteParam);
        }
        jpgWriter.dispose();

        return compressedImageStream.toByteArray();
    }


    public List<TripDetailsDTO> getTripDetailsBySalesId(Long sId) {
        // Fetch all petrol allowance entities by salesId
        List<PetrolAllowanceEntity> petrolAllowances = pertrolAllowanceRepo.findAllBySalesId(sId);

        // Convert the list of entities to DTOs
        return petrolAllowances.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TripDetailsDTO convertToDTO(PetrolAllowanceEntity petrolAllowance) {
        TripDetailsDTO dto = new TripDetailsDTO();
        dto.setpId(petrolAllowance.getpId());
        dto.setStartTime(petrolAllowance.getStartTime());
        dto.setStartReading(petrolAllowance.getStartReading());
        dto.setEndTime(petrolAllowance.getEndTime());
        dto.setEndReading(petrolAllowance.getEndReading());
        dto.setTotalKm(petrolAllowance.getTotalKm());
        dto.setPetrolChargePerKm(petrolAllowance.getPetrolChargePerKm());
        dto.setAdditionalComments(petrolAllowance.getAdditionalComments());
        dto.setChoosePetrolInvoiceBill(petrolAllowance.getChoosePetrolInvoiceBill());
        dto.setDate(petrolAllowance.getDate());

        return dto;
    }

    // Update petrol allowance logic
    public boolean updateMultiplePetrolAllowances(Long salesId, List<Long> pIds, Optional<String> startTime,
                                                  Optional<String> startReading, Optional<String> endTime,
                                                  Optional<String> endReading, Optional<Float> totalKm,
                                                  Optional<Float> petrolChargePerKm, Optional<String> additionalComments,
                                                  Optional<MultipartFile> choosePetrolInvoiceBill) {

        boolean isUpdated = false;

        for (Long pId : pIds) {
            Optional<PetrolAllowanceEntity> optionalAllowance = pertrolAllowanceRepo.findById(pId);

            if (optionalAllowance.isPresent()) {
                PetrolAllowanceEntity allowance = optionalAllowance.get();

                // Check if this allowance belongs to the given salesId
                if (allowance.getSales().getId().equals(salesId)) {
                    // Update only the provided fields
                    startTime.ifPresent(allowance::setStartTime);
                    startReading.ifPresent(allowance::setStartReading);
                    endTime.ifPresent(allowance::setEndTime);
                    endReading.ifPresent(allowance::setEndReading);
                    totalKm.ifPresent(allowance::setTotalKm);
                    petrolChargePerKm.ifPresent(allowance::setPetrolChargePerKm);
                    additionalComments.ifPresent(allowance::setAdditionalComments);

                    // Handle MultipartFile and convert it to byte[]
                    if (choosePetrolInvoiceBill.isPresent()) {
                        MultipartFile file = choosePetrolInvoiceBill.get();
                        try {
                            byte[] fileBytes = file.getBytes();  // Convert the MultipartFile to byte[]
                            allowance.setChoosePetrolInvoiceBill(fileBytes);  // Set the byte[] in the entity
                        } catch (IOException e) {
                            throw new RuntimeException("Error processing the petrol invoice file", e);
                        }
                    }

                    pertrolAllowanceRepo.save(allowance);
                    isUpdated = true; // At least one record was updated
                }
            }
        }

        return isUpdated;
    }


}
