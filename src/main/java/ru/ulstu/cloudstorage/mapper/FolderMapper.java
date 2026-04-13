package ru.ulstu.cloudstorage.mapper;

import org.springframework.stereotype.Component;
import ru.ulstu.cloudstorage.dto.folder.FolderRq;
import ru.ulstu.cloudstorage.dto.folder.FolderRs;
import ru.ulstu.cloudstorage.model.Folder;
import ru.ulstu.cloudstorage.model.User;

@Component
public class FolderMapper {

    public Folder toEntity(FolderRq request, User owner) {
        Folder folder = new Folder();
        folder.setName(request.getName());
        folder.setDescription(request.getDescription());
        folder.setOwner(owner);
        return folder;
    }

    public void updateEntity(Folder folder, FolderRq request, User owner) {
        folder.setName(request.getName());
        folder.setDescription(request.getDescription());
        folder.setOwner(owner);
    }

    public FolderRs toResponse(Folder folder) {
        FolderRs response = new FolderRs();
        response.setId(folder.getId());
        response.setName(folder.getName());
        response.setDescription(folder.getDescription());
        response.setOwnerId(folder.getOwner().getId());
        response.setOwnerUsername(folder.getOwner().getUsername());
        response.setFileCount(folder.getFiles().size());
        return response;
    }
}
