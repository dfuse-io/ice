#!/bin/bash -e
# Copyright 2020 dfuse Platform Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BROWN='\033[0;33m'
NC='\033[0m'

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
pushd $ROOT/bootstrapping > /dev/null
KEY=$(head -1 genesis.key)

printf "${BROWN}\n### Boostraping a brand new testnet with dfuse for EOSIO...\n\n${NC}"

yes | dfuseeos init
yes | dfuseeos purge

dfuseeos start \
    --booter-bootseq=./bootseq.yaml \
    --booter-nodeos-api-addr=http://localhost:8888 \
    --booter-private-key=$KEY \
    --booter-vault-file=$ROOT/vault/eosc-vault.json

popd > /dev/null

printf "${BROWN}\n### You should keep this process running in the background while running the ICE demo.\n### Thanks for trying ICE @ https://github.com/dfuse-io/ice\n\n${NC}"
