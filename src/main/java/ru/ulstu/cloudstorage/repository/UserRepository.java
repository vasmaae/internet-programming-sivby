package ru.ulstu.cloudstorage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ulstu.cloudstorage.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
