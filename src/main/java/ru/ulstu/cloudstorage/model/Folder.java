package ru.ulstu.cloudstorage.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "folders")
public class Folder extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<StoredFile> files = new ArrayList<>();

    public Folder() {
    }

    public Folder(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        if (this.owner != null && this.owner != owner) {
            this.owner.getFolders().remove(this);
        }
        this.owner = owner;
        if (owner != null && !owner.getFolders().contains(this)) {
            owner.getFolders().add(this);
        }
    }

    public List<StoredFile> getFiles() {
        return files;
    }

    public void setFiles(List<StoredFile> files) {
        this.files.clear();
        if (files != null) {
            files.forEach(this::addFile);
        }
    }

    public void addFile(StoredFile file) {
        files.add(file);
        file.setFolder(this);
    }

    public void removeFile(StoredFile file) {
        files.remove(file);
        file.setFolder(null);
    }
}
