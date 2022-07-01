#!/bin/sh
set -e

echo ${KUBE_CONFIG_DATA} | base64 -d > kubeconfig
export KUBECONFIG="${PWD}/kubeconfig"
chmod 600 ${PWD}/kubeconfig

git config --global --add safe.directory /github/workspace

echo "running entrypoint command(s)"

sh -c "nx affected $*"