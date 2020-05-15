#!/usr/bin/env bash

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
export EOSC_GLOBAL_API_URL=http://localhost:8080


ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BROWN='\033[0;33m'
NC='\033[0m'

pushd $ROOT/vault &> /dev/null
    printf "${BROWN} create a \'hackathon\' pool ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"babyontheway", "name":"hackathon"}' -p babyontheway

    printf "${BROWN} create ideas in the \'hackathon\' pool ${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"thegreat", "pool_name":"hackathon", "title":"NFT Explorer", "description":"NFTs need an explorer too. So come and explore with me!"}' -p thegreat    # transaction_id => 1
    eosc tx create dfuseioice addidea '{"author":"bigontiktok", "pool_name":"hackathon", "title":"TikTokChain", "description":"Let's bring blockchain to TikTok. TikTok pre-sale pricing available for all dfuse employees who vote favourably!"}' -p bigontiktok    # transaction_id => 2
    eosc tx create dfuseioice addidea '{"author":"mohawkbeard", "pool_name":"hackathon", "title":"ICE", "description":"Impact, Confidence, Ease of Implementation. As you can see, it's already implemented, so you should all vote 10!"}' -p mohawkbeard    # transaction_id => 3

    printf "${BROWN} create a \'hacktahon2\' pool ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"sepedtyepr", "name":"hackathon2"}' -p sepedtyepr
    printf "${BROWN} create ideas in the \'hackathon2\' pool ${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"weenie", "pool_name":"hackathon2", "title":"Free coffee", "description":"I'm tired of ordering coffee. Coffee is now a free for all. Don't let the name of the idea confuse you!"}' -p weenie    # transaction_id => 4
    eosc tx create dfuseioice addidea '{"author":"mrplancher", "pool_name":"hackathon2", "title":"Watcher","description":"My watcher can watch your accounts for you while you watch The Watchmen"}' -p mrplancher    # transaction_id => 5
    for i in  "1","hackathon" "2","hackathon" "3","hackathon" "4","hackathon2" "5","hackathon2"
    do
        IFS=","
        set -- $i
        for USER in  "sepedtyepr" "mohawkbeard"
        do
            IMP="$(( ( RANDOM % 10 )  + 1 ))"
            EAS="$(( ( RANDOM % 10 )  + 1 ))"
            CON="$(( ( RANDOM % 10 )  + 1 ))"
            eosc tx create dfuseioice castvote "{\"voter\":\"${USER}\",\"pool_name\":\"$2\", \"idea_id\": $1, \"impact\": ${IMP}, \"confidence\": ${CON}, \"ease\": ${EAS}}" -p $USER
        done
    done
popd &> /dev/null
