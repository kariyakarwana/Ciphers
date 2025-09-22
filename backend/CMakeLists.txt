cmake_minimum_required(VERSION 3.10)
project(CipherServer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add your source
add_executable(server main.cpp)

# Include current directory for headers (httplib.h and json.hpp)
target_include_directories(server PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
