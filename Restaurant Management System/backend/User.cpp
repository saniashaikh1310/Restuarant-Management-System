#include "User.h"

User::User(std::string id, std::string name, std::string email)
    : id(std::move(id)), name(std::move(name)), email(std::move(email)) {}

void User::describe(std::ostream &out) const {
    out << "[" << role() << "] " << name << " <" << email << ">\n";
}

void User::save(std::ostream &out) const {
    out << role() << "|" << id << "|" << name << "|" << email << "\n";
}
