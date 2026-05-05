package org.example.PCOI.ResponseDTO;

public class R_UserInfoDTO {
    private R_User user;         // 用户信息
    private Boolean isConcerned; // 是否已关注

    public R_UserInfoDTO() {
    }

    public R_User getUser() {
        return user;
    }

    public void setUser(R_User user) {
        this.user = user;
    }

    public Boolean getIsConcerned() {
        return isConcerned;
    }

    public void setIsConcerned(Boolean isConcerned) {
        this.isConcerned = isConcerned;
    }
}
