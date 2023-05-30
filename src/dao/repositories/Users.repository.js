export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async post(user) {
    return await this.dao.post(user);
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getBy(param) {
    return await this.dao.getBy(param);
  }

  async putBy(id, object) {
    return await this.dao.putBy(id, object);
  }

  async deleteById(id) {
    return await this.dao.deleteById(id);
  }
}
