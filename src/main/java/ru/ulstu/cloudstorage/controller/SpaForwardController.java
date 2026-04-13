package ru.ulstu.cloudstorage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {"/", "/about", "/my-files", "/starred", "/basket"})
    public String forward() {
        return "forward:/index.html";
    }
}
