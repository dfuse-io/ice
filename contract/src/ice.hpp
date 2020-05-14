
#include <string>
#include <vector>
#include <eosio/eosio.hpp>

using namespace eosio;
using std::string;



// Typedefs
typedef uint64_t idea_id;

class [[eosio::contract]] ice : public contract {
  public:
      ice(name receiver, name code, datastream<const char*> ds)
        :contract(receiver, code, ds),
        pools(_self, _self.value),
        ideas(_self, _self.value),
        votes(_self, _self.value)
        {}
              

      // Actions      
      [[eosio::action]]
      void addpool(const name author,const name name, const string description);
      
      [[eosio::action]]
      void addidea(const name author,const name pool_name , const string description);
      
      [[eosio::action]]
      void castvote(const name voter,const idea_id idea_id, const uint32_t impact,const uint32_t confidence, const uint32_t ease);

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
      float avg_impact;
      float avg_confidence;
      float avg_ease;
      float score;
      uint64_t total_votes;
      
      uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index<"ideas"_n, idea> ideas_index;

    struct [[eosio::table]] vote {
      uint64_t id;
      name voter;
      idea_id idea_id;
      uint32_t impact;
      uint32_t confidence;
      uint32_t ease;

      uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index<"votes"_n, vote> votes_index;


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
    votes_index votes;
};

