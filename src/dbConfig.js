import mongoose from 'mongoose'

const URI_MONGO =
  'mongodb+srv://Gustavo:GustavoGustavo@cluster0.5voxicw.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(URI_MONGO, (error) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Conectado a la base de datos')
  }
})