#include "Billing.h"
#include <algorithm>
#include <cctype>

double BillingService::deliveryFee(double subtotal) const {
    if (subtotal <= 0) return 0;
    return subtotal >= 499 ? 0 : 49;
}

BillingService::BillResult BillingService::buildBill(const Order &order, const PaymentMethod *method,
                                                       const std::string &coupon) const {
    BillResult r;
    r.subtotal = order.subtotal();
    r.delivery = deliveryFee(r.subtotal);
    r.discount = 0;
    std::string c = coupon;
    for (auto &ch : c)
        ch = static_cast<char>(::toupper(static_cast<unsigned char>(ch)));
    if (c == "NEXUS20") r.discount = r.subtotal * 0.20;
    if (c == "FIRST50") r.discount = std::min(50.0, r.subtotal);

    if (method) {
        r.methodName = method->name();
        r.fee = method->platformFee(r.subtotal);
    } else {
        r.methodName = "UNKNOWN";
        r.fee = 0;
    }

    r.total = r.subtotal + r.delivery + r.fee - r.discount;
    if (r.total < 0) r.total = 0;
    return r;
}
