package org.example.PCOI.Controller.v1;
import org.example.PCOI.ResponseDTO.*;
import org.example.PCOI.Security.LoginUser;
import org.example.PCOI.Service.Inter.ContributionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/v1")
public class ContributionController {

    private final ContributionService contributionService;

    public ContributionController(ContributionService contributionService) {
        this.contributionService = contributionService;
    }

    @GetMapping("/illustrations")
    public Result<List<R_OverviewContribution>> getIllustrations() {
        List<R_OverviewContribution> list = contributionService.getIllustrations();
        return Result.success(list);
    }

    @GetMapping("/mangas")
    public Result<List<R_OverviewContribution>> getMangas() {
        List<R_OverviewContribution> list = contributionService.getMangas();
        return Result.success(list);
    }

    @GetMapping("/allContributions")
    public Result<List<R_OverviewContribution>> getAllContributions() {
        List<R_OverviewContribution> list = contributionService.getAllContributions();
        return Result.success(list);
    }

    @PostMapping("/contribution")
    public Result<R_ContributionDTO> getContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("contributionId") String contributionId) throws Exception {
        R_ContributionDTO data = contributionService.getContribution(user.getUserId(), contributionId);
        return Result.success(data);
    }

    @PostMapping("/pendingContribution")
    public Result<R_Contribution> getPendingContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("contributionId") String contributionId) throws Exception {
        R_Contribution c = contributionService.getPendingContribution(user.getUserId(), user.getRole(), contributionId);
        return Result.success(c);
    }

    @PostMapping("/contributionsRanking")
    public Result<List<R_OverviewContribution>> getContributionsRanking(
            @RequestParam("type") Integer type,
            @RequestParam("key") Integer key) {
        List<R_OverviewContribution> list = contributionService.getContributionsRanking(type, key);
        return Result.success(list);
    }

    @PostMapping("/likeContribution")
    public Result<String> likeContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("contributionId") String contributionId) throws Exception {
        contributionService.likeContribution(user.getUserId(), contributionId);
        return Result.success("点赞成功");
    }

    @PostMapping("/unlikeContribution")
    public Result<String> unlikeContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("contributionId") String contributionId) throws Exception {
        contributionService.unlikeContribution(user.getUserId(), contributionId);
        return Result.success("取消点赞成功");
    }

    @PostMapping("/favoriteContribution")
    public Result<String> favoriteContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("contributionId") String contributionId) throws Exception {
        contributionService.favoriteContribution(user.getUserId(), contributionId);
        return Result.success("收藏成功");
    }

    @PostMapping("/unfavoriteContribution")
    public Result<String> unfavoriteContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("contributionId") String contributionId) throws Exception {
        contributionService.unfavoriteContribution(user.getUserId(), contributionId);
        return Result.success("取消收藏成功");
    }

    @PostMapping("/commentContribution")
    public Result<String> commentContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("contributionId") String contributionId,
            @RequestParam("comment") String comment) throws Exception {
        contributionService.commentContribution(user.getUserId(), contributionId, comment);
        return Result.success("评论成功");
    }

    @PostMapping("/uploadContribution")
    public Result<String> uploadContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("title") String title,
            @RequestParam("type") Integer type,
            @RequestParam("description") String description,
            @RequestPart(name = "tags", required = false) List<String> tags,
            @RequestPart(name = "images") List<MultipartFile> images) throws Exception {
        contributionService.uploadContribution(user.getUserId(), title, type, description, tags, images);
        return Result.success("上传成功");
    }
}
