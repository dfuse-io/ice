#!/usr/bin/env bash

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
export EOSC_GLOBAL_API_URL=http://localhost:8080


ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BROWN='\033[0;33m'
NC='\033[0m'

pushd $ROOT/vault &> /dev/null
    printf "${BROWN} reset ice tables${NC}\n"
    eosc tx create dfuseioice reset '{"any": 1}' -p dfuseioice
    printf "${BROWN} create a \'hackthon\' pool ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"dfuseioice", "name":"hackathon", "description":"Our first pool!"}' -p dfuseioice
    printf "${BROWN} create an idea in the \'hackathon\' pool ${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"dfuseioice", "pool_name":"hackathon", "description":"Ship It!"}' -p dfuseioice
    printf "${BROWN} dfuseioice votes for the idea ${NC}\n"
    eosc tx create dfuseioice castvote '{"voter":"dfuseioice","pool_name":"hackathon", "idea_id":"0", "impact":2, "confidence":7, "ease":8}' -p dfuseioice
    printf "${BROWN} marc votes for the idea ${NC}\n"
    eosc tx create dfuseioice castvote '{"voter":"marc","pool_name":"hackathon", "idea_id":"0", "impact":5, "confidence":4, "ease":9}' -p marc
    printf "${BROWN} alex votes for the idea ${NC}\n"
    eosc tx create dfuseioice castvote '{"voter":"alex","pool_name":"hackathon", "idea_id":"0", "impact":9, "confidence":6, "ease":7}' -p alex
    printf "${BROWN} marc updated his vote  ${NC}\n"
    eosc tx create dfuseioice castvote '{"voter":"marc","pool_name":"hackathon", "idea_id":"0", "impact":9, "confidence":9, "ease":9}' -p marc
popd &> /dev/null