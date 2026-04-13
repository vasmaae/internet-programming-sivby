package ru.ulstu.cloudstorage.mapper;

import org.springframework.stereotype.Component;
import ru.ulstu.cloudstorage.dto.report.FolderStorageReportRs;
import ru.ulstu.cloudstorage.repository.projection.FolderStorageProjection;

@Component
public class ReportMapper {

    public FolderStorageReportRs toResponse(FolderStorageProjection projection) {
        FolderStorageReportRs response = new FolderStorageReportRs();
        response.setFolderId(projection.getFolderId());
        response.setFolderName(projection.getFolderName());
        response.setOwnerUsername(projection.getOwnerUsername());
        response.setFileCount(projection.getFileCount());
        response.setTotalBytes(projection.getTotalBytes());
        response.setActiveBytes(projection.getActiveBytes());
        return response;
    }
}
