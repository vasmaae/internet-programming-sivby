package ru.ulstu.cloudstorage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.ulstu.cloudstorage.model.Folder;
import ru.ulstu.cloudstorage.repository.projection.FolderStorageProjection;

import java.util.List;

public interface ReportRepository extends JpaRepository<Folder, Long> {

    @Query("""
            select folder.id as folderId,
                   folder.name as folderName,
                   owner.username as ownerUsername,
                   count(file.id) as fileCount,
                   coalesce(sum(file.sizeBytes), 0) as totalBytes,
                   coalesce(sum(case when file.deleted = false then file.sizeBytes else 0 end), 0) as activeBytes
            from Folder folder
            join folder.owner owner
            left join folder.files file
            group by folder.id, folder.name, owner.username
            order by coalesce(sum(file.sizeBytes), 0) desc, folder.name asc
            """)
    List<FolderStorageProjection> getFolderStorageReport();
}
