const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const playersController = require('../controllers/players-controller');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

router.get('/', playersController.getAllPlayers);

router.get('/player/:pid', playersController.getPlayerById);

router.use(checkAuth); // protecting the next routes. only requests with token will proceed

router.post(
  '/new',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('country').not().isEmpty(),
    check('age').not().isEmpty(),
    check('points').not().isEmpty(),
    check('height').not().isEmpty(),
    check('weight').not().isEmpty(),
  ],
  playersController.createPlayer
);

router.patch(
  '/update/:pid',
  [
    check('age').not().isEmpty(),
    check('points').not().isEmpty(),
    check('height').not().isEmpty(),
    check('weight').not().isEmpty(),
  ],
  playersController.updatePlayer
);

router.delete('/delete/:pid', playersController.deletePlayer);

module.exports = router;
