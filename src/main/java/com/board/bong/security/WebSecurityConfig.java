package com.board.bong.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.CompositeSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionFixationProtectionStrategy;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    public WebSecurityConfig(CustomLoginLogoutHandler.LoginSuccessHandler loginSuccessHandler,
                             CustomLoginLogoutHandler.LogoutSuccessHandler logoutSuccessHandler,
                             CustomLoginLogoutHandler.LoginFailureHandler loginFailureHandler) {
        this.loginSuccessHandler = loginSuccessHandler;
        this.logoutSuccessHandler = logoutSuccessHandler;
        this.loginFailureHandler = loginFailureHandler;
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
//                .sessionAuthenticationStrategy(customSessionAuthenticationStrategy())
                .and()
                .authorizeRequests()
                .antMatchers("/css/**", "/fonts/**", "/image/**", "/js/**").permitAll()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/login/**").permitAll()
                .antMatchers("/board/**").permitAll()
                .anyRequest().authenticated()
//                .and()
//                .formLogin()
//                .loginPage("/login")
//                .loginProcessingUrl("/login")
//                .defaultSuccessUrl("/login.html",true)
//                .failureUrl("/login.html?error=true")
//                .successHandler(customAuthenticationSuccessHandler)
//                .permitAll()
                .and()
                .cors()
//                .and()
//                .exceptionHandling()
//                .authenticationEntryPoint(authenticationEntryPoint)
                .and()
                .addFilterAt(customUserAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class)
                .logout()
                .invalidateHttpSession(true)
                .logoutUrl("/logout")
                .logoutSuccessHandler(logoutSuccessHandler)
                .permitAll();
    }
//    @Override
//    public UserDetailsService userDetailsService() {
//        UserDetails user =
//                User.withDefaultPasswordEncoder()
//                        .username("user")
//                        .password("password")
//                        .roles("USER")
//                        .build();
//
//        return new InMemoryUserDetailsManager(user);
//    }
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomUserAuthenticationFilter customUserAuthenticationFilter() throws Exception
    {
        CustomUserAuthenticationFilter filter = new CustomUserAuthenticationFilter(
                authenticationManager);
//        filter.setFilterProcessesUrl("/login");
//        filter.setRequiresAuthenticationRequestMatcher(
//                new AntPathRequestMatcher("/login"));
        filter.setAuthenticationSuccessHandler(loginSuccessHandler);
        filter.setAuthenticationFailureHandler(loginFailureHandler);
        filter.setAuthenticationManager(authenticationManagerBean());
//        filter.setSessionAuthenticationStrategy(customSessionAuthenticationStrategy());
        return filter;
    }

    public class CustomUserAuthenticationFilter extends UsernamePasswordAuthenticationFilter
    {
        public CustomUserAuthenticationFilter(AuthenticationManager authenticationManager) {
            super.setAuthenticationManager(authenticationManager);
        }
        @Override
        public Authentication attemptAuthentication(HttpServletRequest request,
                                                    HttpServletResponse response) throws AuthenticationException
        {
            if (! request.getMethod().equals("POST"))
            {
                throw new AuthenticationCredentialsNotFoundException("error");
            }

            String uri = request.getRequestURI();
            try
            {
                if (uri.equals("/login"))
                    return attemptDirectAuthentication(request);
            }
            catch (Exception e)
            {
                if (e instanceof AuthenticationException)
                    throw (AuthenticationException) e;
//                    throw new AuthenticationException("ID 혹은 Password가 잘못 되었습니다.");
                throw new AuthenticationCredentialsNotFoundException("error");
            }

            throw new AuthenticationCredentialsNotFoundException("error");
        }
        public Authentication attemptDirectAuthentication(HttpServletRequest request)
                throws AuthenticationException
        {
            DirectLoginInfo info = new DirectLoginInfo();
            String str;
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                str = readRequestToString(request);
                info = objectMapper.readValue(str, DirectLoginInfo.class);
            } catch (Exception e) {
                e.printStackTrace();
            }

            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(info.username, info.password);
//            CustomAuthenticationToken authRequestToken = new CustomAuthenticationToken(
//                    info.username, info.password, request);

            setDetails(request, token);
            return getAuthenticationManager().authenticate(token);
        }
    }


    private String readRequestToString(HttpServletRequest request) throws IOException
    {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader())
        {
            String line;
            while ((line = reader.readLine()) != null)
                sb.append(line);
        }
        return sb.toString();
    }
    public AuthenticationManager getAuthenticationManager() {
        return authenticationManager;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder authManagerBuilder) throws Exception {
        authManagerBuilder.authenticationProvider(customAuthenticationProvider());
//        authManagerBuilder.inMemoryAuthentication().withUser("test").password(passwordEncoder().encode("1234")).roles("ADMIN", "USER");
    }

    @Bean
    public DaoAuthenticationProvider customAuthenticationProvider()
    {
        CustomAuthenticationProvider provider = new CustomAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService());
//        provider.setPreAuthenticationChecks(customUserDetailsChecker());
        provider.setPasswordEncoder(customPasswordEncoder());
        provider.setHideUserNotFoundExceptions(false);
        return provider;
    }
    @Bean
    public CustomUserDetailsService customUserDetailsService()
    {
        return new CustomUserDetailsService();
    }
    @Bean
    public PasswordEncoder customPasswordEncoder()
    {
        String idForEncode = "bcrypt";
        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put(idForEncode, new BCryptPasswordEncoder());
//        encoders.put("md-sha256", new MessageDigestPasswordEncoder("SHA-256"));
        return new DelegatingPasswordEncoder(idForEncode, encoders);
    }
    @Bean
    public CompositeSessionAuthenticationStrategy customSessionAuthenticationStrategy()
    {
        ConcurrentSessionControlAuthenticationStrategy concurrentSessionCtrlAuthStrategy =
                new ConcurrentSessionControlAuthenticationStrategy(sessionRegistry());

        concurrentSessionCtrlAuthStrategy.setMaximumSessions(5);
        concurrentSessionCtrlAuthStrategy.setExceptionIfMaximumExceeded(false);

        SessionFixationProtectionStrategy sessionFixationProtectionStrategy =
                new SessionFixationProtectionStrategy();

        RegisterSessionAuthenticationStrategy registerSessionStrategy =
                new RegisterSessionAuthenticationStrategy(sessionRegistry());

        return new CompositeSessionAuthenticationStrategy(
                Arrays.asList(
                        concurrentSessionCtrlAuthStrategy,
                        sessionFixationProtectionStrategy,
                        registerSessionStrategy));
    }

//    @Bean
//    public ConcurrentSessionFilter customConcurrentSessionFilter()
//    {
//        return new CustomConcurrentSessionFilter(sessionRegistry());
//    }

    @Bean
    public SessionRegistry sessionRegistry()
    {
        return new SessionRegistryImpl();
    }
    public static class DirectLoginInfo implements Serializable {
        public String username;
        public String password;
    }
    @Autowired
    private CustomAuthenticationEntryPoint authenticationEntryPoint;
    @Autowired
    private AuthenticationManager authenticationManager;
    private final CustomLoginLogoutHandler.LoginSuccessHandler loginSuccessHandler;
    private final CustomLoginLogoutHandler.LoginFailureHandler loginFailureHandler;
    private final CustomLoginLogoutHandler.LogoutSuccessHandler logoutSuccessHandler;
}