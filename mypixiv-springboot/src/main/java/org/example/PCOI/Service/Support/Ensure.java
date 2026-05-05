package org.example.PCOI.Service.Support;

import org.example.PCOI.Exception.BizException;

/**
 * 轻量断言工具：用于将 if + return false/null 的分支变成异常，减少样板代码。
 */
public final class Ensure {

    private Ensure() {}

    public static void isTrue(boolean condition, String message) {
        if (!condition) throw new BizException(message);
    }

    public static <T> T notNull(T obj, String message) {
        if (obj == null) throw new BizException(message);
        return obj;
    }
}

