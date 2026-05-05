package org.example.PCOI.Controller.v2;

import org.example.PCOI.ResponseDTO.*;
import org.example.PCOI.Service.Inter.CommunityAdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * v2 RESTful - Community Admin APIs
 *
 * 路径风格：
 * - 资源使用名词 users / contributions / comments
 * - 动作通过 HTTP Method 表达（POST/DELETE/GET）
 *
 * 前缀：/api/v2/admin/community
 */
@RestController("communityAdminControllerV2")
@RequestMapping("/api/v2/admin/community")
public class CommunityAdminController {

    private final CommunityAdminService communityAdminService;

    public CommunityAdminController(CommunityAdminService communityAdminService) {
        this.communityAdminService = communityAdminService;
    }

    /** 封禁用户 */
    @PostMapping("/users/{userId}/block")
    public Result<String> blockUser(@PathVariable String userId) {
        boolean ok = communityAdminService.blockUser(userId);
        return ok ? Result.success("封禁用户成功") : Result.error("封禁用户失败");
    }

    /** 解封用户 */
    @DeleteMapping("/users/{userId}/block")
    public Result<String> unblockUser(@PathVariable String userId) {
        boolean ok = communityAdminService.unblockUser(userId);
        return ok ? Result.success("解封用户成功") : Result.error("解封用户失败");
    }

    /** 获取被封禁用户列表 */
    @GetMapping("/users/blocked")
    public Result<List<R_User>> getBlockedUsers() {
        return Result.success(communityAdminService.getBlockedUsers());
    }

    /** 封禁作品 */
    @PostMapping("/contributions/{contributionId}/block")
    public Result<String> blockContribution(@PathVariable String contributionId) {
        boolean ok = communityAdminService.blockContribution(contributionId);
        return ok ? Result.success("封禁作品成功") : Result.error("封禁作品失败");
    }

    /** 解封作品 */
    @DeleteMapping("/contributions/{contributionId}/block")
    public Result<String> unblockContribution(@PathVariable String contributionId) {
        boolean ok = communityAdminService.unblockContribution(contributionId);
        return ok ? Result.success("解封作品成功") : Result.error("解封作品失败");
    }

    /** 获取被封禁作品列表 */
    @GetMapping("/contributions/blocked")
    public Result<List<R_OverviewContribution>> getBlockedContributions() {
        return Result.success(communityAdminService.getBlockedContributions());
    }

    /** 查看被封禁作品详情（v1: POST /communityAdmin/bannedContribution） */
    @GetMapping("/contributions/{contributionId}/blocked")
    public Result<R_Contribution> getBannedContribution(@PathVariable String contributionId) {
        return Result.success(communityAdminService.getBannedContribution(contributionId));
    }

    /** 获取待审核/已通过/已驳回作品列表（聚合 DTO） */
    @GetMapping("/contributions/audits")
    public Result<R_Audit_My_ContributionsDTO> auditContributions() {
        return Result.success(communityAdminService.auditContributions());
    }

    /** 通过审核 */
    @PostMapping("/contributions/{contributionId}/approve")
    public Result<String> approveContribution(@PathVariable String contributionId) {
        boolean ok = communityAdminService.approveContribution(contributionId);
        return ok ? Result.success("已通过审核") : Result.error("通过审核失败");
    }

    /** 驳回审核 */
    @PostMapping("/contributions/{contributionId}/dismiss")
    public Result<String> dismissContribution(
            @PathVariable String contributionId,
            @RequestParam("dismissalReason") String dismissalReason) {
        boolean ok = communityAdminService.dismissContribution(contributionId, dismissalReason);
        return ok ? Result.success("已驳回作品") : Result.error("驳回作品失败");
    }

    /** 删除评论 */
    @DeleteMapping("/comments/{commentId}")
    public Result<String> deleteComment(@PathVariable String commentId) {
        boolean ok = communityAdminService.deleteComment(commentId);
        return ok ? Result.success("删除评论成功") : Result.error("删除评论失败");
    }
}

