package org.example.PCOI.ResponseDTO;

import java.time.LocalDateTime;

public class R_ContributionComment {
    private String commentId;       // 评论ID
    private String author;          // 评论用户
    private String authorName;      // 评论用户名称
    private String description;     // 评论内容
    private LocalDateTime time;     // 评论时间戳
    private String avatar;          // 用户头像路径

    public R_ContributionComment() {
    }

    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}
