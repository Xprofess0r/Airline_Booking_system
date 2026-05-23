class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      return result;
    } catch (error) {
      console.error("Repository error [create]:", error.message, error.stack);
      throw { error };
    }
  }
  async destroy(modelId) {
    try {
      const result = await this.model.destroy({
        where: {
          id: modelId,
        },
      });
      return true;
    } catch (error) {
      console.error("Repository error [destroy]:", error.message, error.stack);
      throw { error };
    }
  }
  async get(modelId) {
    try {
      const result = await this.model.findByPk(modelId);
      return result;
    } catch (error) {
      console.error("Repository error [get]:", error.message, error.stack);
      throw { error };
    }
  }
  async update(modelId, data) {
    try {
      const result = await this.model.update(data, {
        where: {
          id: modelId,
        },
      });
      return result;
    } catch (error) {
      console.error("Repository error [update]:", error.message, error.stack);
      throw { error };
    }
  }
  async getAll() {
    try {
      const results = await this.model.findAll();
      return results;
    } catch (error) {
      console.error("Repository error [getAll]:", error.message, error.stack);
      throw { error };
    }
  }
}

module.exports = CrudRepository;
