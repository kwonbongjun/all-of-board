package com.board.bong.security;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException
    {
        String uri = request.getRequestURI();

        if (uri.equals("/index.html"))
        {
            response.sendRedirect("/login.html");
        }
        else
        {
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            String data = "{\"code\": " + "2200" + "}";

            PrintWriter out = response.getWriter();
            out.print(data);
            out.flush();
            out.close();
        }
    }
}

