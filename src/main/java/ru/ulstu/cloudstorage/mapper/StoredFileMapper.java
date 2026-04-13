package ru.ulstu.cloudstorage.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import ru.ulstu.cloudstorage.dto.file.FilePageRs;
import ru.ulstu.cloudstorage.dto.file.StoredFileRq;
import ru.ulstu.cloudstorage.dto.file.StoredFileRs;
import ru.ulstu.cloudstorage.model.Folder;
import ru.ulstu.cloudstorage.model.StoredFile;

import java.time.LocalDateTime;

@Component
public class StoredFileMapper {

    public StoredFile toEntity(StoredFileRq request, Folder folder) {
        StoredFile file = new StoredFile();
        apply(file, request, folder);
        file.setUploadedAt(LocalDateTime.now());
        if (file.getStoragePath() == null || file.getStoragePath().isBlank()) {
            file.setStoragePath("/virtual-storage/" + request.getName());
        }
        return file;
    }

    public void updateEntity(StoredFile file, StoredFileRq request, Folder folder) {
        apply(file, request, folder);
        if (file.getStoragePath() == null || file.getStoragePath().isBlank()) {
            file.setStoragePath("/virtual-storage/" + request.getName());
        }
    }

    public StoredFileRs toResponse(StoredFile file) {
        StoredFileRs response = new StoredFileRs();
        response.setId(file.getId());
        response.setName(file.getName());
        response.setExtension(file.getExtension());
        response.setSizeBytes(file.getSizeBytes());
        response.setStoragePath(file.getStoragePath());
        response.setMimeType(file.getMimeType());
        response.setUploadedAt(file.getUploadedAt());
        response.setStarred(file.isStarred());
        response.setDeleted(file.isDeleted());
        response.setFolderId(file.getFolder().getId());
        response.setFolderName(file.getFolder().getName());
        response.setHasContent(file.getContentBase64() != null && !file.getContentBase64().isBlank());
        return response;
    }

    public FilePageRs toPageResponse(Page<StoredFile> page) {
        FilePageRs response = new FilePageRs();
        response.setContent(page.getContent().stream().map(this::toResponse).toList());
        response.setPage(page.getNumber());
        response.setSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }

    private void apply(StoredFile file, StoredFileRq request, Folder folder) {
        file.setName(request.getName());
        file.setExtension(request.getExtension());
        file.setSizeBytes(request.getSizeBytes());
        file.setStoragePath(request.getStoragePath());
        file.setMimeType(request.getMimeType());
        if (request.getBase64Content() != null && !request.getBase64Content().isBlank()) {
            file.setContentBase64(request.getBase64Content());
        }
        file.setFolder(folder);
        file.setStarred(request.isStarred());
        file.setDeleted(request.isDeleted());
    }
}
