#include "Reservation.h"
#include <fstream>
#include <iostream>

TableReservation::TableReservation(std::string id, std::string name, std::string phone, std::string date,
                                   std::string time, int guests)
    : id(std::move(id)), name(std::move(name)), phone(std::move(phone)), date(std::move(date)), time(std::move(time)),
      guests(guests) {}

std::string TableReservation::toLine() const {
    return id + "|" + name + "|" + phone + "|" + date + "|" + time + "|" + std::to_string(guests);
}

void TableReservation::print(std::ostream &out) const {
    out << "Reservation " << id << " · " << name << " (" << phone << ") on " << date << " @ " << time << " for "
        << guests << " guests\n";
}

void TableReservation::appendFile(const std::string &path, const TableReservation &r) {
    std::ofstream out(path, std::ios::app);
    out << r.toLine() << "\n";
}
