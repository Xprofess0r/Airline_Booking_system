const { Flights } = require("../models/index");
const { Op } = require("sequelize");

class FlightRepository {
  // BUG FIX: filter key was 'arrivalAirportId' but DB column is 'arrivalAirtportId' (typo kept consistent with schema)
  #createFilter(data) {
    let filter = {};
    if (data.arrivalAirtportId) {
      filter.arrivalAirtportId = data.arrivalAirtportId;
    }
    if (data.departureAirportId) {
      filter.departureAirportId = data.departureAirportId;
    }
    if (data.minPrice && data.maxPrice) {
      Object.assign(filter, {
        [Op.and]: [
          { price: { [Op.lte]: data.maxPrice } },
          { price: { [Op.gte]: data.minPrice } },
        ],
      });
    }
    return filter;
  }

  async createFlight(data) {
    try {
      const flight = await Flights.create(data);
      return flight;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }

  async getFlight(flightId) {
    try {
      const flight = await Flights.findByPk(flightId);
      return flight;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }

  async getAllFlights(filter) {
    try {
      const filterObject = this.#createFilter(filter);
      const flights = await Flights.findAll({
        where: filterObject,
      });
      return flights;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }

  async updateFlight(flightId, data) {
    try {
      await Flights.update(data, {
        where: {
          id: flightId,
        },
      });
      // Return updated flight so caller gets fresh data
      const updatedFlight = await Flights.findByPk(flightId);
      return updatedFlight;
    } catch (error) {
      console.log("Something went wrong in repository layer");
      throw { error };
    }
  }
}

module.exports = FlightRepository;
