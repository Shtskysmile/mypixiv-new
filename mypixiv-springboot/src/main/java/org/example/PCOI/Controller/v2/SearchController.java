package org.example.PCOI.Controller.v2;

import org.example.PCOI.ResponseDTO.R_SearchDTO;
import org.example.PCOI.ResponseDTO.Result;
import org.example.PCOI.Service.Inter.SearchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * v2 RESTful - Search APIs
 *
 * 统一为 GET /api/v2/search，并通过 query 参数区分搜索类型。
 */
@RestController("searchControllerV2")
@RequestMapping("/api/v2")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    /** 通过 ID 搜索 */
    @GetMapping("/search/by-id")
    public Result<R_SearchDTO> searchById(@RequestParam("keyword") String keyword) {
        return Result.success(searchService.searchById(keyword));
    }

    /** 通过名称搜索 */
    @GetMapping("/search/by-name")
    public Result<R_SearchDTO> searchByName(@RequestParam("keyword") String keyword) {
        return Result.success(searchService.searchByName(keyword));
    }

    /** 通过 tag 搜索 */
    @GetMapping("/search/by-tag")
    public Result<R_SearchDTO> searchByTag(@RequestParam("keyword") String keyword) {
        return Result.success(searchService.searchByTag(keyword));
    }
}

