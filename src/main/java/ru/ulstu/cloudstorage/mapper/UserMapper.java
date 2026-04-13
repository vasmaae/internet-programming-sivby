package ru.ulstu.cloudstorage.mapper;

import org.springframework.stereotype.Component;
import ru.ulstu.cloudstorage.dto.user.UserRq;
import ru.ulstu.cloudstorage.dto.user.UserRs;
import ru.ulstu.cloudstorage.model.User;

@Component
public class UserMapper {

    public User toEntity(UserRq request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        return user;
    }

    public void updateEntity(User user, UserRq request) {
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
    }

    public UserRs toResponse(User user) {
        UserRs response = new UserRs();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFolderCount(user.getFolders().size());
        return response;
    }
}
