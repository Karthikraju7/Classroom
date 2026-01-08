package com.classroom.server.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String save(MultipartFile file, Long announcementId);

    String saveAssignmentSubmission(
            MultipartFile file,
            Long assignmentId,
            Long studentId
    );

    Resource load(String storagePath);
}
