package com.budget.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public static <T> PageResponse<T> of(Page<T> springPage) {
        PageResponse<T> r = new PageResponse<>();
        r.setContent(springPage.getContent());
        r.setPage(springPage.getNumber());
        r.setSize(springPage.getSize());
        r.setTotalElements(springPage.getTotalElements());
        r.setTotalPages(springPage.getTotalPages());
        return r;
    }
}
