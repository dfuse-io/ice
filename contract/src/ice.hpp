
#include <string>
#include <vector>
#include <eosio/eosio.hpp>

using namespace eosio;
using std::string;
using std::function;

// Typedefs
typedef uint64_t idea_id;

class [[eosio::contract]] ice : public contract {
  public:
      ice(name receiver, name code, datastream<const char*> ds)
        :contract(receiver, code, ds),
        pools(_self, _self.value),
        ideas(_self, _self.value),
        votes(_self, _self.value),
        stats(_self, _self.value)
        {}
              

      // Actions      
      [[eosio::action]]
      void addpool(const name author,const name name, const string description);
      
      [[eosio::action]]
      void addidea(const name author,const name pool_name , const string description);
      
      [[eosio::action]]
      void castvote(const name voter, const name pool_name, const uint64_t idea_id, const uint32_t impact,const uint32_t confidence, const uint32_t ease);

  private:
    struct [[eosio::table]] pool_row {
      name pool_name;
      string description;
      name author;
      
      uint64_t primary_key() const { return pool_name.value; }
    };

    typedef eosio::multi_index<"pools"_n, pool_row> pools_index;

    struct [[eosio::table]] idea_row {
      uint64_t id;
      name pool_name;
      name author;
      string description;
      double avg_impact;
      double avg_confidence;
      double avg_ease;
      double score;
      uint64_t total_votes;
      
      uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index<"ideas"_n, idea_row> ideas_index;

    struct [[eosio::table]] vote_row {
      uint64_t idea_id;
      name voter;
      uint32_t impact;
      uint32_t confidence;
      uint32_t ease;

      uint64_t primary_key() const { return voter.value; }
    };

    typedef eosio::multi_index<"votes"_n, vote_row> votes_index;


    struct [[eosio::table]] stat_row {
      uint64_t id;
      uint32_t idea_count;

      uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index<"stat"_n, stat_row> stats_index;

    struct ice_vote {
      uint32_t impact;
      uint32_t confidence;
      uint32_t ease;

    bool isValid() const { 
      return ((impact < 11) && (confidence < 11) && (ease < 11));
    }

      ice_vote()
        : impact(0), confidence(0), ease(0) {}
    };

    void require_active_auth(const name account) const { require_auth(permission_level{account, "active"_n}); }
    bool update_vote_for_voter(const name voter, const uint64_t idea_id, ice_vote& old_vote, const function<void(vote_row&)> updater);
    void update_idea(const name pool_name, const uint64_t idea_id, const ice_vote& new_vote, const ice_vote old_vote, const bool updated);
    uint64_t gettranscationid();
    
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
    stats_index stats;
};

