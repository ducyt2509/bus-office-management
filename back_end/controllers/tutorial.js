const db = require('../models');
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

module.exports = {
  // Create and Save a new Tutorial
  create(req, res) {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({
        message: 'Content can not be empty!',
      });
      return;
    }

    // Create a Tutorial
    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ? req.body.published : false,
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating the Tutorial.',
        });
      });
  },

  // Retrieve all Tutorials from the database.
  findAll(req, res) {},

  // Find a single Tutorial with an id
  findOne(req, res) {},

  // Update a Tutorial by the id in the request
  update(req, res) {},

  // Delete a Tutorial with the specified id in the request
  delete(req, res) {},

  // Delete all Tutorials from the database.
  deleteAll(req, res) {},

  // Find all published Tutorials
  findAllPublished(req, res) {},
};
