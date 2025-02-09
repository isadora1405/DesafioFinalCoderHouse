const passport = require("passport");
const userService = require("../dao/models/user.model.js");
const Carts = require("../dao/models/cartsModel.model.js");
const GitHubStrategy = require("passport-github2");
const local = require("passport-local");
const { createHash, isValid } = require("../utils/utils.js");
const env = require("./env");

const { factory } = require("./../dao/factory.js");
const { userRepository } = factory();


const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        console.log("passou aqui 3")
        try {
          const { email, age, first_name, last_name } = req.body;
          let user = await userService.findOne({ email });
          console.log('user', user);
          console.log("email", email);

          if (user) {
            return done(null, false, { message: "Email já registrado" });
          }

          const hashedPassword = await createHash(password);
          user = new userService({
            email,
            password: hashedPassword,
            age,
            first_name,
            last_name,
          });

          let savedUser = await user.save();

          const newCart = new Carts();
          await newCart.save();

          savedUser.cartId = newCart._id;
          await savedUser.save();

          return done(null, savedUser);
        } catch (error) {
          console.log("Erro ao registrar o usuário: ", error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: env.GIT_CLIENT_ID,
        clientSecret: env.GIT_CLIENTSECRET,
        callbackURL: env.GIT_CALLLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("passou aqui 2")
        try {
          const username =
            profile.username || profile.displayName || "defaultUsername";

          let user = await userService.findOne({  user_name: username });
          
          if (!user) {
            let newUser = {
              first_name: profile.displayName || "User",
              last_name: "last name",
              user_name: username,
              email: username + '@github.com',
            /*  email: profile.emails
                ? profile.emails[0].value
                : "defaultEmail@example.com",*/
              password: "",
            };

            let result = await userService.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        console.log("passou aqui 1")
        try {
          const user = await userService.findOne({ email: username });
          if (!user) {
            console.log("O usuário não existe");
            return done(null, false);
          }
          if (!isValid(user, password)) {
            console.log("Senha inválida");
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
