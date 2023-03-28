import ProductManager from "../dao/mongoManagers/ProductManager.js";

const productM = new ProductManager();

export const post = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  } = req.body;
  const product = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  const postResponse = await productM.post(product);

  return !postResponse.error
    ? res.status(201).send(postResponse)
    : res.status(postResponse.status).send(postResponse);
};

export const getAll = async (req, res) => {
  const {query, limit, page, sort} = req.query;
  const getResponse = await productM.getAll(query, limit, page, sort);

  return !getResponse.error
    ? res.status(200).json(getResponse)
    : res.status(getResponse.status).send(getResponse);
};

export const getById = async (req, res) => {
  const id = req.params.pid;
  const getResponse = await productM.getById(id);

  return !getResponse.error
    ? res.send(getResponse)
    : res.status(getResponse.status).send(getResponse);
};

export const putById = async (req, res) => {
  const id = req.params.pid;
  const object = req.body;
  const putResponse = await productM.putById(id, object);

  return !putResponse.error
    ? res.send(putResponse)
    : res.status(putResponse.status).send(putResponse);
};

export const deleteById = async (req, res) => {
  const id = req.params.pid;
  const deleteResponse = await productM.deleteById(id);

  return !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
};