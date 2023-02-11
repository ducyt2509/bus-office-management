const express = require('express');
const cors = require('cors');
require('dotenv').config();
const combineRoute = require('./routes');

const app = express();

var corsOptions = {
  origin: 'http://localhost:5001',
};

app.use(cors(corsOptions));

const db = require('./models');
db.sequelize
  .sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message);
  });

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.');
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
