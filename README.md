# КАК ЗАПУСКАТЬ

Из корня проекта.

Тесты:
- `./gradlew test`
- `./gradlew clean test`

Запуск backend:
- `./gradlew bootRun`
- `./gradlew bootRun -Dspring.profiles.active=dev`

Запуск backend с `prod`:
- `./gradlew bootRun -Dspring.profiles.active=prod`

Запуск frontend отдельно:
- `cd frontend`
- `npm install`
- `npm run dev`

Запуск всего в режиме разработки:
- Терминал 1: `./gradlew bootRun`
- Терминал 2: `cd frontend && npm run dev`

Сборка backend:
- `./gradlew build`
- `./gradlew bootJar`

Сборка единого jar с frontend внутри:
- `./gradlew -PappProfile=front bootJar`

Запуск собранного jar:
- `java -jar build/libs/internet-programming-sivby-0.0.1-SNAPSHOT.jar`

Запуск jar с профилем `dev`:
- `java -jar build/libs/internet-programming-sivby-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev`

Запуск jar с профилем `prod`:
- `java -jar build/libs/internet-programming-sivby-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`

Liquibase:
- `./gradlew update`
- `./gradlew migrationStatus`
- `./gradlew migrationRollbackOne -PliquibaseCommandValue=1`
- `./gradlew migrationGenerateChangelog`
- `./gradlew migrationDiff`
