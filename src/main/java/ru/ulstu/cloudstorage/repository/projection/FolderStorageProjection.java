package ru.ulstu.cloudstorage.repository.projection;

public interface FolderStorageProjection {

    Long getFolderId();

    String getFolderName();

    String getOwnerUsername();

    long getFileCount();

    long getTotalBytes();

    long getActiveBytes();
}
