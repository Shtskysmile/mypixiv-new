package org.example.PCOI.ResponseDTO;

public class R_VerifySecurityIssuesDTO {
    private Boolean verified; // 是否验证成功
    private String tempToken; // 临时令牌

    public R_VerifySecurityIssuesDTO() {
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getTempToken() {
        return tempToken;
    }

    public void setTempToken(String tempToken) {
        this.tempToken = tempToken;
    }
}
