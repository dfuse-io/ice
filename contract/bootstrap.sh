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
  eosc boot bootseq.yaml
  printf "${BROWN}Creating \'dfuseioice\' account${NC}\n"
  eosc system newaccount eosio dfuseioice --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'dfuseioice\' ${NC}\n"
  eosc transfer eosio dfuseioice 10000
popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'marc\' account${NC}\n"
  eosc system newaccount eosio marc --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'marc\' ${NC}\n"
  eosc transfer eosio marc 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'alex\' account${NC}\n"
  eosc system newaccount eosio alex --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'alex\' ${NC}\n"
  eosc transfer eosio alex 10000
  popd &> /dev/null

pushd $ROOT/vault &> /dev/null
  printf "${BROWN}Buy \'300000'\ ram bytes to deploy your contract  ${NC}\n"
  eosc system buyrambytes dfuseioice dfuseioice 600000
  eosc system buyrambytes marc marc 10000
  eosc system buyrambytes alex alex 10000
popd &> /dev/null