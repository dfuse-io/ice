#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] ice : public contract {
  public:
      using contract::contract;
      
      [[eosio::action]]
      void hi( name user );
};