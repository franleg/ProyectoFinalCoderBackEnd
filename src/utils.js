import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import multer from 'multer';
import nodemailer from 'nodemailer';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level:'info'
        }),
        new winston.transports.File({
            level:'warn',
            filename:'warn.log'
        }),
        new winston.transports.File({
            level:'error',
            filename:'error.log'
        })
    ]
})

const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
}
const isValidPassword = (user, data) => bcrypt.compare(data, user.password);

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/public/img")
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const uploader = multer({storage : storage});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:'legnazzifranco03@gmail.com',
        pass: 'yyzpnfzxqqfncecc'
    }
})

const messageHTML = (cart) => {
    let products = "";
    cart.products.forEach(prod => {
        products += `<div>
                        <hr/>
                        <p>Producto: ${prod.product.title}</p>
                        <p>Precio: $${prod.product.price}</p>
                        <p>Descripción: ${prod.product.description}</p>
                        <p>Cantidad: ${prod.quantity}</p>
                        <hr/>
                    </div>`
    }) 
    return products;
}

export { __dirname, logger, createHash, isValidPassword, uploader, transporter, messageHTML };