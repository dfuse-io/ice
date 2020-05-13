#include <eosio/eosio.hpp>
using namespace eosio;

class [[eosio::contract]] test : public eosio::contract {
public:
    using contract::contract;

    [[eosio::action]] void testact( name test ) {
    }
};

EOSIO_DISPATCH( test, (testact) )