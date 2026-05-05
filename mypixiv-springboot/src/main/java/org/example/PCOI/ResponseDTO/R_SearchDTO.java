package org.example.PCOI.ResponseDTO;

import java.util.List;

public class R_SearchDTO {
    private List<R_User> users;                        // 用户列表
    private List<R_OverviewContribution> illustrations; // 插画列表
    private List<R_OverviewContribution> mangas;        // 漫画列表

    public R_SearchDTO() {
    }

    public List<R_User> getUsers() {
        return users;
    }

    public void setUsers(List<R_User> users) {
        this.users = users;
    }

    public List<R_OverviewContribution> getIllustrations() {
        return illustrations;
    }

    public void setIllustrations(List<R_OverviewContribution> illustrations) {
        this.illustrations = illustrations;
    }

    public List<R_OverviewContribution> getMangas() {
        return mangas;
    }

    public void setMangas(List<R_OverviewContribution> mangas) {
        this.mangas = mangas;
    }
}
