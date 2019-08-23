const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./api/utils/logger');
const productRouter = require('./api/recursos/productos/productos.routes');
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes');

const authJWT = require('./api/libs/auth');

const app = express();
const { port, dbUrl } = config

mongoose.connect(dbUrl, { useNewUrlParser: true });
mongoose.connection.on('error', (error) => {
  logger.error(error);
  logger.error('Fallo la conexion a mongodb');
  process.exit(1);
});


app.use(bodyParser.json()); // IMPORTANTE!!!
// stream: message => logger.info(message.trim())
app.use(morgan('short', { 
  stream: {
    write: message => logger.info(message.trim()),
  } 
}));
app.use(passport.initialize());

app.use('/usuarios', usuariosRouter);
app.use('/productos', productRouter);

passport.use(authJWT);


// passport.authenticate('jwt', { session: false });
app.get('/',(request, response) => {
  logger.error('Se hizo peticion al /');
  response.send('Hello World');
});
// Nayruth pide 3 pizzas :D*
app.listen(port, () => {
  console.log('Init server');
});


/*
passport.use(new BasicStrategy((username, password, done) => {
  if (username.valueOf() === 'luis' && password.valueOf() === 'krowdy123') {
    done(null, true);
  } else {
    done(null, false);
  }
}));
*/
