package org.example.PCOI.Entity;

import java.time.LocalDateTime;

public class Comment {
    private String commentId;     // 评论ID
    private String description;   // 评论内容
    private LocalDateTime time;   // 评论时间
    private String author;        // 评论者
    private String contribution;  // 被评论作品

    public Comment() {
    }

    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
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

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getContribution() {
        return contribution;
    }

    public void setContribution(String contribution) {
        this.contribution = contribution;
    }
}
