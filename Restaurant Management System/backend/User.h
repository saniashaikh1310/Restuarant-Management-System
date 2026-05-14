#pragma once
#include <fstream>
#include <iostream>
#include <string>

/**
 * Abstract user (encapsulation + polymorphism via role()).
 */
class User {
protected:
    std::string id;
    std::string name;
    std::string email;

public:
    User(std::string id, std::string name, std::string email);
    virtual ~User() = default;

    virtual std::string role() const = 0;

    const std::string &getId() const { return id; }
    const std::string &getName() const { return name; }
    const std::string &getEmail() const { return email; }

    void setName(const std::string &n) { name = n; }

    virtual void describe(std::ostream &out) const;
    virtual void save(std::ostream &out) const;
};
