FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean install -DskipTests


FROM eclipse-temurin:17-jre-jammy AS prod
WORKDIR /app

ARG JAR_FILE=target/*.jar

COPY --from=builder /app/${JAR_FILE} app.jar

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

RUN addgroup --system spring && adduser --system --ingroup spring spring
RUN usermod -a -G 1000 spring
USER spring:spring

ENTRYPOINT ["java","-jar","app.jar"]
