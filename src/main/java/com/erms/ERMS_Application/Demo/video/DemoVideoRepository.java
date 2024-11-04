package com.erms.ERMS_Application.Demo.video;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DemoVideoRepository extends JpaRepository<DemoVideo,Long> {

}
