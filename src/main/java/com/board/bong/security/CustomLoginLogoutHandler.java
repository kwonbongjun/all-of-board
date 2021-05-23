package com.board.bong.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;

import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class CustomLoginLogoutHandler
{
    @Bean
    public LoginSuccessHandler loginSuccessHandler()
    {
        return new LoginSuccessHandler();
    }
    @Bean
    public LogoutSuccessHandler logoutSuccessHandler()
    {
        return new LogoutSuccessHandler();
    }
    public static class LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler
    {
        @Override
        public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication auth)
        {
            try
            {
                HttpSession session = request.getSession();
                session.setAttribute("USER_ID", auth);
            }
            catch (Exception e)
            {

                logger.error("handle login success error.", e);
            }
        }
    }
    public static class LogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler
    {
        @Override
        public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
                                    Authentication auth) throws IOException
        {
            log.debug("logout success.");
            PrintWriter out = response.getWriter();
            out.print("{}");
            out.flush();
            out.close();
        }
        private final Logger log = LoggerFactory.getLogger(LogoutSuccessHandler.class);
    }
}
