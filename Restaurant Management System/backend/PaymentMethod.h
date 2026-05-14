#pragma once
#include <string>

/**
 * Polymorphic payment strategies (runtime polymorphism).
 */
class PaymentMethod {
public:
    virtual ~PaymentMethod() = default;
    virtual std::string name() const = 0;
    /** Returns processing / platform fee for demo billing. */
    virtual double platformFee(double subtotal) const = 0;
};

class UPIPayment : public PaymentMethod {
public:
    std::string name() const override { return "UPI"; }
    double platformFee(double subtotal) const override { return subtotal * 0.005; }
};

class CardPayment : public PaymentMethod {
public:
    std::string name() const override { return "Card"; }
    double platformFee(double subtotal) const override { return subtotal * 0.018; }
};

class CashPayment : public PaymentMethod {
public:
    std::string name() const override { return "Cash"; }
    double platformFee(double /*subtotal*/) const override { return 0.0; }
};
