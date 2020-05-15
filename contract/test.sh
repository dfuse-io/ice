#!/usr/bin/env bash

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
export EOSC_GLOBAL_API_URL=http://localhost:8080


ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BROWN='\033[0;33m'
NC='\033[0m'

pushd $ROOT/vault &> /dev/null
    printf "${BROWN} create a \'hackthon\' pool ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"babyontheway", "name":"hackathon"}' -p babyontheway

    printf "${BROWN} create ideas in the \'hackathon\' pool ${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"thegreat", "pool_name":"hackathon", "title":"Ship It!", "description":"In computer software - it means to publish / distribute the application in its current state. Often used humurously when the software is buggy and clearly not ready to publish."}' -p thegreat    # transaction_id => 1
    eosc tx create dfuseioice addidea '{"author":"bigontiktok", "pool_name":"hackathon", "title":"Ship It Now!", "description":"In computer software - it means to publish / distribute the application in its current state. Often used humurously when the software is buggy and clearly not ready to publish. NOW!"}' -p bigontiktok    # transaction_id => 2
    eosc tx create dfuseioice addidea '{"author":"mohawkbeard", "pool_name":"hackathon", "title":"release dfuse-eosio v1.0.0", "description":"To improve dfuse instrumented nodeos binary processing speed, we had to make incompatible changes to data exchange format going out of nodeos. This requires you to upgrade your dfuse instrumented nodeos binary to latest version "}' -p mohawkbeard    # transaction_id => 3

    printf "${BROWN} create a \'hackthon2\' pool ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"sepedtyepr", "name":"hackathon2"}' -p sepedtyepr
    printf "${BROWN} create ideas in the \'hackathon2\' pool ${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"weenie", "pool_name":"hackathon2", "title":"This is the best idea!", "description":"In philosophy, ideas are usually taken as mental representational images of some object. Ideas can also be abstract concepts that do not present as mental images. Many philosophers have considered ideas to be a fundamental ontological category of being"}' -p weenie    # transaction_id => 4
    eosc tx create dfuseioice addidea '{"author":"mrplancher", "pool_name":"hackathon2", "title":"convert flux to grpc..... deng","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation "}' -p mrplancher    # transaction_id => 5
    for i in  "1","hackathon" "2","hackathon" "3","hackathon" "4","hackathon2" "5","hackathon2"
    do
        IFS=","
        set -- $i
        for USER in  "thegreat" "babyontheway" "55inchtv" "mrplancher" "reactdev" "weenie" "patch" "sepedtyepr" "mohawkbeard" "bigontiktok" "cno"
        do
            IMP="$(( ( RANDOM % 10 )  + 1 ))"
            EAS="$(( ( RANDOM % 10 )  + 1 ))"
            CON="$(( ( RANDOM % 10 )  + 1 ))"
            eosc tx create dfuseioice castvote "{\"voter\":\"${USER}\",\"pool_name\":\"$2\", \"idea_id\": $1, \"impact\": ${IMP}, \"confidence\": ${CON}, \"ease\": ${EAS}}" -p $USER
        done
    done
popd &> /dev/null