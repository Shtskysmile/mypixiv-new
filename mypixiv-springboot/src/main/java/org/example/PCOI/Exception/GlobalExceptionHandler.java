package org.example.PCOI.Exception;

import org.example.PCOI.ResponseDTO.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理：让 Controller 更"薄"，尽量不写 try/catch。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BizException.class)
    public Result<String> handleBiz(BizException ex) {
        log.error("❌ 业务异常: {}", ex.getMessage(), ex);
        return Result.error(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Result<String> handleAny(Exception ex) {
        // 打印完整的异常堆栈，方便调试
        log.error("❌ 未处理异常: {}", ex.getMessage(), ex);
        // 生产环境可以记录日志并返回更通用的错误信息
        String message = ex.getMessage();
        if (message == null || message.isEmpty()) {
            message = "服务器内部错误: " + ex.getClass().getSimpleName();
        }
        return Result.error(message);
    }
}

