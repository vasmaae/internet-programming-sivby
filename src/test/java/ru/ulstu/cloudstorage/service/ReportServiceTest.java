package ru.ulstu.cloudstorage.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class ReportServiceTest {

    @Autowired
    private ReportService reportService;

    @Test
    void shouldReturnFolderStorageReport() {
        var report = reportService.getFolderStorageReport();

        assertFalse(report.isEmpty());
        assertEquals("Reports", report.getFirst().getFolderName());
        assertTrue(report.getFirst().getTotalBytes() >= report.getFirst().getActiveBytes());
    }
}
