const { City } = require("../models/index");
const { Op } = require("sequelize");
class CityRepository {
  async createCity({ name }) {
    try {
      const city = await City.create({ name });
      return city;
    } catch (error) {
      console.error("Repository error [createCity]:", error.message, error.stack);
      throw { error };
    }
  }

  async deleteCity(cityId) {
    try {
      await City.destroy({
        where: {
          id: cityId,
        },
      });
    } catch (error) {
      console.error("Repository error [deleteCity]:", error.message, error.stack);
      throw { error };
    }
  }

  async getCity(cityId) {
    try {
      console.log(cityId);
      const city = await City.findByPk(cityId);
      return city;
    } catch (error) {
      console.error("Repository error [getCity]:", error.message, error.stack);
      throw { error };
    }
  }

  async updateCity(cityId, data) {
    try {
      const city = await City.findByPk(cityId);
      city.name = data.name;
      await city.save();
      return city;
    } catch (error) {
      console.error("Repository error [updateCity]:", error.message, error.stack);
      throw { error };
    }
  }
  async getAllCities(filter) {
    try {
      if (filter.name) {
        const cities = await City.findAll({
          where: {
            name: {
              [Op.startsWith]: filter.name,
            },
          },
        });
        return cities;
      }
      const cities = await City.findAll();
      return cities;
    } catch (error) {
      console.error("Repository error [getAllCities]:", error.message, error.stack);
      throw { error };
    }
  }
}

module.exports = CityRepository;
