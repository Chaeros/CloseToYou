package ssafy.closetoyou.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.closetoyou.email.domain.EmailAuthentication;
import ssafy.closetoyou.email.service.port.EmailAuthenticationRepository;
import ssafy.closetoyou.global.error.errorcode.UserErrorCode;
import ssafy.closetoyou.global.error.exception.CloseToYouException;
import ssafy.closetoyou.user.controller.port.UserService;
import ssafy.closetoyou.user.domain.User;
import ssafy.closetoyou.user.controller.request.UserSignUp;
import ssafy.closetoyou.user.service.port.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final EmailAuthenticationRepository emailAuthenticationRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean checkEmailDuplicated(String email) {
        return emailAuthenticationRepository.existsEmailAuthenticationCode(email);
    }

    public Long signUp(UserSignUp userSignUp) {

        User user = userSignUp.toModel();

        if (!emailAuthenticationRepository.isEmailAuthenticated(user.getEmail())){
            throw new CloseToYouException(UserErrorCode.NOT_AUTHENTICATED);
        }

        if (userRepository.existsEmail(user.getEmail())) {
            throw new CloseToYouException(UserErrorCode.DUPLICATE_EMAIL);
        }

        user.passwordEncode(passwordEncoder);
        return userRepository.saveUser(user).getUserId();
    }
}
