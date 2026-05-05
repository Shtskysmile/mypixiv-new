package org.example.PCOI.Controller.v2;

import org.example.PCOI.ResponseDTO.*;
import org.example.PCOI.Service.Inter.ContributionService;
import org.example.PCOI.Utils.TokenProcess;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * v2 RESTful - Contribution APIs
 *
 * 约定：
 * - 公共浏览接口：GET
 * - 需要登录的用户行为：以 /api/v2/users/me/... 表示当前登录用户
 * - 作品资源：/api/v2/contributions
 */
@RestController("contributionControllerV2")
@RequestMapping("/api/v2")
public class ContributionController {

    private final ContributionService contributionService;

    public ContributionController(ContributionService contributionService) {
        this.contributionService = contributionService;
    }

    /** 插画列表 */
    @GetMapping("/illustrations")
    public Result<List<R_OverviewContribution>> getIllustrations() {
        return Result.success(contributionService.getIllustrations());
    }

    /** 漫画列表 */
    @GetMapping("/mangas")
    public Result<List<R_OverviewContribution>> getMangas() {
        return Result.success(contributionService.getMangas());
    }

    /** 所有作品列表 */
    @GetMapping("/contributions")
    public Result<List<R_OverviewContribution>> getAllContributions() {
        return Result.success(contributionService.getAllContributions());
    }

    /** 作品详情（需要登录，用于带上是否点赞/收藏等状态） */
    @GetMapping("/contributions/{contributionId}")
    public Result<R_ContributionDTO> getContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        return Result.success(contributionService.getContribution(userId, contributionId));
    }

    /** 待审核作品详情 */
    @GetMapping("/contributions/{contributionId}/pending")
    public Result<R_Contribution> getPendingContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        Integer role = (Integer) TokenProcess.getAttributeFromToken(authHeader, "role");
        return Result.success(contributionService.getPendingContribution(userId, role, contributionId));
    }

    /** 排行榜 */
    @GetMapping("/contributions/ranking")
    public Result<List<R_OverviewContribution>> getContributionsRanking(
            @RequestParam("type") Integer type,
            @RequestParam("key") Integer key) {
        return Result.success(contributionService.getContributionsRanking(type, key));
    }

    /** 点赞作品 */
    @PostMapping("/users/me/likes")
    public Result<String> likeContribution(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("contributionId") String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = contributionService.likeContribution(userId, contributionId);
        return ok ? Result.success("点赞成功") : Result.error("点赞失败");
    }

    /** 取消点赞 */
    @DeleteMapping("/users/me/likes/{contributionId}")
    public Result<String> unlikeContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = contributionService.unlikeContribution(userId, contributionId);
        return ok ? Result.success("取消点赞成功") : Result.error("取消点赞失败");
    }

    /** 收藏作品 */
    @PostMapping("/users/me/favorites")
    public Result<String> favoriteContribution(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("contributionId") String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = contributionService.favoriteContribution(userId, contributionId);
        return ok ? Result.success("收藏成功") : Result.error("收藏失败");
    }

    /** 取消收藏 */
    @DeleteMapping("/users/me/favorites/{contributionId}")
    public Result<String> unfavoriteContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = contributionService.unfavoriteContribution(userId, contributionId);
        return ok ? Result.success("取消收藏成功") : Result.error("取消收藏失败");
    }

    /** 评论作品 */
    @PostMapping("/contributions/{contributionId}/comments")
    public Result<String> commentContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId,
            @RequestParam("comment") String comment) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = contributionService.commentContribution(userId, contributionId, comment);
        return ok ? Result.success("评论成功") : Result.error("评论失败");
    }

    /** 上传作品 */
    @PostMapping("/users/me/contributions")
    public Result<String> uploadContribution(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("title") String title,
            @RequestParam("type") Integer type,
            @RequestParam("description") String description,
            @RequestPart(name = "tags", required = false) List<String> tags,
            @RequestPart(name = "images") List<MultipartFile> images) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = contributionService.uploadContribution(userId, title, type, description, tags, images);
        return ok ? Result.success("上传成功") : Result.error("上传失败");
    }
}

