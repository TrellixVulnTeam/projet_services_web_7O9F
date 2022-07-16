const db = require("../database");
const FilmRepository = require("../repositories/film.repository");
const FilmsActorsRepository = require("../repositories/filmsActors.repository");
const FilmActorRepository = require("../repositories/filmsActors.repository");
const serviceRepo = require("../services/service.repo");
const checkActorsRepo = serviceRepo.checkActorsRepo;
const checkGenreRepo = serviceRepo.checkGenreRepo;
const checkFilmRepo = serviceRepo.checkFilmRepo;
const checkMulptipleActorsRepo = serviceRepo.checkMultipleActorsRepo;

exports.film_all = async (req, res) => {
  const repo = new FilmRepository(db);
  const repoFilmsActors = new FilmsActorsRepository(db);
  const array = [];

  repo
    .all()
    .then((result) => {
      result.forEach(async (film) => {
        const actorFilm = repoFilmsActors.get_related_actors(film.id);

        await array.push({ actorFilm, film });
      });
      res.json({
        data: array,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.film_get = async (req, res) => {
  const errors = [];
  const checkFilmResult = await checkFilmRepo(
    req,
    res,
    parseInt(req.params.id)
  );

  if (checkFilmResult === undefined)
    errors.push("Film ID : " + req.params.id + " not found");
  if (errors.length) {
    res.status(404).json({
      success: false,
      errors,
    });
    return;
  }
  const repo = new FilmRepository(db);
  const repoFilmsActors = new FilmsActorsRepository(db);

  const actors = await repoFilmsActors.get_related_actors(
    parseInt(req.params.id)
  );

  repo
    .get(req.params.id)

    .then((result) => {
      console.log(result);
      res.json({
        result,
        actors,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.film_create = async (req, res, nest) => {
  const errors = [];

  ["name", "synopsis", "release_year", "genre_id", "actor_id"].forEach(
    (field) => {
      if (!req.body[field]) {
        errors.push(`Field '${field}' is missing from request body`);
      }
    }
  );
  if (errors.length) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }

  const errorsNotFound = [];
  const checkGenresResult = await checkGenreRepo(req, res, req.body.genre_id);

  if (checkGenresResult === undefined)
    errorsNotFound.push("Genre ID not found");

  if (req.body.actor_id.length) {
    // If multiple actor
    const checkActorsResult = await checkMulptipleActorsRepo(
      req,
      res,
      req.body.actor_id
    );

    checkActorsResult.forEach((res) => {
      if (res === undefined) {
        errorsNotFound.push("Actor ID not found");
      }
    });
    if (checkActorsResult === undefined)
      errorsNotFound.push("Actor ID not found");
  }

  // If only one actor
  if (!req.body.actor_id.length) {
    const checkActorsResult = await checkActorsRepo(
      req,
      res,
      req.body.actor_id
    );

    if (checkActorsResult === undefined)
      errorsNotFound.push("Actor ID not found");
  }

  console.log(errors);
  if (errorsNotFound.length) {
    res.status(404).json({
      success: false,
      errorsNotFound,
    });
    return;
  }

  const repoFilm = new FilmRepository(db);
  const repoFilmActor = new FilmActorRepository(db);

  repoFilm
    .create({
      name: req.body.name,
      synopsis: req.body.synopsis,
      release_year: req.body.release_year,
      genre_id: req.body.genre_id,
    })
    .then((result) => {
      //Associatton in films_actors
      repoFilmActor.create(result, req.body.actor_id);

      res.status(201).json({
        success: true,
        id: result,
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

exports.film_update = async (req, res) => {
  const errors = [];
  const errorsNotFound = [];
  ["name", "synopsis", "release_year", "genre_id", "actor_id"].forEach(
    (field) => {
      if (!req.body[field]) {
        errors.push(`Field '${field}' is missing from request body`);
      }
    }
  );
  if (errors.length) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }
  const checkGenresResult = await checkGenreRepo(req, res, req.body.genre_id);
  const checkFilmResult = await checkFilmRepo(
    req,
    res,
    parseInt(req.params.id)
  );

  if (checkFilmResult === undefined)
    errorsNotFound.push(`Param film id : ${req.params.id} not found`);

  if (checkGenresResult === undefined)
    errorsNotFound.push("Genre ID not found");

  if (req.body.actor_id.length) {
    // If multiple actor
    const checkActorsResult = await checkMulptipleActorsRepo(
      req,
      res,
      req.body.actor_id
    );

    checkActorsResult.forEach((res) => {
      if (res === undefined) {
        errors.push("Actor ID not found");
      }
    });
    if (checkActorsResult === undefined)
      errorsNotFound.push("Actor ID not found");
  }

  // If only one actor
  if (!req.body.actor_id.length) {
    const checkActorsResult = await checkActorsRepo(
      req,
      res,
      req.body.actor_id
    );

    if (checkActorsResult === undefined)
      errorsNotFound.push("Actor ID not found");
  }

  if (errorsNotFound.length) {
    res.status(404).json({
      success: false,
      errorsNotFound,
    });
    return;
  }

  const repo = new FilmRepository(db);
  const repoFilmActor = new FilmActorRepository(db);
  repo
    .update(req.params.id, {
      name: req.body.name,
      synopsis: req.body.synopsis,
      release_year: req.body.release_year,
      genre_id: req.body.genre_id,
    })
    .then(() => {
      //First delete selected films_actors
      repoFilmActor.delete(parseInt(req.params.id)),
        //second create
        repoFilmActor.create(parseInt(req.params.id), req.body.actor_id);
      repo.get(req.params.id).then((result) => {
        res.json({
          success: true,
          data: result,
        });
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

exports.film_delete = async (req, res) => {
  const errors = [];

  const checkFilmResult = await checkFilmRepo(
    req,
    res,
    parseInt(req.params.id)
  );

  if (checkFilmResult === undefined)
    errors.push("Film ID : " + req.params.id + " not found");

  if (errors.length) {
    res.status(404).json({
      success: false,
      errors,
    });
    return;
  }

  const repo = new FilmRepository(db);
  const repoFilmActor = new FilmActorRepository(db);
  repo
    .delete(req.params.id)
    .then(() => {
      repoFilmActor.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: "film n° " + req.params.id + " successfully deleted",
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};
