package org.example.PCOI.Entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;

import java.time.LocalDateTime;
import java.util.List;

// 启用自动生成带 TypeHandler 的 ResultMap
@TableName(value = "contribution", autoResultMap = true)
public class Contribution {
    private String contributionId;     // 作品ID
    private Integer type;              // 作品类型0-插画，1-漫画
    private String title;              // 作品标题

    // 作品图片路径（JSON 数组）
    @TableField(value = "image", typeHandler = JacksonTypeHandler.class)
    private List<String> image;

    private String description;        // 描述信息
    private Integer status;            // 状态(正常状态,封禁状态）0-正常，1-封禁
    private Integer auditStatus;       // 审核状态（待审核，已通过，已驳回）0-待审核，1-已通过，2-已驳回
    private LocalDateTime publishTime; // 上传时间
    private String authorId;           // 上传者
    private Integer viewCount;         // 浏览数
    private Integer favoriteCount;     // 收藏数
    private Integer likeCount;         // 点赞数
    private Integer commentCount;      // 评论数
    private String dismissalReason;    // 驳回理由

    public Contribution() {
    }

    public String getContributionId() {
        return contributionId;
    }

    public void setContributionId(String contributionId) {
        this.contributionId = contributionId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getImage() {
        return image;
    }

    public void setImage(List<String> image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getAuditStatus() {
        return auditStatus;
    }

    public void setAuditStatus(Integer auditStatus) {
        this.auditStatus = auditStatus;
    }

    public LocalDateTime getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(LocalDateTime publishTime) {
        this.publishTime = publishTime;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getFavoriteCount() {
        return favoriteCount;
    }

    public void setFavoriteCount(Integer favoriteCount) {
        this.favoriteCount = favoriteCount;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public String getDismissalReason() {
        return dismissalReason;
    }

    public void setDismissalReason(String dismissalReason) {
        this.dismissalReason = dismissalReason;
    }
}
