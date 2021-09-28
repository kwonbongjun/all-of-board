package com.board.bong.security;

import org.springframework.security.core.AuthenticationException;

public class CustomAuthenticationException extends AuthenticationException
{
    public CustomAuthenticationException(int code)
    {
        super("");
        this.code = code;
    }

    public CustomAuthenticationException(int code, String message)
    {
        super(message);
        this.code = code;
    }
    
    public int getCode() 
    {
        return code;
    }
    
    private final int code;
    private static final long serialVersionUID = 1L;
}
