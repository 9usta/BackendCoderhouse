import userModel from "../models/users.model.js";

export default class UserManager {
  addUser = async (user) => {
    let result = userModel.create(user);
    return result;
  };

  findUser = async (search) => {
    let result = userModel.findOne(search);
    return result;
  };
}
