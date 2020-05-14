#include "ice.hpp"

void ice::addpool(const name author,const name name, const string& description) {
    printf("%s is adding a new pool: %s", author, name);
    require_active_auth(author);

    auto pool_itr = pools.find(name.value);
    check(pool_itr == pools.end(), "pool " + name.to_string() + "  already exists.");
    
    auto new_pool_ir = pools.emplace(_self, [&](auto& pool) {
        pool.pool_name = name;
        pool.description = description;
        pool.author = author;
    });
}

void ice::addidea(const name author,const name pool_name , const string& description) {
    printf("%s is adding an idea to pool: %s", author, pool_name);
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