package com.erms.ERMS_Application.Quotation.Form;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends JpaRepository<FormEntity, Long> {
    Optional<FormEntity> findTopByQuotationNumberContainingOrderByFIdDesc(String financialYear);
}
