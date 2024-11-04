package com.erms.ERMS_Application.Demo.feedbackForm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackForm,Long> {
}
