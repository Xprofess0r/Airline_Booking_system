const { Airplane } = require("../models/index");

class AirplaneRepository {
  async getAirplane(id) {
    try {
      const airplane = await Airplane.findByPk(id);
      return airplane;
    } catch (error) {
      console.error("Repository error [getAirplane]:", error.message, error.stack);
      throw { error };
    }
  }
}

module.exports = AirplaneRepository;
