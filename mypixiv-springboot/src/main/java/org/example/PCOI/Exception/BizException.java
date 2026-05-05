package org.example.PCOI.Exception;

/**
 * 业务异常：用于在 Service 层直接抛出，由全局异常处理统一转 Result.error。
 */
public class BizException extends RuntimeException {
    public BizException(String message) {
        super(message);
    }
}

