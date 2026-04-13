package ru.ulstu.cloudstorage.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.ulstu.cloudstorage.dto.file.FilePageRs;
import ru.ulstu.cloudstorage.dto.file.StoredFileRq;
import ru.ulstu.cloudstorage.dto.file.StoredFileRs;
import ru.ulstu.cloudstorage.service.StoredFileService;

import java.nio.charset.StandardCharsets;

@Validated
@RestController
@RequestMapping("/api/files")
public class StoredFileController {

    private final StoredFileService storedFileService;

    public StoredFileController(StoredFileService storedFileService) {
        this.storedFileService = storedFileService;
    }

    @GetMapping
    public FilePageRs findPage(@RequestParam(defaultValue = "0") @Min(0) int page,
                               @RequestParam(defaultValue = "6") @Min(1) @Max(30) int size,
                               @RequestParam(required = false) String search,
                               @RequestParam(defaultValue = "ALL") String status,
                               @RequestParam(required = false) Long folderId) {
        return storedFileService.findPage(page, size, search, status, folderId);
    }

    @GetMapping("/{id}")
    public StoredFileRs findById(@PathVariable Long id) {
        return storedFileService.findById(id);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        StoredFileRs file = storedFileService.findById(id);
        MediaType mediaType = resolveMediaType(file.getMimeType());

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        "Content-Disposition",
                        ContentDisposition.attachment()
                                .filename(file.getName() + "." + file.getExtension(), StandardCharsets.UTF_8)
                                .build()
                                .toString()
                )
                .body(storedFileService.download(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StoredFileRs create(@Valid @RequestBody StoredFileRq request) {
        return storedFileService.create(request);
    }

    @PutMapping("/{id}")
    public StoredFileRs update(@PathVariable Long id, @Valid @RequestBody StoredFileRq request) {
        return storedFileService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        storedFileService.delete(id);
    }

    private MediaType resolveMediaType(String mimeType) {
        if (mimeType == null || mimeType.isBlank()) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
        return MediaType.parseMediaType(mimeType);
    }
}
