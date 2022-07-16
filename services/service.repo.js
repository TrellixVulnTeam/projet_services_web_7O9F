const GenreRepository = require("../repositories/genre.repository");
const db = require("../database");
const FilmRepository = require("../repositories/film.repository");
const ActorRepository = require("../repositories/actor.repository");

exports.checkGenreRepo = async (req, res, id) => {
  const genreRepo = new GenreRepository(db);
  const result = await genreRepo.get(id);

  return result;
};

exports.checkActorsRepo = async (req, res, id) => {
  const actorRepo = new ActorRepository(db);
  const result = await actorRepo.get(id);

  return result;
};

exports.checkMultipleActorsRepo = async (req, res, id) => {
  const actorRepo = new ActorRepository(db);
  var result = [];
  id.map((id) => {
    result.push(actorRepo.get(id));
  });

  return Promise.all(result).then(function (results) {
    return results;
  });
};

exports.checkFilmRepo = async (req, res, id) => {
  const filmRepo = new FilmRepository(db);
  const result = await filmRepo.get(id);

  return result;
};

exports.checkGenreUsedInFilm = async (id, res) => {
  const repo = new FilmRepository(db);
  const result = await repo.all();

  return result;
};
