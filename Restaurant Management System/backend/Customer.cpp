#include "Customer.h"

Customer::Customer(std::string id, std::string name, std::string email, int points)
    : User(std::move(id), std::move(name), std::move(email)), loyaltyPoints(points) {}

void Customer::addPoints(int p) {
    if (p > 0) loyaltyPoints += p;
}

void Customer::describe(std::ostream &out) const {
    User::describe(out);
    out << "  loyalty: " << loyaltyPoints << "\n";
}
