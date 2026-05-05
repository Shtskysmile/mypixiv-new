package org.example.PCOI.Entity;

public class SecurityIssue {
    private String userId;       // 用户ID
    private String description;  // 密保问题
    private String answer;       // 密保答案

    public SecurityIssue() {
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
