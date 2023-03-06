import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import userService from "passport-github2";

const localStrategy = local.Strategy;
const initPassport = () => {
    passport.use(
        'register',
        new localStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userModel.findOne({ email: username });
                    if (user) {
                        console.log("Usuario ya existe");
                        return done(null, false)
                    }

                    const result = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        rol: "usuario"
                    }

                    let newUser = await userModel.create(result);
                    return done(null, newUser);

                }
                catch (error) {
                    return done("Error al obtener el ususario" + error)
                }
            }
        ))


    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    console.log("Usuario no existe");
                    return done(null, false)
                }
                if (!isValidPassword(user, password)) return done(null, false);

                return done(null, user)
            }
            catch (error) {
                return done("Error al obtener el ususario" + error)
            }

        }
    ))

    passport.use('github', new userService({
        clientID: "Iv1.e0475972aeec6f20",
        clientSecret: "3299d1d4da7994396a6d98660414ce82c2ab33ef",
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    age: 30,
                    email: profile._json.email,
                    password: "",
                    rol: "usuario"
                }
                let result = await userModel.create(newUser);
                done(null, result)
            } else {
                done(null, user)
            }
        }
        catch (error) {
            return done(error)
        }
    }))

}


export default initPassport;