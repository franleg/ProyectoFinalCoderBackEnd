import express from 'express';
import cluster from 'cluster';
import { cpus } from 'os';
import handlebars from 'express-handlebars';
import { __dirname, logger } from './utils.js';
import { Server } from 'socket.io';
import config from './config/config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import flash from 'connect-flash';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/users.router.js';
import { ProductPresenterDTO } from './DTOs/ProductDTO.js';

const PORT = process.env.PORT || 8080;
const modoCluster = process.argv.slice(2)[0] == 'CLUSTER';

if (modoCluster && cluster.isPrimary) {
    const CPUs = cpus().length;

    logger.info(`Numero de procesadores: ${CPUs}`);
    logger.info(`PID MASTER ${process.pid}`);

    for (let i = 0; i < CPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    })
} else {
    const app = express();

    const server = app.listen(PORT, () => logger.info(`listening on ${PORT}`));

    const io = new Server(server);

    app.engine('handlebars', handlebars.engine());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'handlebars');

    app.use(express.json());
    app.use(express.static(__dirname + '/public'));

    app.use(session({
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${config.mongo.USER}:${config.mongo.PWD}@codercluster.skwuuph.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`,
            ttl: 90
        }),
        secret: config.session.SECRET,
        resave: false,
        saveUninitialized: false
    }))

    initializePassport();
    app.use(passport.initialize());

    app.use(flash());

    app.use('/api/sessions', sessionsRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/users', usersRouter);
    app.use('/', viewsRouter);

    io.on('connection', socket =>{
        logger.info("Cliente conectado en socket: " + socket.id);

        socket.on('client: get product', data => {
            let product = data;
            io.emit('server: product', product);
        })

        socket.on('client: get products by category', data => {
            let products = data;
            let productsByCategory = products.map(product => new ProductPresenterDTO(product))
            io.emit('server: products by category', productsByCategory);
        })

        socket.on('client: add product', data => {
            let newProduct = data;
            io.emit('server: new product', newProduct);
        })

        socket.on('client: delete product', data => {
            let products = data;
            io.emit('server: products', products);
        })

        socket.on('client: update product', data => {
            let productsUpdated = data;
            io.emit('server: productsUpdated', productsUpdated);
        })
    })
}

