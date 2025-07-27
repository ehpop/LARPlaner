package com.larplaner.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.IOException;
import java.io.InputStream;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
public class FirebaseConfig {

  @Value("${firebase.service-account.path}")
  private Resource serviceAccountResource;

  @PostConstruct
  public void initializeFirebase() throws IOException {
    try (InputStream serviceAccountStream = serviceAccountResource.getInputStream()) {
      FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
          .build();

      if (FirebaseApp.getApps().isEmpty()) {
        FirebaseApp.initializeApp(options);
        System.out.println("Firebase Admin SDK initialized successfully!");
      } else {
        System.out.println("Firebase Admin SDK already initialized.");
      }
    } catch (IOException e) {
      System.err.println("Error initializing Firebase Admin SDK: " + e.getMessage());
      throw e;
    }
  }

  @Bean
  public FirebaseApp getFirebaseApp() {
    return FirebaseApp.getInstance();
  }
}
