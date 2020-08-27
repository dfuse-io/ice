#!/bin/bash -e

export EOSC_GLOBAL_INSECURE_VAULT_PASSPHRASE=secure
export EOSC_GLOBAL_API_URL=http://localhost:8080


ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BROWN='\033[0;33m'
NC='\033[0m'

pushd $ROOT/vault > /dev/null
    printf "\n${BROWN}### Creating an \'office\' poll...${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"dfuseioice", "name":"office"}' -p dfuseioice

    printf "\n${BROWN}### Creating ideas to vote on for the \'office\' poll${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"dfuseioice", "pool_name":"office", "title":"Bottled water for the plants", "description":"Plants deserve better treatment is all."}' -p dfuseioice    # transaction_id => 1
    eosc tx create dfuseioice addidea '{"author":"msdelisle", "pool_name":"office", "title":"Renowned sushi chef to cook lunch everyday", "description":"This would probably boost productivity. If not, at least we tried it."}' -p msdelisle    # transaction_id => 2
    eosc tx create dfuseioice addidea '{"author":"mrkauffman", "pool_name":"office", "title":"Mandatory 2-day work week", "description":"Condensing the work week in 2 days of 20 hours each means more free time for all!"}' -p mrkauffman    # transaction_id => 3

    printf "\n${BROWN}### Creating a \'rebrand\' poll... ${NC}\n"
    eosc tx create dfuseioice addpool '{"author":"dfuseioice", "name":"rebrand"}' -p dfuseioice

    printf "\n${BROWN}### Creating ideas to vote on for the \'rebrand\' poll${NC}\n"
    eosc tx create dfuseioice addidea '{"author":"dfuseioice", "pool_name":"rebrand", "title":"DFuse", "description":"Using capital letters for the D and the F makes it easier to type."}' -p dfuseioice    # transaction_id => 4
    eosc tx create dfuseioice addidea '{"author":"msdelisle", "pool_name":"rebrand", "title":"EOS Canada", "description":"Has anyone seen that name somewhere before? I kinda dig it!"}' -p msdelisle    # transaction_id => 5
    eosc tx create dfuseioice addidea '{"author":"mrkauffman", "pool_name":"rebrand", "title":"df", "description":"Less is more"}' -p mrkauffman    # transaction_id => 6
    eosc tx create dfuseioice addidea '{"author":"theboss", "pool_name":"rebrand", "title":"Google", "description":"It kinda has a nice ring to it... sounds like money!"}' -p theboss    # transaction_id => 7

    printf "\n${BROWN}### Random votes being casted on ideas for the ICE demo...${NC}\n"
    for i in  "1","office" "2","office" "3","office" "4","rebrand" "5","rebrand" "6","rebrand" "7","rebrand"
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

printf "\n${BROWN}### We\'re done here!${NC}\n"
