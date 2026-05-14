#pragma once
#include "User.h"

class Customer : public User {
    int loyaltyPoints{0};

public:
    Customer(std::string id, std::string name, std::string email, int points = 0);

    std::string role() const override { return "CUSTOMER"; }

    int getLoyaltyPoints() const { return loyaltyPoints; }
    void addPoints(int p);

    void describe(std::ostream &out) const override;
};
