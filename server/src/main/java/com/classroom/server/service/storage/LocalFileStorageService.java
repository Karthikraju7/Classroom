package com.classroom.server.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${file.storage.root}")
    private String rootDir;

    @Override
    public String save(MultipartFile file, Long announcementId) {
        try {
            // storage/announcements/{announcementId}/
            Path dirPath = Path.of(
                    rootDir,
                    "announcements",
                    announcementId.toString()
            );

            Files.createDirectories(dirPath);

            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path filePath = dirPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return filePath.toString(); // stored in DB
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public Resource load(String storagePath) {
        Path path = Path.of(storagePath);

        if (!Files.exists(path)) {
            throw new RuntimeException("File not found on disk");
        }

        return new FileSystemResource(path);
    }
}
