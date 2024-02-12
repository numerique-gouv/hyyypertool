#!/bin/bash

set -meo pipefail

curl -XPOST localhost:8081/reset

curl -sSf -XPOST \
  --header "Content-Type: application/x-yaml" \
  --data-binary "@agentconnect.yml" \
  "localhost:8181/mocks"

