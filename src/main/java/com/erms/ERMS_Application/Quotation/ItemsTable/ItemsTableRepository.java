package com.erms.ERMS_Application.Quotation.ItemsTable;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erms.ERMS_Application.Quotation.Form.FormEntity;

@Repository
public interface ItemsTableRepository extends JpaRepository <ItemsTableEntity,Long> {

	

}
