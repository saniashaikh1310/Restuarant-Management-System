#include "MenuItem.h"
#include <fstream>
#include <sstream>

MenuItem::MenuItem(std::string id, std::string name, std::string category, double price, bool vegetarian)
    : id(std::move(id)), name(std::move(name)), category(std::move(category)), price(price), vegetarian(vegetarian) {}

std::string MenuItem::toLine() const {
    return id + ";" + name + ";" + category + ";" + std::to_string(price) + ";" + (vegetarian ? "1" : "0");
}

MenuItem MenuItem::fromLine(const std::string &line) {
    std::stringstream ss(line);
    std::string id, name, category, priceStr, vegStr;
    std::getline(ss, id, ';');
    std::getline(ss, name, ';');
    std::getline(ss, category, ';');
    std::getline(ss, priceStr, ';');
    std::getline(ss, vegStr, ';');
    double price = std::stod(priceStr);
    bool veg = vegStr == "1";
    return MenuItem(id, name, category, price, veg);
}

void MenuCatalog::addItem(const MenuItem &m) {
    items.push_back(m);
}

bool MenuCatalog::removeById(const std::string &id) {
    for (auto it = items.begin(); it != items.end(); ++it) {
        if (it->getId() == id) {
            items.erase(it);
            return true;
        }
    }
    return false;
}

void MenuCatalog::loadFromFile(const std::string &path) {
    items.clear();
    std::ifstream in(path);
    if (!in) return;
    std::string line;
    while (std::getline(in, line)) {
        if (line.empty()) continue;
        items.push_back(MenuItem::fromLine(line));
    }
}

void MenuCatalog::saveToFile(const std::string &path) const {
    std::ofstream out(path, std::ios::trunc);
    for (const auto &m : items) {
        out << m.toLine() << "\n";
    }
}
