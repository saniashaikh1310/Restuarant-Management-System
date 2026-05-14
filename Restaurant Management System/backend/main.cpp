#include "Admin.h"
#include "Billing.h"
#include "Customer.h"
#include "MenuItem.h"
#include "Order.h"
#include "PaymentMethod.h"
#include "Reservation.h"
#include "User.h"
#include <ctime>
#include <fstream>
#include <iostream>
#include <limits>
#include <memory>
#include <vector>

static void seedIfMissing(const std::string &path) {
    std::ifstream check(path);
    if (check.good()) return;
    std::ofstream out(path);
    out << "m1;Truffle Fire Pizza;pizza;499;0\n";
    out << "m2;Smoky BBQ Burger;burger;329;0\n";
    out << "m3;Garden Harvest Bowl;healthy;289;1\n";
}

static int readInt(const std::string &prompt) {
    std::cout << prompt;
    int v;
    std::cin >> v;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return v;
}

static std::string readLine(const std::string &prompt) {
    std::cout << prompt;
    std::string s;
    std::getline(std::cin, s);
    return s;
}

int main() {
    const std::string dataDir = "data/";
    const std::string menuFile = dataDir + "menu.txt";
    const std::string orderFile = dataDir + "orders.log";
    const std::string resFile = dataDir + "reservations.log";
    const std::string userFile = dataDir + "users.txt";

    seedIfMissing(menuFile);

    MenuCatalog menu;
    menu.loadFromFile(menuFile);

    // Runtime polymorphism demo: treat users uniformly.
    std::vector<std::unique_ptr<User>> users;
    users.push_back(std::make_unique<Customer>("c1", "Ayaan Khan", "ayaan@mail.com", 120));
    users.push_back(std::make_unique<Admin>("a1", "Ops Lead", "ops@nexusbite.com", "Kitchen"));

    std::cout << "\n=== Nexus Bite — C++ Domain Console ===\n";
    std::cout << "Demonstrates encapsulation, inheritance, polymorphism, file I/O.\n\n";

    std::cout << "-- Users (virtual describe) --\n";
    for (const auto &u : users) {
        u->describe(std::cout);
    }

    std::cout << "\n-- Menu (loaded from file) --\n";
    for (const auto &m : menu.all()) {
        std::cout << m.getId() << " · " << m.getName() << " [" << m.getCategory() << "] ₹" << m.getPrice()
                  << (m.isVegetarian() ? " veg" : " non-veg") << "\n";
    }

    Order demo("NX-DEMO-1", "c1");
    if (!menu.all().empty()) {
        const auto &mi = menu.all().front();
        demo.addLine(OrderLine{mi.getId(), mi.getName(), 2, mi.getPrice()});
    }

    UPIPayment upi;
    CardPayment card;
    CashPayment cash;
    const PaymentMethod *method = &upi;

    BillingService billing;
    auto bill = billing.buildBill(demo, method, "NEXUS20");
    std::cout << "\n-- Billing (polymorphic fee) --\n";
    std::cout << "Method: " << bill.methodName << "\nSubtotal: " << bill.subtotal << "\nDelivery: " << bill.delivery
              << "\nDiscount: " << bill.discount << "\nPlatform fee: " << bill.fee << "\nTotal: " << bill.total << "\n";

    demo.appendToFile(orderFile);
    std::cout << "\nOrder appended to " << orderFile << "\n";

    TableReservation res("R-" + std::to_string(std::time(nullptr)), "Walk-in Guest", "9000000000", "2026-05-20", "19:30",
                         4);
    TableReservation::appendFile(resFile, res);
    res.print(std::cout);
    std::cout << "Saved to " << resFile << "\n";

    // Persist polymorphic users to text (simple serialization)
    {
        std::ofstream out(userFile, std::ios::trunc);
        for (const auto &u : users) {
            u->save(out);
        }
        std::cout << "Users saved to " << userFile << "\n";
    }

    std::cout << "\nMenu actions: (1) add item (2) delete by id (0) exit\n";
    int choice = readInt("Choice: ");
    if (choice == 1) {
        std::string id = readLine("Id: ");
        std::string name = readLine("Name: ");
        std::string cat = readLine("Category: ");
        double price = readInt("Price (int for demo): ");
        int veg = readInt("Vegetarian? 1=yes 0=no: ");
        menu.addItem(MenuItem(id, name, cat, price, veg == 1));
        menu.saveToFile(menuFile);
        std::cout << "Menu saved.\n";
    } else if (choice == 2) {
        std::string id = readLine("Id to delete: ");
        if (menu.removeById(id)) {
            menu.saveToFile(menuFile);
            std::cout << "Removed.\n";
        } else {
            std::cout << "Id not found.\n";
        }
    }

    std::cout << "\nDone. Pair this module with the web UI for full-stack story.\n";
    return 0;
}
