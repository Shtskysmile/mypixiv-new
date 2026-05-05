package org.example.PCOI.Controller;

import org.example.PCOI.Security.LoginUser;

/**
 * Controller 层公共基类：集中放置常用工具方法，减少重复代码。
 */
public abstract class BaseController {

    protected String uid(LoginUser user) {
        return user.getUserId();
    }

    protected Integer role(LoginUser user) {
        return user.getRole();
    }

    protected Integer type(LoginUser user) {
        return user.getType();
    }

    protected String uname(LoginUser user) {
        return user.getUsername();
    }
}

