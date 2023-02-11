const tutorials = require('../controllers').tutorial;
var router = require('express').Router();
// Create a new Tutorial
router.post('/api/tutorials', tutorials.create);

// Retrieve all Tutorials
router.get('/api/tutorials', tutorials.findAll);

// Retrieve all published Tutorials
router.get('/api/tutorials/published', tutorials.findAllPublished);

// Retrieve a single Tutorial with id
router.get('/api/tutorials/:id', tutorials.findOne);

// Update a Tutorial with id
router.put('/api/tutorials/:id', tutorials.update);

// Delete a Tutorial with id
router.delete('/api/tutorials/:id', tutorials.delete);

// Delete all Tutorials
router.delete('/api/tutorials/', tutorials.deleteAll);

module.exports = router;
