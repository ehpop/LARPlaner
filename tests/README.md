# K6 Load Test

## Prerequisites

1. Installed K6 tool https://grafana.com/docs/k6/latest/set-up/install-k6/#install-k6

##
To run load test to LARPlaner API:
1. run SpringBoot app with `loadtest` profile
```shell
mvn spring-boot:run -Dspring-boot.run.profiles=loadtest
```
2. run k6 script using:
```shell
k6 run --out 'web-dashboard' loadTest.js
```
3. Web dashboard will be available at http://127.0.0.1:5665
