const passport = require("passport");
const userService = require("../dao/models/user.model.js");
const Carts = require("../dao/models/cartsModel.model.js");
const GitHubStrategy = require("passport-github2");
const local = require("passport-local");
const { createHash, isValid } = require("../utils.js");
const env = require('./env')

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { email, age, first_name, last_name } = req.body;
          let user = await userService.findOne({ email });

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
        try {
          console.log(profile);

          // Extrair username do perfil
          const username =
            profile.username || profile.displayName || "defaultUsername";

          // Verificar se o usuário já existe pelo username
          let user = await userService.findOne({ username: username });

          if (!user) {
            // Criar novo usuário
            let newUser = {
              first_name: profile.displayName || "User",
              last_name: "last name",
              username: username,
              email: profile.emails
                ? profile.emails[0].value
                : "defaultEmail@example.com", // Definir um email padrão se não disponível
              password: "", // Melhor não definir senha para usuários OAuth
            };

            // Adicionar o novo usuário ao banco de dados
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
