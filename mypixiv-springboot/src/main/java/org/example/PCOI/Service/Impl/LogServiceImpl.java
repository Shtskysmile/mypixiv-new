package org.example.PCOI.Service.Impl;

import org.example.PCOI.Mapper.LogMapper;
import org.example.PCOI.Service.Inter.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class LogServiceImpl implements LogService {

    private static final Logger log = Logger.getLogger(LogServiceImpl.class.getName());

    @Autowired
    private LogMapper logMapper;

    @Override
    public void logMethodExecution(String userId, String operation) {
        try {
            logMapper.insertLog(userId, operation);
        } catch (Exception e) {
            // logging failure should not break the request
            log.warning("[LogServiceImpl] insertLog failed: " + e.getMessage());
        }
    }
}
