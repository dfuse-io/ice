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
  require_active_auth(voter);

  auto idea_itr = ideas.find(idea_id);

  // expectation if idea_itr is === end it means we ddidn't find him
  check(idea_itr != ideas.end(), "idea does not exists.");

  ice_vote vote;
  vote.impact = impact;
  vote.confidence = confidence;
  vote.ease = ease;

  check(vote.isValid(), "impact, confidence and ease must be at most 10");


  update_vote_for_voter(voter, idea_itr->id, [&](auto& vote_itr){
    vote_itr.impact = vote.impact;
    vote_itr.confidence = vote.confidence;
    vote_itr.ease = vote.ease;
  });

  update_idea(idea_id, vote);
}

void ice::update_vote_for_voter(const name voter, const idea_id idea_id, const function<void(vote_row&)> updater) {

  votes_index votervotes(get_self(), voter.value);
  
  auto vote_itr = votervotes.find(idea_id);
  if (vote_itr == votervotes.end()) {
    votervotes.emplace(_self, [&](auto& vote) {
      vote.voter = voter;
      vote.idea_id = idea_id;
      updater(vote);
    });
  } else {
    votervotes.modify(vote_itr, _self, [&](auto& vote) { updater(vote); });
  }
}


void ice::update_idea(const idea_id idea_id, const ice_vote& vote) {
  auto idea_itr = ideas.find(idea_id);
  check(idea_itr != ideas.end(), "idea does not exists.");
    
  ideas.modify(idea_itr, _self, [&](auto& idea) { 
    auto current_vote_count = idea.total_votes;
    auto impact = idea.avg_impact * current_vote_count;
    auto confidence = idea.avg_confidence * current_vote_count;
    auto ease = idea.avg_ease * current_vote_count;

    idea.total_votes = (current_vote_count + 1);
    idea.avg_impact = (impact + vote.impact) / (double) (current_vote_count + 1);
    idea.avg_confidence = (confidence + vote.confidence) / (double) (current_vote_count + 1);
    idea.avg_ease = (ease + vote.ease) / (double) (current_vote_count + 1);
    idea.score = (idea.avg_impact * idea.avg_confidence * idea.avg_ease);
  });
}

/**
 * Reset all
 */
void ice::reset(const uint64_t any) {
  print("reseting ice tables\n");
  require_active_auth(_self);
    
  table_clear(pools);
  table_clear(ideas);
  table_clear(votes);
}
