package ru.ulstu.cloudstorage.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ulstu.cloudstorage.dto.report.FolderStorageReportRs;
import ru.ulstu.cloudstorage.service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/folders/storage")
    public List<FolderStorageReportRs> getFolderStorageReport() {
        return reportService.getFolderStorageReport();
    }
}
