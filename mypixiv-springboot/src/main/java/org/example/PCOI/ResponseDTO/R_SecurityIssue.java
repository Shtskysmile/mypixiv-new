package org.example.PCOI.ResponseDTO;

public class R_SecurityIssue {
    private String description; // 密保问题
    private String answer;      // 密保答案

    public R_SecurityIssue() {
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
