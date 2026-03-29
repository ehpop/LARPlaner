package com.larplaner.service.admin.firebase;

import com.google.firebase.auth.UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@Profile("loadtest")
public class LoadtestUserLookupService implements UserLookupService {

    @Override
    public Map<String, String> getUserIDsByEmails(Collection<String> emails) {
        return emails.stream()
                .filter(StringUtils::hasText)
                .filter(email -> email.contains("@"))
                .collect(Collectors.toMap(Function.identity(), email -> email.substring(0, email.indexOf("@"))));
    }

    @Override
    public String getUserIDByEmail(String email) {
        return "";
    }

    @Override
    public List<String> getAllUserEmails() {
        return List.of();
    }

    @Override
    public UserInfo getUserInfoById(String uid) {
        return null;
    }

}
