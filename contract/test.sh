#!/usr/bin/env bash

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
export EOSC_GLOBAL_API_URL=http://localhost:8080


ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BROWN='\033[0;33m'
NC='\033[0m'

pushd $ROOT/vault &> /dev/null
    printf "${BROWN} create a \'hackthon\' pool ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"babyontheway", "name":"hackathon", "description":"Our first pool!"}' -p babyontheway
    printf "${BROWN} create ideas in the \'hackathon\' pool ${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"thegreat", "pool_name":"hackathon", "description":"Ship It!"}' -p thegreat    # transaction_id => 1
    eosc tx create dfuseioice addidea '{"author":"bigontiktok", "pool_name":"hackathon", "description":"Ship It Now!"}' -p bigontiktok    # transaction_id => 2
    eosc tx create dfuseioice addidea '{"author":"mohawkbeard", "pool_name":"hackathon", "description":"release dfuse-eosio v1.0.0"}' -p mohawkbeard    # transaction_id => 3
    printf "${BROWN} create a \'hackthon\' pool ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"sepedtyepr", "name":"hackathon2", "description":"Our second pool!"}' -p sepedtyepr
    printf "${BROWN} create ideas in the \'hackathon2\' pool ${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"weenie", "pool_name":"hackathon2", "description":"This is the best idea!"}' -p weenie    # transaction_id => 4
    eosc tx create dfuseioice addidea '{"author":"mrplancher", "pool_name":"hackathon2", "description":"convert flux to grpc..... deng"}' -p mrplancher    # transaction_id => 5
    for i in  "1","hackathon" "2","hackathon" "3","hackathon" "4","hackathon2" "5","hackathon2"
    do
        IFS=","
        set -- $i
        for USER in  "thegreat" "+" "55inchtv" "mrplancher" "reactdev" "weenie" "patch" "sepedtyepr" "mohawkbeard" "bigontiktok" "cno"
        do
            IMP="$(( ( RANDOM % 10 )  + 1 ))"
            EAS="$(( ( RANDOM % 10 )  + 1 ))"
            CON="$(( ( RANDOM % 10 )  + 1 ))"
            eosc tx create dfuseioice castvote "{\"voter\":\"${USER}\",\"pool_name\":\"$2\", \"idea_id\": $1, \"impact\": ${IMP}, \"confidence\": ${CON}, \"ease\": ${EAS}}" -p $USER
        done
    done
popd &> /dev/null