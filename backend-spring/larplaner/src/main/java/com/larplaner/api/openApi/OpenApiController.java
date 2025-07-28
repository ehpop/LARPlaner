package com.larplaner.api.openApi;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OpenApiController {

  @GetMapping("/")
  public String redirectToSwagger() {
    return "redirect:/swagger-ui/index.html";
  }

  @GetMapping("/index.html")
  public String redirectToSwaggerHtml() {
    return "redirect:/swagger-ui/index.html";
  }
}