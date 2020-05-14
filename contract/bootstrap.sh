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
  eosc transfer eosio dfuseioice 10000000
popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'dada\' account${NC}\n"
  eosc system newaccount eosio dada --auth-key EOS6LyK9rfMPoAZeniyRSiH8bmykyrUS5juTK7KgdWaPtw7U3Q7cz --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'dada\' ${NC}\n"
  eosc transfer eosio dada 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'mama\' account${NC}\n"
  eosc system newaccount eosio mama --auth-key EOS75sLjJawNXqXYaL5HCEC6UG5qvjMyzcvmAtT6XPBauN4azfhuv --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'mama\' ${NC}\n"
  eosc transfer eosio mama 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'thegreat\' account${NC}\n"
  eosc system newaccount eosio thegreat --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'thegreat\' ${NC}\n"
  eosc transfer eosio thegreat 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'babyontheway\' account${NC}\n"
  eosc system newaccount eosio babyontheway --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'babyontheway\' ${NC}\n"
  eosc transfer eosio babyontheway 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'55inchtv\' account${NC}\n"
  eosc system newaccount eosio 55inchtv --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'55inchtv\' ${NC}\n"
  eosc transfer eosio 55inchtv 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'mrplancher\' account${NC}\n"
  eosc system newaccount eosio mrplancher --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'mrplancher\' ${NC}\n"
  eosc transfer eosio mrplancher 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'jayzh\' account${NC}\n"
  eosc system newaccount eosio jayzh --auth-key EOS61WUHLoNgUgZHC1cdkUfzNaDbxa7B3Kv5zRyVP1nX3ubfBSh3A --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'jayzh\' ${NC}\n"
  eosc transfer eosio jayzh 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'getstuffdone\' account${NC}\n"
  eosc system newaccount eosio getstuffdone --auth-key EOS78fDjDsjACB9Jm2ZtqZFKUqdcQTTfXVWBgN8R2k6hinEFiEaUf --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'getstuffdone\' ${NC}\n"
  eosc transfer eosio getstuffdone 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'reactdev\' account${NC}\n"
  eosc system newaccount eosio reactdev --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'reactdev\' ${NC}\n"
  eosc transfer eosio reactdev 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'weenie\' account${NC}\n"
  eosc system newaccount eosio weenie --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'weenie\' ${NC}\n"
  eosc transfer eosio weenie 10000
  popd &> /dev/null

pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'patch\' account${NC}\n"
  eosc system newaccount eosio patch --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'patch\' ${NC}\n"
  eosc transfer eosio patch 10000
  popd &> /dev/null

  pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'sepedtyepr\' account${NC}\n"
  eosc system newaccount eosio sepedtyepr --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'sepedtyepr\' ${NC}\n"
  eosc transfer eosio sepedtyepr 10000
  popd &> /dev/null

  pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'mohawkbeard\' account${NC}\n"
  eosc system newaccount eosio mohawkbeard --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'mohawkbeard\' ${NC}\n"
  eosc transfer eosio mohawkbeard 10000
  popd &> /dev/null

  pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'bigontiktok\' account${NC}\n"
  eosc system newaccount eosio bigontiktok --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'bigontiktok\' ${NC}\n"
  eosc transfer eosio bigontiktok 10000
  popd &> /dev/null

  pushd $ROOT/bootstrapping &> /dev/null
  printf "${BROWN}Creating \'cno\' account${NC}\n"
  eosc system newaccount eosio cno --auth-key EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd --stake-cpu 10 --stake-net 10
  printf "${BROWN}Transfering \'10000\' to \'cno\' ${NC}\n"
  eosc transfer eosio cno 10000
  popd &> /dev/null

pushd $ROOT/vault &> /dev/null

  printf "${BROWN}Buy RAM for all the accounts${NC}\n"
  eosc system buyrambytes dfuseioice dfuseioice 600000
  eosc system buyrambytes dfuseioice dada 10000
  eosc system buyrambytes dfuseioice mama 10000
  eosc system buyrambytes dfuseioice thegreat 10000
  eosc system buyrambytes dfuseioice babyontheway 10000
  eosc system buyrambytes dfuseioice 55inchtv 10000
  eosc system buyrambytes dfuseioice mrplancher 10000
  eosc system buyrambytes dfuseioice jayzh 10000
  eosc system buyrambytes dfuseioice getstuffdone 10000
  eosc system buyrambytes dfuseioice reactdev 10000
  eosc system buyrambytes dfuseioice weenie 10000
  eosc system buyrambytes dfuseioice patch 10000
  eosc system buyrambytes dfuseioice sepedtyepr 10000
  eosc system buyrambytes dfuseioice mohawkbeard 10000
  eosc system buyrambytes dfuseioice bigontiktok 10000
  eosc system buyrambytes dfuseioice cno 10000

popd &> /dev/null