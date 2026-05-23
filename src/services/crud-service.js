class CrudService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    try {
      const response = await this.repository.create(data);
      return response;
    } catch (error) {
      console.error("Service error [create]:", error.message, error.stack);
      throw { error };
    }
  }

  async destroy(id) {
    try {
      const response = await this.repository.destroy(id);
      return response;
    } catch (error) {
      console.error("Service error [destroy]:", error.message, error.stack);
      throw { error };
    }
  }

  // BUG FIX: was calling this.repository.destroy(id) instead of get(id)
  async get(id) {
    try {
      const response = await this.repository.get(id);
      return response;
    } catch (error) {
      console.error("Service error [get]:", error.message, error.stack);
      throw { error };
    }
  }

  async getAll() {
    try {
      const response = await this.repository.getAll();
      return response;
    } catch (error) {
      console.error("Service error [getAll]:", error.message, error.stack);
      throw { error };
    }
  }

  async update(id, data) {
    try {
      const response = await this.repository.update(id, data);
      return response;
    } catch (error) {
      console.error("Service error [update]:", error.message, error.stack);
      throw { error };
    }
  }
}

module.exports = CrudService;
