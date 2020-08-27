#!/bin/bash -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BROWN='\033[0;33m'
NC='\033[0m'
CORES=$(getconf _NPROCESSORS_ONLN)

printf "\n${BROWN}Compiling. It shouldn\'t take too long...${NC}\n"

mkdir -p $ROOT/bootstrapping/build
eosio-cpp ./src/ice.cpp -o ./bootstrapping/build/ice.wasm > /dev/null

printf "\n${BROWN}Done!${NC}\n\n"
