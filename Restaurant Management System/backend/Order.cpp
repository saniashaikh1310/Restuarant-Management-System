#include "Order.h"
#include <fstream>

Order::Order(std::string orderId, std::string customerId)
    : orderId(std::move(orderId)), customerId(std::move(customerId)) {}

void Order::addLine(const OrderLine &line) {
    lines.push_back(line);
}

double Order::subtotal() const {
    double s = 0;
    for (const auto &l : lines) {
        s += l.unitPrice * l.qty;
    }
    return s;
}

void Order::appendToFile(const std::string &path) const {
    std::ofstream out(path, std::ios::app);
    out << orderId << "|" << customerId << "|" << subtotal() << "|lines:";
    for (const auto &l : lines) {
        out << l.itemId << "x" << l.qty << "@";
    }
    out << "\n";
}
