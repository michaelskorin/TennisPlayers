const { validationResult } = require('express-validator');
const fs = require('fs');

const HttpError = require('../models/http-error');
const Player = require('../models/player');

const getAllPlayers = async (req, res, next) => {
  let players;

  try {
    players = await Player.find({}).sort({ points: -1 });
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not find players',
      500
    );
    return next(err);
  }

  if (!players) {
    const err = new HttpError('Could not find players', 404);
    return next(err);
  }

  rankPlayers();

  res.json({
    players: players.map((player) => player.toObject({ getters: true })),
  });
};

const rankPlayers = async () => {
  try {
    const players = await Player.find({}).sort({ points: -1 });
    players.forEach((player, index) => {
      player.ranking = index + 1;
      player.save();
    });
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not rank the players',
      500
    );
    return next(err);
  }
};

const getPlayerById = async (req, res, next) => {
  let player;
  let playerId = req.params.pid;

  try {
    player = await Player.findById(playerId);
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not find the player',
      500
    );
    return next(err);
  }

  if (!player) {
    const err = new HttpError('Could not find the player', 404);
    return next(err);
  }

  rankPlayers();

  res.json({ player: player.toObject({ getters: true }) });
};

const createPlayer = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const err = new HttpError(
      'Invalid inputs passed, please check your data',
      422
    );
    return next(err);
  }

  const {
    name,
    country,
    age,
    grand_slams,
    points,
    height,
    weight,
    image,
  } = req.body;

  const createdPlayer = new Player({
    name,
    country,
    age,
    grand_slams,
    points,
    height,
    weight,
    image: req.file.path,
  });

  try {
    await createdPlayer.save();
  } catch (error) {
    const err = new HttpError(
      'Creating a player failed, please try again.',
      500
    );
    return next(err);
  }

  res.status(201).json({ player: createdPlayer.toObject({ getters: true }) });
};

const updatePlayer = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const err = new HttpError(
      'Invalid inputs passed, please check your data',
      422
    );
    return next(err);
  }

  const playerId = req.params.pid;
  const { age, points, height, weight, grand_slams } = req.body;

  let foundPlayer;

  try {
    foundPlayer = await Player.findById(playerId);
  } catch (error) {
    const err = new HttpError(
      'Updating a player failed, please try again.',
      500
    );
    return next(err);
  }

  if (!foundPlayer) {
    const err = new HttpError(
      'Could not find the player to update, please try again.',
      404
    );
    return next(err);
  }

  foundPlayer.age = age;
  foundPlayer.points = points;
  foundPlayer.height = height;
  foundPlayer.weight = weight;
  foundPlayer.grand_slams = grand_slams;

  try {
    await foundPlayer.save();
  } catch (error) {
    const err = new HttpError(
      'Updating the player failed, please try again.',
      500
    );
    return next(err);
  }

  res.status(200).json({ player: foundPlayer.toObject({ getters: true }) });
};

const deletePlayer = async (req, res, next) => {
  const playerId = req.params.pid;
  let player;

  try {
    player = await Player.findById(playerId);
  } catch (error) {
    const err = new HttpError(
      'Deleting the player failed, please try again.',
      500
    );
    return next(err);
  }

  if (!player) {
    const err = new HttpError(
      'Could not find the player to delete, please try again.',
      404
    );
    return next(err);
  }

  let imagePath = player.image;

  try {
    await player.remove();
  } catch (error) {
    const err = new HttpError(
      'Deleting the player failed, please try again.',
      500
    );
    return next(err);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Player deleted successfully.' });
};

exports.getAllPlayers = getAllPlayers;
exports.createPlayer = createPlayer;
exports.getPlayerById = getPlayerById;
exports.updatePlayer = updatePlayer;
exports.deletePlayer = deletePlayer;
