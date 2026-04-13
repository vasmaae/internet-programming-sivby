package ru.ulstu.cloudstorage.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ulstu.cloudstorage.dto.file.FilePageRs;
import ru.ulstu.cloudstorage.dto.file.StoredFileRq;
import ru.ulstu.cloudstorage.dto.file.StoredFileRs;
import ru.ulstu.cloudstorage.mapper.StoredFileMapper;
import ru.ulstu.cloudstorage.model.Folder;
import ru.ulstu.cloudstorage.model.StoredFile;
import ru.ulstu.cloudstorage.repository.StoredFileRepository;

import java.util.Base64;

@Service
public class StoredFileService {

    private final StoredFileRepository storedFileRepository;
    private final FolderService folderService;
    private final StoredFileMapper storedFileMapper;

    public StoredFileService(StoredFileRepository storedFileRepository, FolderService folderService,
                             StoredFileMapper storedFileMapper) {
        this.storedFileRepository = storedFileRepository;
        this.folderService = folderService;
        this.storedFileMapper = storedFileMapper;
    }

    @Transactional(readOnly = true)
    public FilePageRs findPage(int page, int size, String search, String status, Long folderId) {
        String normalizedStatus = normalizeStatus(status);
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "uploadedAt"));
        var resultPage = storedFileRepository.findAll(buildSpecification(blankToNull(search), normalizedStatus, folderId), pageable);
        return storedFileMapper.toPageResponse(resultPage);
    }

    @Transactional(readOnly = true)
    public StoredFileRs findById(Long id) {
        return storedFileMapper.toResponse(getEntity(id));
    }

    @Transactional
    public StoredFileRs create(StoredFileRq request) {
        validateContentPresent(request);
        Folder folder = folderService.getEntity(request.getFolderId());
        StoredFile file = storedFileMapper.toEntity(request, folder);
        return storedFileMapper.toResponse(storedFileRepository.save(file));
    }

    @Transactional
    public StoredFileRs update(Long id, StoredFileRq request) {
        StoredFile file = getEntity(id);
        Folder folder = folderService.getEntity(request.getFolderId());
        storedFileMapper.updateEntity(file, request, folder);
        return storedFileMapper.toResponse(storedFileRepository.save(file));
    }

    @Transactional
    public void delete(Long id) {
        storedFileRepository.delete(getEntity(id));
    }

    @Transactional(readOnly = true)
    public byte[] download(Long id) {
        StoredFile file = getEntity(id);
        if (file.getContentBase64() == null || file.getContentBase64().isBlank()) {
            throw new IllegalArgumentException("File content not found for file: " + id);
        }
        return Base64.getDecoder().decode(file.getContentBase64());
    }

    @Transactional(readOnly = true)
    public StoredFile getEntity(Long id) {
        return storedFileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("File not found: " + id));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "ALL";
        }
        return status.trim().toUpperCase();
    }

    private void validateContentPresent(StoredFileRq request) {
        if (request.getBase64Content() == null || request.getBase64Content().isBlank()) {
            throw new IllegalArgumentException("File content must be provided");
        }
    }

    private Specification<StoredFile> buildSpecification(String search, String status, Long folderId) {
        return (root, query, builder) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            if (folderId != null) {
                predicates.add(builder.equal(root.get("folder").get("id"), folderId));
            }

            if (search != null) {
                predicates.add(
                        builder.like(
                                builder.lower(root.get("name")),
                                "%" + search.toLowerCase() + "%"
                        )
                );
            }

            switch (status) {
                case "ACTIVE" -> predicates.add(builder.isFalse(root.get("deleted")));
                case "STARRED" -> {
                    predicates.add(builder.isTrue(root.get("starred")));
                    predicates.add(builder.isFalse(root.get("deleted")));
                }
                case "DELETED" -> predicates.add(builder.isTrue(root.get("deleted")));
                default -> {
                }
            }

            return builder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
