import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import { userService, cartService } from '../services/services.js';
import config from './config.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    // REGISTER STRATEGY
    passport.use('register', new LocalStrategy({passReqToCallback: true, usernameField: 'email', session: false}, async (req, email, password, done) => {
        try{
            const { first_name, last_name, age, adress, phone } = req.body;
            if (!first_name || !last_name || !age || !adress || !phone || !req.file || !email || !password) return done(null, false, {message: 'Valores incompletos'});
            let exists = await userService.getByEmail(email);
            if (exists) return done(null, false, {message: 'El usuario ya existe'});
            let cart = await cartService.save();
            const hashedPassword = await createHash(password);
            const newUser = {
                first_name,
                last_name,
                age,
                adress,
                phone,
                email,
                avatar: req.file.filename,
                password: hashedPassword,
                cart: cart._id,
            };
            let result = await userService.save(newUser);
            return done(null, result);
        } catch (error) {
            done(error);
        }
    }));

    // LOGIN STRATEGY
    passport.use('login', new LocalStrategy({usernameField: 'email', session: false}, async (email, password, done) => {
        try{
            if (!email || !password) return res.send({status: 'error', error: 'Valores incompletos'});
            if (email === config.admin.EMAIL && password !== config.admin.PWD) return done(null, false, {message: 'Contraseña incorrecta'});
            if (email === config.admin.EMAIL && password === config.admin.PWD) {
                let user = {
                    first_name: config.admin.NAME,
                    last_name: config.admin.LASTNAME,
                    role: 'admin',
                    _id: '0'
                }
                return done(null, user);
            }
            let user = await userService.getByEmail(email);
            if (!user) return done(null, false, {message: 'Usuario no encontrado'});
            const passwordValidation = await isValidPassword(user, password);
            if (!passwordValidation) return done(null, false, {message: 'Contraseña incorrecta'});
            return done(null, user);
        } catch (error) {
            done(error);
        }        
    }));

    // SERIALIZATION
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // DESERIALIZATION
    passport.deserializeUser(async (id, done) => {
        let result = await usersModel.findOne({_id: id});
        return done (null, result);
    })
};

export default initializePassport;