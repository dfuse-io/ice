cmake_minimum_required(VERSION 3.12)
project(ice VERSION 1.0.0)

find_package(eosio.cdt)
cmake_minimum_required(VERSION 3.5)

add_contract( ice ice main.cpp )
#target_include_directories(shine.wasm PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)