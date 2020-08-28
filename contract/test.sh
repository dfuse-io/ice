#!/bin/bash -e

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
export EOSC_GLOBAL_API_URL=http://localhost:8080


ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BROWN='\033[0;33m'
NC='\033[0m'

pushd $ROOT/vault > /dev/null
    printf "\n${BROWN}### Creating a \'new.feature\' pool for ideas...${NC}"
    eosc tx create dfuseioice addpool '{"author":"dfuseioice", "name":"new.feature"}' -p dfuseioice

    printf "\n${BROWN}### Creating ideas to poll in the \'new.feature\' pool${NC}"
    eosc tx create dfuseioice addidea '{"author":"dfuseioice", "pool_name":"new.feature", "title":"Reading minds", "description":"Because reading minds is what our customers really want, we should focus on this feature next!"}' -p dfuseioice    # transaction_id => 1
    eosc tx create dfuseioice addidea '{"author":"msdelisle", "pool_name":"new.feature", "title":"Seeing through walls", "description":"We had many request from users who want to see through walls, so I think we should focus on this asap."}' -p msdelisle    # transaction_id => 2
    eosc tx create dfuseioice addidea '{"author":"mrkauffman", "pool_name":"new.feature", "title":"Flying", "description":"Jetpacks are overrated, our customers want to be able to fly on their own."}' -p mrkauffman    # transaction_id => 3

    printf "\n${BROWN}### Creating a \'hackathon\' pool for ideas... ${NC}"
    eosc tx create dfuseioice addpool '{"author":"dfuseioice", "name":"hackathon"}' -p dfuseioice

    printf "\n${BROWN}### Creating ideas to poll in the \'hackathon\' pool${NC}"
    eosc tx create dfuseioice addidea '{"author":"dfuseioice", "pool_name":"hackathon", "title":"Helium Blockchain Hotspot", "description":"We should definitely build a Helium Hotspot!"}' -p dfuseioice    # transaction_id => 4
    eosc tx create dfuseioice addidea '{"author":"msdelisle", "pool_name":"hackathon", "title":"Decentralized OS", "description":"Building a decentralized OS sounds like a really fun project."}' -p msdelisle    # transaction_id => 5
    eosc tx create dfuseioice addidea '{"author":"mrkauffman", "pool_name":"hackathon", "title":"Game with NFTs", "description":"What about an ARPG game with unique NFT items that are tradable on the blockchain?"}' -p mrkauffman    # transaction_id => 6
    eosc tx create dfuseioice addidea '{"author":"theboss", "pool_name":"hackathon", "title":"dfuse for Ethereum binary", "description":"We should package our dfuse for Ethereum services in a single binary."}' -p theboss    # transaction_id => 7

    printf "\n${BROWN}### Random votes being casted on ideas for the ICE Pools demo...${NC}"
    for i in  "1","new.feature" "2","new.feature" "3","new.feature" "4","hackathon" "5","hackathon" "6","hackathon" "7","hackathon"
    do
        IFS=","
        set -- $i
        for USER in  "msdelisle" "mrkauffman" "theboss"
        do
            IMP="$(( ( RANDOM % 10 )  + 1 ))"
            EAS="$(( ( RANDOM % 10 )  + 1 ))"
            CON="$(( ( RANDOM % 10 )  + 1 ))"
            eosc tx create dfuseioice castvote "{\"voter\":\"${USER}\",\"pool_name\":\"$2\", \"idea_id\": $1, \"impact\": ${IMP}, \"confidence\": ${CON}, \"ease\": ${EAS}}" -p $USER
        done
    done
popd > /dev/null

printf "\n${BROWN}### We\'re done here!${NC}\n\n"
