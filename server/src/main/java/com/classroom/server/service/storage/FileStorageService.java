package com.classroom.server.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String save(MultipartFile file, Long courseId, Long announcementId);
    Resource load(String storagePath);
}