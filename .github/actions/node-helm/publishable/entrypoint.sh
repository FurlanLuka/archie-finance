#!/bin/sh
set -e

echo ${KUBE_CONFIG_DATA} | base64 -d > kubeconfig
export KUBECONFIG="${PWD}/kubeconfig"
chmod 600 ${PWD}/kubeconfig

echo "running entrypoint command(s)"

echo Your container args are: "$1"
echo Environment variable: "$INPUT_COMMAND"

response=$(eval $INPUT_COMMAND)

echo "::set-output name=response::$response"