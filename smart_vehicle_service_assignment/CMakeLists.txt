cmake_minimum_required(VERSION 3.15)
project(AutoCare360 VERSION 2.5.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

file(GLOB SOURCES "src/*.cpp")
file(GLOB HEADERS "include/*.h")

add_executable(AutoCare360 ${SOURCES} ${HEADERS})

if (WIN32)
    target_link_libraries(AutoCare360 PRIVATE gdi32 user32 comctl32)
endif()

# Set output directory to bin/
set_target_properties(AutoCare360 PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)
