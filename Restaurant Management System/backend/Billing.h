#pragma once
#include "Order.h"
#include "PaymentMethod.h"
#include <memory>
#include <string>

/**
 * Billing aggregates an Order + polymorphic PaymentMethod (strategy pattern).
 */
class BillingService {
    double deliveryFee(double subtotal) const;

public:
    struct BillResult {
        double subtotal{0};
        double delivery{0};
        double discount{0};
        double fee{0};
        double total{0};
        std::string methodName;
    };

    BillResult buildBill(const Order &order, const PaymentMethod *method, const std::string &coupon) const;
};
