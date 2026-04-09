FROM alpine/git:latest AS cloner
WORKDIR /repo
RUN git clone --depth 1 https://github.com/LeoonKameleon/mrix.git .

FROM maven:3.9.9-eclipse-temurin-23-alpine AS builder
WORKDIR /app
COPY --from=cloner /repo /app
RUN mvn clean package

FROM eclipse-temurin:23-jre-alpine
WORKDIR /app
RUN addgroup -S mrixgroup && adduser -S mrixuser -G mrixgroup
COPY --chown=mrixuser:mrixgroup --from=builder /app/target/mrix.jar /app/mrix.jar
USER mrixuser
ENTRYPOINT [ "java", "-jar", "mrix.jar" ]