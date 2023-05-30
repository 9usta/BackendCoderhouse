import {UsersService} from "../dao/repositories/index.js";
import CustomError from "../errors/CustomError.js";
import {enumErrors} from "../errors/enumErrors.js";
import {createHash} from "../utils.js";

export const post = async (req, res, next) => {
  try {
    const {firstName, lastName, email, password} = req.body;
    if (!email || !password || !firstName || !lastName)
      CustomError.create({
        name: "Error when trying post a user",
        message: "complete the inputs to register the user correctly",
        cause: "Incomplete required inputs",
        code: enumErrors.MISSING_VALUES,
        statusCode: 400,
      });
    const user = {
      firstName,
      lastName,
      email,
      password: createHash(password),
      cartId: undefined,
      role: "user",
    };

    const postResponse = await UsersService.post(user);
    if (postResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(postResponse);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getResponse = await UsersService.getAll();
    if (getResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(getResponse);
  } catch (error) {
    next(error);
  }
};

export const getBy = async (req, res, next) => {
  try {
    const {email, id} = req.query;
    if (!email && !id)
      CustomError.create({
        name: "Error when trying to get a filtered user",
        message:
          "It is necessary to define the value of Email or Id to be able to filter a user correctly",
        cause: "Email or id undefined",
        code: enumErrors.INVALID_FILTER,
        statusCode: 400,
      });
    const param = email ? {email: email} : {id: id};
    const getResponse = await UsersService.getBy(param);
    if (getResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(getResponse);
  } catch (error) {
    next(error);
  }
};

export const putBy = async (req, res, next) => {
  try {
    if (!req.query.email && !req.query.id)
      CustomError.create({
        name: "Error when trying to get a filtered user",
        message:
          "It is necessary to define the value of Email or Id to be able to filter a user correctly",
        cause: "Email or id undefined",
        code: enumErrors.INVALID_FILTER,
        statusCode: 400,
      });
    const param = req.query.email
      ? {email: req.query.email}
      : {id: req.query.id};
    const {firstName, lastName, email, password, cartId, role} = req.body;
    if (!firstName && !lastName && !email && !password && !cartId && !role)
      CustomError.create({
        name: "Missing values",
        message: "None of the expected fields were entered",
        cause: "Wrong user field",
        code: enumErrors.MISSING_VALUES,
        statusCode: 400,
      });
    const object = {firstName, lastName, email, password, cartId, role};
    const putResponse = await UsersService.putBy(param, object);
    if (putResponse.error)
      CustomError.create({code: enumErrors.ERROR_FROM_SERVER});

    return res.send(putResponse);
  } catch (error) {
    next(error);
  }
};

export const putPremiumRole = async (req, res, next) => {
  try {
    if (!req.query.email && !req.query.id)
      CustomError.create({
        name: "Error when trying to get a filtered user",
        message:
          "It is necessary to define the value of Email or Id to be able to filter a user correctly",
        cause: "Email or id undefined",
        code: enumErrors.INVALID_FILTER,
        statusCode: 400,
      });

    const param = req.query.email
      ? {email: req.query.email}
      : {_id: req.query.id};

    const putResponse = await UsersService.putPremiumRole(param);

    if (putResponse.error) CustomError.create({...putResponse});

    return res.send(putResponse);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteBy = async (req, res, next) => {
  try {
    if (!req.query.email && !req.query.id)
      CustomError.create({
        name: "Error when trying to get a filtered user",
        message:
          "It is necessary to define the value of Email or Id to be able to filter a user correctly",
        cause: "Email or id undefined",
        code: enumErrors.INVALID_FILTER,
        statusCode: 400,
      });
    const param = req.query.email
      ? {email: req.query.email}
      : {id: req.query.id};
    const deleteResponse = await UsersService.deleteBy(param);
    if (deleteResponse.error) CustomError.create(enumErrors.ERROR_FROM_SERVER);

    return res.send(deleteResponse);
  } catch (error) {
    next(error);
  }
};