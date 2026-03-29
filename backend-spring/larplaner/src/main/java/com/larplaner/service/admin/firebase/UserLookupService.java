package com.larplaner.service.admin.firebase;

import com.google.firebase.auth.UserInfo;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface UserLookupService {
    Map<String, String> getUserIDsByEmails(Collection<String> emails);

    String getUserIDByEmail(String email);

    List<String> getAllUserEmails();

    UserInfo getUserInfoById(String uid);
}
