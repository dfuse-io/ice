#!/bin/bash -xe
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

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BROWN='\033[0;33m'
NC='\033[0m'

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
export EOSC_GLOBAL_API_URL=http://localhost:8080

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Boostraping testnet${NC}\n"
  eosc --vault-file=$ROOT/vault/eosc-vault.json boot bootseq.yaml
popd &> /dev/null