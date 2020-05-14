
#include <string>
#include <vector>
#include <eosio/eosio.hpp>

using namespace eosio;
using std::string;



// Typedefs

class [[eosio::contract]] ice : public contract {
  public:
      ice(name receiver, name code, datastream<const char*> ds)
        :contract(receiver, code, ds),
        pools(_self, _self.value),
        ideas(_self, _self.value) 
        {}
              

      // Actions      
      [[eosio::action]]
      void addpool(const name author,const name name, const string description);
      
      [[eosio::action]]
      void addidea(const name author,const name pool_name , const string description);

      [[eosio::action]]
      void reset(const uint64_t any);


  private:
    struct [[eosio::table]] pool {
      name pool_name;
      string description;
      name author;
      
      uint64_t primary_key() const { return pool_name.value; }
    };

    typedef eosio::multi_index<"pools"_n, pool> pools_index;

    struct [[eosio::table]] idea {
      uint64_t id;
      name pool_name;
      name author;
      string description;
      
      uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index<"ideas"_n, idea> ideas_index;


    void require_active_auth(const name account) const { require_auth(permission_level{account, "active"_n}); }

    /**
     * Clear completely a EOS table (`multi_index`) from all its data.
     */
    template <name::raw TableName, typename T, typename... Indices>
    void table_clear(eosio::multi_index<TableName, T, Indices...>& table) {
      print("clearing table\n");
      auto itr = table.begin();
      while (itr != table.end()) {
        itr = table.erase(itr);
      }
    }


    pools_index pools;
    ideas_index ideas;
};

