#include "ice.hpp"

void ice::addpool(const name author,const name name) {
    printf("%s is adding a pool: %s - %s", author.to_string().c_str(), name.to_string().c_str());
    require_active_auth(author);

    auto pool_itr = pools.find(name.value);
    check(pool_itr == pools.end(), "pool " + name.to_string() + "  already exists.");
    
    auto new_pool_ir = pools.emplace(_self, [&](auto& pool) {
        pool.pool_name = name;
        pool.author = author;
    });
}

void ice::addidea(const name author,const name pool_name , const string title, const string description) {
  printf("%s is adding idea %s to pool: %s", author.to_string().c_str(),  description.c_str(), pool_name.to_string().c_str());
  require_active_auth(author);
  
  auto pool_itr = pools.find(pool_name.value);
  check(pool_itr != pools.end(), "pool " + pool_name.to_string() + " does not exists.");
  
  auto trxid = gettranscationid();

  ideas_index poolideas(get_self(), pool_name.value);

  auto idea_itr = poolideas.emplace(_self, [&](auto& idea) {
    idea.id = trxid;
    idea.pool_name = pool_itr->pool_name;
    idea.author = author;
    idea.title = title;
    idea.description = description;
  });
}

void ice::castvote(const name voter, const name pool_name, const uint64_t idea_id, const uint32_t impact,const uint32_t confidence, const uint32_t ease) {
  printf("%s is voting for an idea : (I: %d x C: %d x E: %d)\n", voter.to_string().c_str(), impact, confidence, ease); 
  require_active_auth(voter);

  printf("looking for pool %s\n", pool_name.to_string().c_str());
  auto pool_itr = pools.find(pool_name.value);
  check(pool_itr != pools.end(), "pool " + pool_name.to_string() + " does not exists.");

  printf("looking for idea  %d in pool\n", idea_id);
  ideas_index poolideas(get_self(), pool_itr->pool_name.value);

  auto idea_itr = poolideas.find(idea_id);

  check(idea_itr != poolideas.end(), "idea does not exists. cannot vote for this idea");

  ice_vote new_vote;
  new_vote.impact = impact;
  new_vote.confidence = confidence;
  new_vote.ease = ease;

  check(new_vote.isValid(), "impact, confidence and ease must be at most 10");

  ice_vote old_vote;

  printf("creating or updating existing votes\n");
  auto updated = update_vote_for_voter(voter, idea_itr->id, old_vote, [&](auto& vote_itr){
    vote_itr.impact = new_vote.impact;
    vote_itr.confidence = new_vote.confidence;
    vote_itr.ease = new_vote.ease;
  });

  printf("updating idea\n");
  update_idea(pool_itr->pool_name,idea_itr->id, new_vote, old_vote, updated);
}

bool ice::update_vote_for_voter(const name voter, const uint64_t idea_id, ice_vote& old_vote, const function<void(vote_row&)> updater) {

  printf("find vote with scope:  %d  and voter %s\n",idea_id, voter.to_string().c_str());
  votes_index votervotes(get_self(), idea_id);
  
  auto vote_itr = votervotes.find(voter.value);
  if (vote_itr == votervotes.end()) {
    printf("creating vote\n");
    votervotes.emplace(_self, [&](auto& vote) {
      vote.voter = voter;
      vote.idea_id = idea_id;
      updater(vote);
    });
    return false;
  } else {
    printf("updating vote\n");
    votervotes.modify(vote_itr, _self, [&](auto& vote) { 
      old_vote.confidence = vote.confidence;
      old_vote.impact = vote.impact;
      old_vote.ease = vote.ease;
      updater(vote); 
    });
    return true;
  }
  
}

void ice::update_idea(const name pool_name, const uint64_t idea_id, const ice_vote& new_vote, const ice_vote old_vote, const bool updated) {

  ideas_index poolideas(get_self(), pool_name.value);

  auto idea_itr = poolideas.find(idea_id);

  check(idea_itr != poolideas.end(), "idea does not exists. cannot update it");

  poolideas.modify(idea_itr, _self, [&](auto& idea) { 
    auto current_vote_count = idea.total_votes;
    auto impact = idea.avg_impact * current_vote_count;
    auto confidence = idea.avg_confidence * current_vote_count;
    auto ease = idea.avg_ease * current_vote_count;

    if (!updated) {
      idea.total_votes = (current_vote_count + 1);
      idea.avg_impact = (impact + new_vote.impact) / idea.total_votes;
      idea.avg_confidence = (confidence + new_vote.confidence) / idea.total_votes;
      idea.avg_ease = (ease + new_vote.ease) / idea.total_votes;
    } else {
      idea.total_votes = current_vote_count;
      idea.avg_impact = (impact + new_vote.impact - old_vote.impact)  / idea.total_votes;
      idea.avg_confidence = (confidence + new_vote.confidence - old_vote.confidence) / idea.total_votes;
      idea.avg_ease = (ease + new_vote.ease - old_vote.ease) / idea.total_votes;
    }
    idea.score = (idea.avg_impact * idea.avg_confidence * idea.avg_ease);
  });
}


uint64_t ice::gettranscationid() {
  print("retrieveing transaction id\n");

  auto id = 1;
  auto stats_itr = stats.find(0);
  if (stats_itr == stats.end()) {
    print("creating a stats entry\n");
    stats.emplace(_self, [&](auto& stat) {
      stat.id = 0;
      stat.idea_count = 1;
    });
  } else {
    print("updating a stats entry\n");
    stats.modify(stats_itr, _self, [&](auto& stat) { 
      stat.idea_count += 1;
      id = stat.idea_count;
    });
  }
  return id;
}