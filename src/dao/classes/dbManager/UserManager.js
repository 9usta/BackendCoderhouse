import userModel from "../../models/users.model.js";
export default class UserManager {
  constructor() {}

  async post(user) {
    try {
      return await userModel.create(user);
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while creating the user",
      };
    }
  }

  async getAll() {
    try {
      if (query) query = JSON.parse(query);
      return await userModel.find().lean();
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the database, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getBy(param) {
    try {
      const user = await userModel.findOne(param).lean();
      return user;
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while obtaining the user`,
      };
    }
  }

  async put(id, object) {
    try {
      const productUpdated = await userModel.findByIdAndUpdate(id, object, {
        new: true,
      });
      return productUpdated === null
        ? {
            status: 404,
            error: `Product with id ${id} not found`,
          }
        : productUpdated;
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while updating the product with id ${id}`,
      };
    }
  }

  async deleteById(id) {
    try {
      const productDeleted = await userModel.findByIdAndDelete(id);
      return productDeleted === null
        ? {
            status: 404,
            error: `Product with id ${id} not found`,
          }
        : { status: 200, message: `Product with ${id} deleted succesfully` };
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while updating the product with id ${id}`,
      };
    }
  }

  async editLastConnection(user, lastConnection) {
    try {
      user.last_connection = lastConnection;
      let result = await userModel.updateOne({ email: user.email }, user);

      return result;
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while updating the conection`,
      };
    }
  }
}
