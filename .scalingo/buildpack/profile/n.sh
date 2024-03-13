#!/usr/bin/env bash

export N_PREFIX="$HOME/.scalingo/n"
export PATH="$N_PREFIX/bin:$PATH:$HOME/bin:$HOME/node_modules/.bin"
export NODE_ENV=${NODE_ENV:-production}
export NODE_EXTRA_CA_CERTS=${NODE_EXTRA_CA_CERTS:-/usr/share/ca-certificates/Scalingo/scalingo-database.pem}
