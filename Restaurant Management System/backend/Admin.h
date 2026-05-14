#pragma once
#include "User.h"

class Admin : public User {
    std::string department;

public:
    Admin(std::string id, std::string name, std::string email, std::string department);

    std::string role() const override { return "ADMIN"; }

    const std::string &getDepartment() const { return department; }
};
