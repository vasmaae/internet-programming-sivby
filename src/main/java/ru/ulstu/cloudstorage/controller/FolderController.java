package ru.ulstu.cloudstorage.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.ulstu.cloudstorage.dto.folder.FolderRq;
import ru.ulstu.cloudstorage.dto.folder.FolderRs;
import ru.ulstu.cloudstorage.service.FolderService;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public List<FolderRs> findAll() {
        return folderService.findAll();
    }

    @GetMapping("/{id}")
    public FolderRs findById(@PathVariable Long id) {
        return folderService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FolderRs create(@Valid @RequestBody FolderRq request) {
        return folderService.create(request);
    }

    @PutMapping("/{id}")
    public FolderRs update(@PathVariable Long id, @Valid @RequestBody FolderRq request) {
        return folderService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        folderService.delete(id);
    }
}
