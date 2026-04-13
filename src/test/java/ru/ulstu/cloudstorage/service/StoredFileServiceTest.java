package ru.ulstu.cloudstorage.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import ru.ulstu.cloudstorage.dto.file.StoredFileRq;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class StoredFileServiceTest {

    @Autowired
    private StoredFileService storedFileService;

    @Test
    void shouldReturnPagedFiles() {
        var page = storedFileService.findPage(0, 2, "", "ALL", null);

        assertEquals(2, page.getSize());
        assertFalse(page.getContent().isEmpty());
    }

    @Test
    void shouldFilterDeletedFiles() {
        var page = storedFileService.findPage(0, 10, "", "DELETED", null);

        assertEquals(1, page.getContent().size());
        assertTrue(page.getContent().getFirst().isDeleted());
    }

    @Test
    void shouldFindFileById() {
        var file = storedFileService.findById(2L);

        assertEquals("Титульники", file.getName());
        assertTrue(file.isStarred());
    }

    @Test
    void shouldCreateFileInFolder() {
        StoredFileRq request = new StoredFileRq();
        request.setName("New lecture");
        request.setExtension("pdf");
        request.setSizeBytes(4096L);
        request.setStoragePath("/virtual-storage/new-lecture.pdf");
        request.setMimeType("application/pdf");
        request.setBase64Content(Base64.getEncoder().encodeToString("lecture".getBytes(StandardCharsets.UTF_8)));
        request.setFolderId(1L);
        request.setStarred(true);
        request.setDeleted(false);

        var created = storedFileService.create(request);

        assertNotNull(created.getId());
        assertEquals("Main", created.getFolderName());
        assertTrue(created.isHasContent());
    }

    @Test
    void shouldUpdateFile() {
        StoredFileRq request = new StoredFileRq();
        request.setName("Updated report");
        request.setExtension("pdf");
        request.setSizeBytes(7777L);
        request.setStoragePath("/virtual-storage/updated-report.pdf");
        request.setMimeType("application/pdf");
        request.setFolderId(3L);
        request.setStarred(false);
        request.setDeleted(true);

        var updated = storedFileService.update(3L, request);

        assertEquals("Updated report", updated.getName());
        assertEquals("Archive", updated.getFolderName());
        assertTrue(updated.isDeleted());
    }

    @Test
    void shouldDeleteFile() {
        StoredFileRq request = new StoredFileRq();
        request.setName("Disposable");
        request.setExtension("txt");
        request.setSizeBytes(256L);
        request.setStoragePath("/virtual-storage/disposable.txt");
        request.setMimeType("text/plain");
        request.setBase64Content(Base64.getEncoder().encodeToString("temp".getBytes(StandardCharsets.UTF_8)));
        request.setFolderId(1L);
        request.setStarred(false);
        request.setDeleted(false);
        var created = storedFileService.create(request);

        storedFileService.delete(created.getId());

        assertThrows(IllegalArgumentException.class, () -> storedFileService.findById(created.getId()));
    }

    @Test
    void shouldReturnEntityForExistingFile() {
        var file = storedFileService.getEntity(1L);

        assertEquals("25-26-Варианты", file.getName());
    }

    @Test
    void shouldThrowWhenFileMissing() {
        assertThrows(IllegalArgumentException.class, () -> storedFileService.getEntity(9999L));
    }

    @Test
    void shouldDownloadStoredContent() {
        StoredFileRq request = new StoredFileRq();
        request.setName("downloadable");
        request.setExtension("txt");
        request.setSizeBytes(5L);
        request.setStoragePath("/virtual-storage/downloadable.txt");
        request.setMimeType("text/plain");
        request.setBase64Content(Base64.getEncoder().encodeToString("hello".getBytes(StandardCharsets.UTF_8)));
        request.setFolderId(1L);
        request.setStarred(false);
        request.setDeleted(false);
        var created = storedFileService.create(request);

        var downloaded = storedFileService.download(created.getId());

        assertEquals("hello", new String(downloaded, StandardCharsets.UTF_8));
    }

    @Test
    void shouldRejectCreateWithoutContent() {
        StoredFileRq request = new StoredFileRq();
        request.setName("broken");
        request.setExtension("txt");
        request.setSizeBytes(1L);
        request.setStoragePath("/virtual-storage/broken.txt");
        request.setFolderId(1L);

        assertThrows(IllegalArgumentException.class, () -> storedFileService.create(request));
    }
}
