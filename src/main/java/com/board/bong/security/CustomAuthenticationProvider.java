package com.board.bong.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


public class CustomAuthenticationProvider extends DaoAuthenticationProvider//implements AuthenticationProvider
{
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException
    {
        String username = (String) authentication.getPrincipal();
        String password = (String) authentication.getCredentials();
//        if(!matchPassword(password,user.getPassword())) {
//            throw new BadCredentialsException(username);
//        }
//
//        return new UsernamePasswordAuthenticationToken(username, password, Collections.singleton(new SimpleGrantedAuthority("ADMIN")));
        try {
          return super.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("error");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
    private boolean matchPassword(String loginPwd, String password) {
        return passwordEncoder().matches(loginPwd,password);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}