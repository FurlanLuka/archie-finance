# Stress tests

## How to run the test
- Build k6 script using: ```nx run stress-tests:build --main=apps/tests/stress/src/<path_to_file>```
- Start minikube
- Follow guide to set up k6 operator https://k6.io/blog/running-distributed-tests-on-k8s/
- Create config map with built k6 script `kubectl create configmap example-stress-test --from-file ./dist/apps/tests/stress/main.js --from-file ./dist/apps/tests/stress/main.js.map`
- Create `k6-custom-resource.yml` file with content (See https://github.com/grafana/k6-operator#executing-tests for more options):
    ```
    apiVersion: k6.io/v1alpha1
    kind: K6
    metadata:
      name: k6-sample
    spec:
      parallelism: 1
      arguments: --out statsd
      script:
        configMap:
          name: example-stress-test
          file: main.js
      runner:
        image: cudr12/k6-amqp:latest
        env:
          - name: QUEUE_URL
            value: amqp://guest:guest@host.minikube.internal:5672/
    #      - name: K6_STATSD_ENABLE_TAGS
    #        value: 'true'
    #      - name: K6_STATSD_ADDR
    #        value: host.minikube.internal:8125
    ```
- Apply k6 custom resource yml: `kubectl apply -f ./k6-custom-resource.yml`
- Remove k6 custom resource yml once all jobs finis:  `kubectl delete -f ./k6-custom-resource.yml`
