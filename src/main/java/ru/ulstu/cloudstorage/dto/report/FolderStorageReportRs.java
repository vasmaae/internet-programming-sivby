package ru.ulstu.cloudstorage.dto.report;

public class FolderStorageReportRs {

    private Long folderId;
    private String folderName;
    private String ownerUsername;
    private long fileCount;
    private long totalBytes;
    private long activeBytes;

    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }

    public String getFolderName() {
        return folderName;
    }

    public void setFolderName(String folderName) {
        this.folderName = folderName;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public long getFileCount() {
        return fileCount;
    }

    public void setFileCount(long fileCount) {
        this.fileCount = fileCount;
    }

    public long getTotalBytes() {
        return totalBytes;
    }

    public void setTotalBytes(long totalBytes) {
        this.totalBytes = totalBytes;
    }

    public long getActiveBytes() {
        return activeBytes;
    }

    public void setActiveBytes(long activeBytes) {
        this.activeBytes = activeBytes;
    }
}
