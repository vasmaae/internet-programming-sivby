package ru.ulstu.cloudstorage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ulstu.cloudstorage.dto.user.UserRq;
import ru.ulstu.cloudstorage.dto.user.UserRs;
import ru.ulstu.cloudstorage.mapper.UserMapper;
import ru.ulstu.cloudstorage.model.User;
import ru.ulstu.cloudstorage.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public List<UserRs> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserRs findById(Long id) {
        return userMapper.toResponse(getEntity(id));
    }

    @Transactional
    public UserRs create(UserRq request) {
        User user = userMapper.toEntity(request);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserRs update(Long id, UserRq request) {
        User user = getEntity(id);
        userMapper.updateEntity(user, request);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        userRepository.delete(getEntity(id));
    }

    @Transactional(readOnly = true)
    public User getEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }
}
