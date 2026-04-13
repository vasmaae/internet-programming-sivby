package ru.ulstu.cloudstorage.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import ru.ulstu.cloudstorage.dto.folder.FolderRq;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class FolderServiceTest {

    @Autowired
    private FolderService folderService;

    @Test
    void shouldFindAllFolders() {
        var folders = folderService.findAll();

        assertFalse(folders.isEmpty());
        assertEquals("Main", folders.getFirst().getName());
    }

    @Test
    void shouldCreateFolderForExistingUser() {
        FolderRq request = new FolderRq();
        request.setName("Semester");
        request.setDescription("Semester docs");
        request.setOwnerId(1L);

        var created = folderService.create(request);

        assertNotNull(created.getId());
        assertEquals("root", created.getOwnerUsername());
    }

    @Test
    void shouldFindFolderById() {
        var folder = folderService.findById(2L);

        assertEquals("Reports", folder.getName());
        assertEquals("root", folder.getOwnerUsername());
    }

    @Test
    void shouldUpdateFolder() {
        FolderRq request = new FolderRq();
        request.setName("Updated reports");
        request.setDescription("Updated description");
        request.setOwnerId(2L);

        var updated = folderService.update(2L, request);

        assertEquals("Updated reports", updated.getName());
        assertEquals("demo", updated.getOwnerUsername());
    }

    @Test
    void shouldDeleteFolder() {
        FolderRq request = new FolderRq();
        request.setName("Temporary folder");
        request.setDescription("Temp");
        request.setOwnerId(1L);
        var created = folderService.create(request);

        folderService.delete(created.getId());

        assertThrows(IllegalArgumentException.class, () -> folderService.findById(created.getId()));
    }

    @Test
    void shouldReturnEntityForExistingFolder() {
        var folder = folderService.getEntity(1L);

        assertEquals("Main", folder.getName());
    }

    @Test
    void shouldThrowWhenFolderMissing() {
        assertThrows(IllegalArgumentException.class, () -> folderService.getEntity(9999L));
    }
}
