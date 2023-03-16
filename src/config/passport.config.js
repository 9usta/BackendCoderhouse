import userModel from "../dao/models/users.model.js";
import userService from "passport-github2";
import passport from "passport";
import local from "passport-local";
import UserManager from "../dao/mongoManagers/UserManager.js";
import CartManager from "../dao/mongoManagers/CartManager.js";

import { createHash, isValidPassword } from "../utils.js";

import jwt from "passport-jwt";

const userManager = new UserManager();
const cartManager = new CartManager();

const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const localStrategy = local.Strategy;
const initPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.findUser({ _id: id });
    done(null, user);
  });

  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, something, username, done) => {
        const { first_name, last_name, age, email, password } = req.body;
        try {
          let user = await userManager.findUser({ email: email });
          console.log(user);
          if (user != null) {
            console.log("El usuario ya existe");
            return done(null, false, {
              status: "Error",
              message: "El usuario ya existe",
            });
          }

          let cartObj = await cartManager.createCart();
          console.log(cartObj);

          let cart = cartObj._id;

          const result = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart,
          };

          let newUser = await userManager.addUser(result);

          return done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, pass, done) => {
        const { email, password } = req.body;
        try {
          const user = await userManager.findUser({ email });
          if (!user) {
            console.log("El usuario no existe");
            return done(null, false, {
              status: "Error",
              message: "El usuario no existe",
            });
          }

          if (!isValidPassword(user, password))
            return done(null, false, {
              status: "Error",
              message: "La contraseña no es válida",
            });

          return done(null, user);
        } catch (error) {
          return done("Error al obtener el ususario" + error);
        }
      }
    )
  );

  passport.use(
    "github",
    new userService(
      {
        clientID: "Iv1.e0475972aeec6f20",
        clientSecret: "3299d1d4da7994396a6d98660414ce82c2ab33ef",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let cartObj = await cartManager.createCart();
            console.log(cartObj);

            let cart = cartObj._id;

            const result = {
              first_name: profile._json.name,
              last_name: profile._json.name,
              email: profile._json.email,
              age: 0,
              password: " ",
              cart,
            };
            let newUser = await userManager.addUser(result);
            return done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["coderCookieToken"];
    }
    return token;
  };
  
passport.use(
  'jwt',
  new jwtStrategy(
    {
      jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: "coderSecret",
    },
    async (jwt_payload, done) => {
      try {
        console.log(jwt_payload);
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    }
  )
);



export default initPassport;
