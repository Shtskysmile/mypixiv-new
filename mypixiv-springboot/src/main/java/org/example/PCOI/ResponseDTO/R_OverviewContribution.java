package org.example.PCOI.ResponseDTO;

import java.util.List;

public class R_OverviewContribution {
    private String contributionId; // 作品ID
    private String title;          // 作品标题
    private String authorId;       // 上传者
    private String authorName;     // 上传者名称
    private List<String> image;    // 作品图片路径（多图）
    private Integer viewCount;     // 浏览数
    private Integer favoriteCount; // 收藏数
    private Integer likeCount;     // 点赞数
    private Integer commentCount;  // 评论数
    private String dismissalReason;// 驳回理由
    private String avatar;         // 上传者头像路径

    public R_OverviewContribution() {
    }

    public String getContributionId() {
        return contributionId;
    }

    public void setContributionId(String contributionId) {
        this.contributionId = contributionId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public List<String> getImage() {
        return image;
    }

    public void setImage(List<String> image) {
        this.image = image;
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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}
