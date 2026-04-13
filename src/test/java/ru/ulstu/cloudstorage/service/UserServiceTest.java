package ru.ulstu.cloudstorage.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import ru.ulstu.cloudstorage.dto.user.UserRq;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void shouldFindAllUsers() {
        var users = userService.findAll();

        assertFalse(users.isEmpty());
        assertEquals("root", users.getFirst().getUsername());
    }

    @Test
    void shouldCreateAndReadUser() {
        UserRq request = new UserRq();
        request.setUsername("tester");
        request.setEmail("tester@example.com");

        var created = userService.create(request);
        var fetched = userService.findById(created.getId());

        assertNotNull(created.getId());
        assertEquals("tester", fetched.getUsername());
    }

    @Test
    void shouldUpdateUser() {
        UserRq request = new UserRq();
        request.setUsername("updated-root");
        request.setEmail("updated-root@example.com");

        var updated = userService.update(1L, request);

        assertEquals(1L, updated.getId());
        assertEquals("updated-root", updated.getUsername());
        assertEquals("updated-root@example.com", updated.getEmail());
    }

    @Test
    void shouldDeleteUser() {
        UserRq request = new UserRq();
        request.setUsername("deletable");
        request.setEmail("deletable@example.com");
        var created = userService.create(request);

        userService.delete(created.getId());

        assertThrows(IllegalArgumentException.class, () -> userService.findById(created.getId()));
    }

    @Test
    void shouldReturnEntityForExistingUser() {
        var user = userService.getEntity(1L);

        assertEquals("root", user.getUsername());
    }

    @Test
    void shouldThrowWhenUserMissing() {
        assertThrows(IllegalArgumentException.class, () -> userService.getEntity(9999L));
    }
}
