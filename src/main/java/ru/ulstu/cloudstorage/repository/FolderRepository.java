package ru.ulstu.cloudstorage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ulstu.cloudstorage.model.Folder;

public interface FolderRepository extends JpaRepository<Folder, Long> {
}
