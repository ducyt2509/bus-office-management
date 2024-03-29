const express = require('express');
const cors = require('cors');
require('dotenv').config();
const combineRoute = require('./routes');
const cookieParser = require('cookie-parser');
// const permission = require('./middleware/permission.middleware');

const app = express();

const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_END_PORT}`,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// app.use(permission.checkRole);

const db = require('./models');
db.sequelize
  .sync()
  .then(() => {
    // comment line 27 when testing
  })
  .catch((err) => {
    // comment line 30 when testing
  });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to bus official;.' });
});
// require('./routes/tutorial')(app);
combineRoute.forEach((item) => {
  app.use(item);
});
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Entry at "http://localhost:${PORT}"`);
});

module.exports = app;
