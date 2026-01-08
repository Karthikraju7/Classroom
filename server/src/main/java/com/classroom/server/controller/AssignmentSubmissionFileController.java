package com.classroom.server.controller;

import com.classroom.server.entity.AssignmentSubmissionFile;
import com.classroom.server.repository.AssignmentSubmissionFileRepository;
import com.classroom.server.service.storage.FileStorageService;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/assignment-submissions/files")
@RequiredArgsConstructor
public class AssignmentSubmissionFileController {

    private final FileStorageService fileStorageService;
    private final AssignmentSubmissionFileRepository fileRepository;

    @GetMapping("/{fileId}/view")
    public ResponseEntity<Resource> viewFile(@PathVariable Long fileId) {

        AssignmentSubmissionFile file =
                fileRepository.findById(fileId)
                        .orElseThrow(() -> new RuntimeException("File not found"));

        Resource resource = fileStorageService.load(file.getFilePath());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getFileName() + "\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                file.getFileType() != null
                                        ? file.getFileType()
                                        : MediaType.APPLICATION_OCTET_STREAM_VALUE
                        )
                )
                .body(resource);
    }
}
