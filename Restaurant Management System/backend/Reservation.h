#pragma once
#include <string>

class TableReservation {
    std::string id;
    std::string name;
    std::string phone;
    std::string date;
    std::string time;
    int guests{2};

public:
    TableReservation(std::string id, std::string name, std::string phone, std::string date, std::string time,
                     int guests);

    std::string toLine() const;
    void print(std::ostream &out) const;

    static void appendFile(const std::string &path, const TableReservation &r);
};
