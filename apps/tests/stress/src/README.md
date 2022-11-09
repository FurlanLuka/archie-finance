# Stress tests

## Run the test using k6 operator

- Start test utils api: `PORT=91 npm run start utils-test-api`
- Start tested api at port 90 (`PORT=90 npm run start onboarding-api` for `onboarding/full-onboarding.ts` script).
- Start minikube
- Follow [guide](https://k6.io/blog/running-distributed-tests-on-k8s/) to set up k6 operator (up to make deploy command)
- Start script:
  - Build k6 script using: `nx run stress-tests:build --main=apps/tests/stress/src/<path_to_file>`
  - Create config map with built k6 script `kubectl create configmap example-stress-test --from-file ./dist/apps/tests/stress/main.js --from-file ./dist/apps/tests/stress/main.js.map`
  - Create `k6-custom-resource.yml` file with content (More [options](https://github.com/grafana/k6-operator#executing-tests) are available):
    ```
    apiVersion: k6.io/v1alpha1
    kind: K6
    metadata:
      name: k6-sample
    spec:
      parallelism: 1
    #  arguments: --out statsd
      script:
        configMap:
          name: example-stress-test
          file: main.js
      runner:
        image: cudr12/k6-amqp:latest
        env:
          - name: QUEUE_URL
            value: amqp://guest:guest@host.minikube.internal:5672/
          - name: API_BASE_URL
            value: http://host.minikube.internal:90
          - name: AUTH_BASE_URL
            value: http://localhost:91
    #      - name: K6_STATSD_ENABLE_TAGS
    #        value: 'true'
    #      - name: K6_STATSD_ADDR
    #        value: host.minikube.internal:8125
    ```
  - Apply k6 custom resource yml: `kubectl apply -f ./k6-custom-resource.yml`
  - Remove k6 custom resource yml once all jobs finish: `kubectl delete -f ./k6-custom-resource.yml`

## Run the test locally

- Build k6 binary with amqp extension.
  - Clone [xamqp project](https://github.com/acuderman/xk6-amqp/blob/feature/amqp-wth-headers-docker-image)
  - Run make build
  - Copy generated k6 binary to archie-microservices root and rename file to k6bin
- Run `ngrok http 91` and set https domain as `AUTH0_DOMAIN=<ngrok domain>` on both tested api and authorization api
- Start test utils api: `PORT=91 npm run start utils-test-api`
- Start tested api at port 90 (onboarding api for `onboarding/full-onboarding.ts` script).
- Start script:
  - Build k6 script using: `nx run stress-tests:build --main=apps/tests/stress/src/<path_to_file>`
  - Run `./k6bin run ./dist/apps/tests/stress/main.js -e QUEUE_URL=amqp://guest:guest@host.minikube.internal:5672/ -e API_BASE_URL="http://localhost:90" -e AUTH_BASE_URL="http://localhost:91"`

### Runner base image

- Runner dockerfile is available [here](https://github.com/acuderman/xk6-amqp/blob/feature/amqp-wth-headers-docker-image/Dockerfile.local).
