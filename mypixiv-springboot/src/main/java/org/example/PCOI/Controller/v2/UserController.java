package org.example.PCOI.Controller.v2;

import org.example.PCOI.ResponseDTO.*;
import org.example.PCOI.Service.Inter.UserService;
import org.example.PCOI.Utils.TokenProcess;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * v2 RESTful - User APIs
 *
 * 约定：
 * - 登录/注册属于 auth 领域：/api/v2/auth
 * - 当前用户资源：/api/v2/users/me
 * - 其他用户：/api/v2/users/{userId}
 */
@RestController("userControllerV2")
@RequestMapping("/api/v2")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------- Auth --------

    /** 注册 */
    @PostMapping("/auth/register")
    public Result<String> register(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("gender") Integer gender,
            @RequestPart(name = "SecurityIssues", required = false) List<R_SecurityIssue> SecurityIssues,
            @RequestPart(name = "avatar", required = false) MultipartFile avatar) {
        boolean success = userService.register(username, password, gender, SecurityIssues, avatar);
        return success ? Result.success("注册成功") : Result.error("注册失败，用户名已存在");
    }

    /** 登录 */
    @PostMapping("/auth/login")
    public Result<R_LoginDTO> login(
            @RequestParam("username") String username,
            @RequestParam("password") String password) {
        Map<String, Object> response = userService.login(username, password);
        if (response.get("rLoginDTO") != null) {
            return Result.success((R_LoginDTO) response.get("rLoginDTO"));
        }
        return Result.error((String) response.get("message"));
    }

    // -------- User resources --------

    /** 用户投稿列表（某个用户） */
    @GetMapping("/users/{userId}/contributions")
    public Result<List<R_OverviewContribution>> getContributionList(@PathVariable String userId) {
        return Result.success(userService.getContributionList(userId));
    }

    /** 我的投稿（需要登录） */
    @GetMapping("/users/me/contributions")
    public Result<R_Audit_My_ContributionsDTO> getMyContributions(
            @RequestHeader("Authorization") String authHeader) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        return Result.success(userService.getMyContributions(userId));
    }

    /** 关注列表（某个用户关注的人） */
    @GetMapping("/users/{userId}/following")
    public Result<List<R_User>> getConcernedList(@PathVariable String userId) {
        return Result.success(userService.getConcernedList(userId));
    }

    /** 点赞列表 */
    @GetMapping("/users/{userId}/likes")
    public Result<List<R_OverviewContribution>> getLikedList(@PathVariable String userId) {
        return Result.success(userService.getLikedList(userId));
    }

    /** 收藏列表 */
    @GetMapping("/users/{userId}/favorites")
    public Result<List<R_OverviewContribution>> getFavouriteList(@PathVariable String userId) {
        return Result.success(userService.getFavouriteList(userId));
    }

    /** 用户评论列表 */
    @GetMapping("/users/{userId}/comments")
    public Result<List<R_UserComment>> getUserCommentList(@PathVariable String userId) {
        return Result.success(userService.getUserCommentList(userId));
    }

    /** 删除我的评论 */
    @DeleteMapping("/users/me/comments/{commentId}")
    public Result<String> deleteComment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String commentId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.deleteComment(commentId, userId);
        return ok ? Result.success("删除评论成功") : Result.error("删除评论失败");
    }

    /** 删除我的作品 */
    @DeleteMapping("/users/me/contributions/{contributionId}")
    public Result<String> deleteContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.deleteContribution(contributionId, userId);
        return ok ? Result.success("删除作品成功") : Result.error("删除作品失败");
    }

    /** 删除我待审核的作品 */
    @DeleteMapping("/users/me/contributions/{contributionId}/pending")
    public Result<String> deletePendingContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.deletePendingContribution(contributionId, userId);
        return ok ? Result.success("删除待审核作品成功") : Result.error("删除待审核作品失败");
    }

    /** 删除我被驳回的作品 */
    @DeleteMapping("/users/me/contributions/{contributionId}/dismissed")
    public Result<String> deleteDismissalContribution(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String contributionId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.deleteDismissalContribution(contributionId, userId);
        return ok ? Result.success("删除被驳回作品成功") : Result.error("删除被驳回作品失败");
    }

    /** 获取用户信息 */
    @GetMapping("/users/{userId}")
    public Result<R_UserInfoDTO> getUserInfo(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String userId) throws Exception {
        String requesterId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        return Result.success(userService.getUserInfo(requesterId, userId));
    }

    // -------- Password & security issues --------

    /** 获取密保问题（通过用户名） */
    @GetMapping("/users/security-issues")
    public Result<List<String>> getMySecurityIssues(@RequestParam("username") String username) {
        return Result.success(userService.getMySecurityIssues(username));
    }

    /** 校验密保问题 */
    @PostMapping("/users/security-issues/verify")
    public Result<R_VerifySecurityIssuesDTO> verifySecurityIssues(
            @RequestParam("username") String username,
            @RequestPart(name = "SecurityIssues", required = false) List<R_SecurityIssue> SecurityIssues) {
        R_VerifySecurityIssuesDTO data = userService.verifySecurityIssues(username, SecurityIssues);
        return Boolean.TRUE.equals(data.getVerified()) ? Result.success(data) : Result.error("密保验证失败");
    }

    /** 通过临时 token 修改密码 */
    @PutMapping("/users/password")
    public Result<String> updatePassword(
            @RequestHeader("Authorization") String tempToken,
            @RequestParam("username") String username,
            @RequestParam("newPassword") String newPassword) throws Exception {
        String tokenUsername = (String) TokenProcess.getAttributeFromToken(tempToken, "username");
        Integer type = (Integer) TokenProcess.getAttributeFromToken(tempToken, "type");
        boolean ok = userService.updatePassword(tokenUsername, type, username, newPassword);
        return ok ? Result.success("密码修改成功") : Result.error("密码修改失败");
    }

    /** 修改我的密码 */
    @PutMapping("/users/me/password")
    public Result<String> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.changePassword(userId, oldPassword, newPassword);
        return ok ? Result.success("密码修改成功") : Result.error("密码修改失败，旧密码错误");
    }

    /** 修改我的密保问题 */
    @PutMapping("/users/me/security-issues")
    public Result<String> changeSecurityIssues(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart(name = "SecurityIssues", required = false) List<R_SecurityIssue> SecurityIssues) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.changeSecurityIssues(userId, SecurityIssues);
        return ok ? Result.success("密保问题修改成功") : Result.error("密保问题修改失败");
    }

    /** 更新我的基本信息 */
    @PutMapping("/users/me")
    public Result<String> updateUserInfo(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("newUsername") String newUsername,
            @RequestParam("newGender") Integer newGender,
            @RequestPart(name = "newAvatar", required = false) MultipartFile newAvatar) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.updateUserInfo(userId, newUsername, newGender, newAvatar);
        return ok ? Result.success("更新成功") : Result.error("更新失败");
    }

    /** 关注用户 */
    @PostMapping("/users/me/following")
    public Result<String> concernUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("concernedUserId") String concernedUserId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.concernUser(userId, concernedUserId);
        return ok ? Result.success("关注成功") : Result.error("关注失败");
    }

    /** 取消关注 */
    @DeleteMapping("/users/me/following/{concernedUserId}")
    public Result<String> unconcernUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String concernedUserId) throws Exception {
        String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
        boolean ok = userService.unconcernUser(userId, concernedUserId);
        return ok ? Result.success("已取消关注") : Result.error("取消关注失败");
    }
}

