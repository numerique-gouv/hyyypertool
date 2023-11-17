#!/usr/bin/env bash

export N_PREFIX="$HOME/.scalingo/n"
export PATH="$N_PREFIX/bin:$PATH:$HOME/bin:$HOME/node_modules/.bin"
export NODE_ENV=${NODE_ENV:-production}
