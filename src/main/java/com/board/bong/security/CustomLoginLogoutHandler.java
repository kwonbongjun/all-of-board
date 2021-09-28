package com.board.bong.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomLoginLogoutHandler
{
    @Bean
    public LoginSuccessHandler loginSuccessHandler()
    {
        return new LoginSuccessHandler();
    }

    @Bean
    public LoginFailureHandler loginFailureHandler()
    {
        return new LoginFailureHandler();
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

    public static class LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler
    {
        @Override
        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            Map<String, Object> map = new HashMap<>();
            map.put("code", 000);
            map.put("message", exception.getMessage());
            ObjectMapper om = new ObjectMapper();
            String jsonStr = om.writeValueAsString(map);

            PrintWriter out = response.getWriter();
            out.print(jsonStr);
            out.flush();
            out.close();
//            super.onAuthenticationFailure(request, response, exception) ;
//                try
//                {
//                    HttpSession session = request.getSession();
////                    session.setAttribute("USER_ID", auth);
//                }
//                catch (Exception e)
//                {
//
//                    logger.error("handle login success error.", e);
//                }

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
