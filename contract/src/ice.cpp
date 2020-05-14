#include "ice.hpp"

void ice::addpool(const name author,const name name, const string description) {
    printf("%s is adding a pool: %s - %s", author.to_string().c_str(), name.to_string().c_str(), description.c_str());
    require_active_auth(author);

    auto pool_itr = pools.find(name.value);
    check(pool_itr == pools.end(), "pool " + name.to_string() + "  already exists.");
    
    auto new_pool_ir = pools.emplace(_self, [&](auto& pool) {
        pool.pool_name = name;
        pool.description = description;
        pool.author = author;
    });
}

void ice::addidea(const name author,const name pool_name , const string description) {
  printf("%s is adding idea %s to pool: %s", author.to_string().c_str(),  description.c_str(), pool_name.to_string().c_str());
  require_active_auth(author);
  
  auto pool_itr = pools.find(pool_name.value);
  check(pool_itr != pools.end(), "pool " + pool_name.to_string() + " does not exists.");

  auto idea_itr = ideas.emplace(_self, [&](auto& idea) {
    idea.id = ideas.available_primary_key();
    idea.pool_name = pool_itr->pool_name;
    idea.author = author;
    idea.description = description;
  });
}

void ice::castvote(const name voter,const idea_id idea_id, const uint32_t impact,const uint32_t confidence, const uint32_t ease) {
  printf("%s is voting for %d idea : (%d x %d x %d)", voter.to_string().c_str(), idea_id,impact, confidence, ease); 
}


/**
 * Reset all
 */
void ice::reset(const uint64_t any) {
  print("reseting ice tables\n");
  require_active_auth(_self);
    
    table_clear(pools);
    table_clear(ideas);
}
