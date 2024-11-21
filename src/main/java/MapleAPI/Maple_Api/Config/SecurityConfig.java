//package MapleAPI.Maple_Api.Config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                // 인증/인가 설정
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/UserSearch").permitAll() // /UserSearch는 인증 없이 접근 가능
//                        .anyRequest().authenticated() // 그 외 요청은 인증 필요
//                )
//                // 로그인 폼 설정 비활성화
//                .formLogin(form -> form.disable())
//                // CSRF 보호 비활성화 (개발 환경에서만 사용 권장)
//                .csrf(csrf -> csrf.disable());
//
//        return http.build();
//    }
//}