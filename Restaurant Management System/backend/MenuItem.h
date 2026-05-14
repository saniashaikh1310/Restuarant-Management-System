#pragma once
#include <string>
#include <vector>

class MenuItem {
    std::string id;
    std::string name;
    std::string category;
    double price{0};
    bool vegetarian{true};

public:
    MenuItem() = default;
    MenuItem(std::string id, std::string name, std::string category, double price, bool vegetarian);

    const std::string &getId() const { return id; }
    const std::string &getName() const { return name; }
    const std::string &getCategory() const { return category; }
    double getPrice() const { return price; }
    bool isVegetarian() const { return vegetarian; }

    std::string toLine() const;
    static MenuItem fromLine(const std::string &line);
};

class MenuCatalog {
    std::vector<MenuItem> items;

public:
    void addItem(const MenuItem &m);
    bool removeById(const std::string &id);
    const std::vector<MenuItem> &all() const { return items; }

    void loadFromFile(const std::string &path);
    void saveToFile(const std::string &path) const;
};
