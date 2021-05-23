package com.board.bong.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken
{
    public CustomAuthenticationToken(Object principal, Object credentials,
                                     HttpServletRequest request)
    {
        super(principal, credentials);
        this._request = request;
    }


    public CustomAuthenticationToken(Object principal, Object credentials,
                                     Collection<? extends GrantedAuthority> authorities, HttpServletRequest request)
    {
        super(principal, credentials, authorities);
        this._request = request;
    }


    public HttpServletRequest getRequest() { return _request; }

    private HttpServletRequest _request;
}