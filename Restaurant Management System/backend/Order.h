#pragma once
#include "MenuItem.h"
#include <string>
#include <vector>

struct OrderLine {
    std::string itemId;
    std::string name;
    int qty{1};
    double unitPrice{0};
};

class Order {
    std::string orderId;
    std::string customerId;
    std::vector<OrderLine> lines;

public:
    Order(std::string orderId, std::string customerId);

    void addLine(const OrderLine &line);
    double subtotal() const;

    const std::string &getOrderId() const { return orderId; }
    const std::string &getCustomerId() const { return customerId; }
    const std::vector<OrderLine> &getLines() const { return lines; }

    void appendToFile(const std::string &path) const;
};
