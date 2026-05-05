package org.example.PCOI.ResponseDTO;

public class R_LoginDTO {
    private R_User user;
    private String token;

    public R_LoginDTO() {
    }

    public R_User getUser() {
        return user;
    }

    public void setUser(R_User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
