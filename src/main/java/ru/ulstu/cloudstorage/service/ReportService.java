package ru.ulstu.cloudstorage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ulstu.cloudstorage.dto.report.FolderStorageReportRs;
import ru.ulstu.cloudstorage.mapper.ReportMapper;
import ru.ulstu.cloudstorage.repository.ReportRepository;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;

    public ReportService(ReportRepository reportRepository, ReportMapper reportMapper) {
        this.reportRepository = reportRepository;
        this.reportMapper = reportMapper;
    }

    @Transactional(readOnly = true)
    public List<FolderStorageReportRs> getFolderStorageReport() {
        return reportRepository.getFolderStorageReport().stream()
                .map(reportMapper::toResponse)
                .toList();
    }
}
