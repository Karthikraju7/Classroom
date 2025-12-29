package com.classroom.server.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${file.storage.root}")
    private String rootDir;

    @Override
    public String save(MultipartFile file, Long courseId, Long announcementId) {
        try {
            String dirPath = rootDir
                    + "/courses/course-" + courseId
                    + "/ann-" + announcementId;

            Files.createDirectories(Path.of(dirPath));

            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path filePath = Path.of(dirPath, fileName);

            Files.copy(file.getInputStream(), filePath);

            return filePath.toString(); // saved in DB as storagePath
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public Resource load(String storagePath) {
        return new FileSystemResource(storagePath);
    }
}
