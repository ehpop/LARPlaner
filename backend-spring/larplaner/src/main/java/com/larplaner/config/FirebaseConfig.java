package com.larplaner.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.IOException;
import java.io.InputStream;
import java.io.File;
import java.nio.file.Path;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
public class FirebaseConfig {

  @Value("${firebase.service-account.path}")
  private Resource serviceAccountResource;

  private void printDirectoryContents(File directory) {
    System.out.println("Contents of directory: " + directory.getAbsolutePath());
    File[] files = directory.listFiles();
    if (files != null) {
      for (File file : files) {
        System.out.println(file.getName());
      }
    }
  }

  @PostConstruct
  public void initializeFirebase() throws IOException {
    try {
      File currentDir = new File(".");
      printDirectoryContents(currentDir);
      printDirectoryContents(currentDir.getParentFile());
      printDirectoryContents(currentDir.getParentFile().getParentFile());

      InputStream serviceAccountStream = serviceAccountResource.getInputStream();

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
