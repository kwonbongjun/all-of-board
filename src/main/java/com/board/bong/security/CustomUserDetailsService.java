package com.board.bong.security;

import com.board.bong.bean.User;
import com.board.bong.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.*;

public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User user = userRepository.findById(username);

        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(user.getRole()));

        List<GrantedAuthority> authentications = authorities;
        Set<GrantedAuthority> dbAuthenticationsSet = new HashSet<>(authentications);
        List<GrantedAuthority> dbAuthentications = new ArrayList<>(dbAuthenticationsSet);

        return new CustomUserDetails(user.getId(),user.getPassword(),dbAuthentications);
    }
}