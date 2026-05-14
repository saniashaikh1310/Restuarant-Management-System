#include "Admin.h"

Admin::Admin(std::string id, std::string name, std::string email, std::string department)
    : User(std::move(id), std::move(name), std::move(email)), department(std::move(department)) {}
