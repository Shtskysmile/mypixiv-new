package org.example.PCOI.Entity;

import java.time.LocalDateTime;

public class Log {
    private String operatorId;   // 操作用户
    private String description;  // 操作描述
    private LocalDateTime time;  // 操作时间戳

    public Log() {
    }

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
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
}
