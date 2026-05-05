package org.example.PCOI.Controller.v1;
import org.example.PCOI.ResponseDTO.*;
import org.example.PCOI.Security.LoginUser;
import org.example.PCOI.Service.Inter.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController()
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result<String> register(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("gender") Integer gender,
            @RequestPart(name = "SecurityIssues", required = false) List<R_SecurityIssue> SecurityIssues,
            @RequestPart(name = "avatar", required = false) MultipartFile avatar){
        boolean success = userService.register(username, password, gender, SecurityIssues, avatar);
        if (success) {
            return Result.success("注册成功");
        } else {
            return Result.error("注册失败，用户名已存在");
        }
    }

    @PostMapping("/login")
    public Result<R_LoginDTO> login(
            @RequestParam("username") String username,
            @RequestParam("password") String password) {
        Map<String, Object> response = userService.login(username, password);
        if (response.get("rLoginDTO") != null) {
            return Result.success((R_LoginDTO) response.get("rLoginDTO"));
        } else {
            return Result.error((String) response.get("message"));
        }
    }



    @PostMapping("/contributionList")
    public Result<List<R_OverviewContribution>> getContributionList(
            @RequestParam ("userId") String userId){
        List<R_OverviewContribution> list = userService.getContributionList(userId);
        return Result.success(list);
    }

    @PostMapping("/myContributions")
    public Result<R_Audit_My_ContributionsDTO> getMyContributions(
            @AuthenticationPrincipal LoginUser user) {
        R_Audit_My_ContributionsDTO data = userService.getMyContributions(user.getUserId());
        return Result.success(data);
    }

    @PostMapping("/concernedList")
    public Result<List<R_User>> getConcernedList(
            @RequestParam ("userId") String userId){
        List<R_User> list = userService.getConcernedList(userId);
        return Result.success(list);
    }

    @PostMapping("/likedList")
    public Result<List<R_OverviewContribution>> getLikedList(
            @RequestParam ("userId") String userId){
        List<R_OverviewContribution> list = userService.getLikedList(userId);
        return Result.success(list);
    }


    @PostMapping("/favouriteList")
    public Result<List<R_OverviewContribution>> getFavouriteList(
            @RequestParam ("userId") String userId){
        List<R_OverviewContribution> list = userService.getFavouriteList(userId);
        return Result.success(list);
    }

    @PostMapping("/userCommentList")
    public Result<List<R_UserComment>> getUserCommentList(
            @RequestParam ("userId") String userId){
        List<R_UserComment> list = userService.getUserCommentList(userId);
        return Result.success(list);
    }

    @PostMapping("/deleteComment")
    public Result<String> deleteComment(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("commentId") String commentId) {
        boolean ok = userService.deleteComment(commentId, user.getUserId());
        if (ok) {
            return Result.success("删除评论成功");
        }
        return Result.error("删除评论失败");

    }

    @PostMapping("/deleteContribution")
    public Result<String> deleteContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("contributionId") String contributionId) {
        boolean ok = userService.deleteContribution(contributionId, user.getUserId());
        if (ok) {
            return Result.success("删除作品成功");
        }
        return Result.error("删除作品失败");
    }

    @PostMapping("/deletePendingContribution")
    public Result<String> deletePendingContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("contributionId") String contributionId) {
        boolean ok = userService.deletePendingContribution(contributionId, user.getUserId());
        if (ok) {
            return Result.success("删除待审核作品成功");
        }
        return Result.error("删除待审核作品失败");
    }

    @PostMapping("/deleteDismissalContribution")
    public Result<String> deleteDismissalContribution(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("contributionId") String contributionId) {
        boolean ok = userService.deleteDismissalContribution(contributionId, user.getUserId());
        if (ok) {
            return Result.success("删除被驳回作品成功");
        }
        return Result.error("删除被驳回作品失败");
    }

    @PostMapping("/userInfo")
    public Result<R_UserInfoDTO> getUserInfo(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("userId") String userId) {
        R_UserInfoDTO data = userService.getUserInfo(user.getUserId(), userId);
        return Result.success(data);
    }

    @PostMapping("/mySecurityIssues")
    public Result<List<String>> getMySecurityIssues(
            @RequestParam("username") String username){
        List<String> issues = userService.getMySecurityIssues(username);
        return Result.success(issues);
    }

    @PostMapping("/verifySecurityIssues")
    public Result<R_VerifySecurityIssuesDTO> verifySecurityIssues(
            @RequestParam("username") String username,
            @RequestPart(name = "SecurityIssues", required = false) List<R_SecurityIssue> SecurityIssues){
        R_VerifySecurityIssuesDTO data = userService.verifySecurityIssues(username, SecurityIssues);
        if(Boolean.TRUE.equals(data.getVerified()))
        {
            return Result.success(data);
        }
        return Result.error("密保验证失败");

    }

    @PostMapping("/updatePassword")
    public Result<String> updatePassword(
            @RequestHeader("Authorization") String tempToken,
            @RequestParam("username") String username,
            @RequestParam("newPassword") String newPassword) throws Exception {
        String tokenUsername = (String) org.example.PCOI.Utils.TokenProcess.getAttributeFromToken(tempToken, "username");
        Integer type = (Integer) org.example.PCOI.Utils.TokenProcess.getAttributeFromToken(tempToken, "type");
        boolean ok = userService.updatePassword(tokenUsername, type, username, newPassword);
        if (!ok) {
            return Result.error("密码修改失败");
        }
        return Result.success("密码修改成功");
    }

    @PostMapping("/changePassword")
    public Result<String> changePassword(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword) {
        boolean ok = userService.changePassword(user.getUserId(), oldPassword, newPassword);
        if (!ok) {
            return Result.error("密码修改失败，旧密码错误");
        }
        return Result.success("密码修改成功");
    }

    @PostMapping("/changeSecurityIssues")
    public Result<String> changeSecurityIssues(
            @AuthenticationPrincipal LoginUser user,
            @RequestPart(name = "SecurityIssues", required = false) List<R_SecurityIssue> SecurityIssues) {
        boolean ok = userService.changeSecurityIssues(user.getUserId(), SecurityIssues);
        if (!ok) {
            return Result.error("密保问题修改失败");
        }
        return Result.success("密保问题修改成功");
    }

    @PostMapping("/updateUserInfo")
    public Result<String> updateUserInfo(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("newUsername") String newUsername,
            @RequestParam("newGender") Integer newGender,
            @RequestPart(name = "newAvatar", required = false) MultipartFile newAvatar) {
        boolean ok = userService.updateUserInfo(user.getUserId(), newUsername, newGender, newAvatar);
        if (ok) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @PostMapping("/concernUser")
    public Result<String> concernUser(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("concernedUserId") String concernedUserId) {
        boolean ok = userService.concernUser(user.getUserId(), concernedUserId);
        if (ok) {
            return Result.success("关注成功");
        }
        return Result.error("关注失败");

    }

    @PostMapping("/unconcernUser")
    public Result<String> unconcernUser(
            @AuthenticationPrincipal LoginUser user,
            @RequestParam ("concernedUserId") String concernedUserId) {
        boolean ok = userService.unconcernUser(user.getUserId(), concernedUserId);
        if (ok) {
            return Result.success("已取消关注");
        }
        return Result.error("取消关注失败");

    }

}
