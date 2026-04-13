package ru.ulstu.cloudstorage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ulstu.cloudstorage.dto.folder.FolderRq;
import ru.ulstu.cloudstorage.dto.folder.FolderRs;
import ru.ulstu.cloudstorage.mapper.FolderMapper;
import ru.ulstu.cloudstorage.model.Folder;
import ru.ulstu.cloudstorage.model.User;
import ru.ulstu.cloudstorage.repository.FolderRepository;

import java.util.List;

@Service
public class FolderService {

    private final FolderRepository folderRepository;
    private final UserService userService;
    private final FolderMapper folderMapper;

    public FolderService(FolderRepository folderRepository, UserService userService, FolderMapper folderMapper) {
        this.folderRepository = folderRepository;
        this.userService = userService;
        this.folderMapper = folderMapper;
    }

    @Transactional(readOnly = true)
    public List<FolderRs> findAll() {
        return folderRepository.findAll().stream()
                .map(folderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FolderRs findById(Long id) {
        return folderMapper.toResponse(getEntity(id));
    }

    @Transactional
    public FolderRs create(FolderRq request) {
        User owner = userService.getEntity(request.getOwnerId());
        Folder folder = folderMapper.toEntity(request, owner);
        return folderMapper.toResponse(folderRepository.save(folder));
    }

    @Transactional
    public FolderRs update(Long id, FolderRq request) {
        Folder folder = getEntity(id);
        User owner = userService.getEntity(request.getOwnerId());
        folderMapper.updateEntity(folder, request, owner);
        return folderMapper.toResponse(folderRepository.save(folder));
    }

    @Transactional
    public void delete(Long id) {
        folderRepository.delete(getEntity(id));
    }

    @Transactional(readOnly = true)
    public Folder getEntity(Long id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found: " + id));
    }
}
