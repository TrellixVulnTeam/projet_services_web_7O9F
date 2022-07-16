const db = require("../database");
const GenreRepository = require("../repositories/genre.repository");
const serviceRepo = require("../services/service.repo");
const checkGenreUsedInFilm = serviceRepo.checkGenreUsedInFilm;
const checkGenreRepo = serviceRepo.checkGenreRepo;

exports.genre_all = (req, res) => {
  const repo = new GenreRepository(db);
  repo
    .all()
    .then((result) => {
      res.json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.genre_create = (req, res) => {
  const errors = [];
  ["name"].forEach((field) => {
    if (!req.body[field]) {
      errors.push(`Field '${field}' is missing from request body`);
    }
  });
  if (errors.length) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }

  const repo = new GenreRepository(db);
  repo
    .create({
      name: req.body.name,
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        id: result,
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

exports.genre_delete = async (req, res) => {
  const errors = [];

  const queryId = req.params.id;
  const checkGenreRepoResult = await checkGenreRepo(
    req,
    res,
    parseInt(req.params.id)
  );

  if (checkGenreRepoResult === undefined) errors.push("Genre not find");
  const checkRelatedGenreResult = await checkGenreUsedInFilm(queryId, res);

  checkRelatedGenreResult.map((resul) => {
    if (resul.genre_id === parseInt(req.params.id)) {
      errors.push(
        `Genre related to film id n° ${resul.id} name : ${resul.name} `
      );
    }
  });
  if (errors.length) {
    res.status(404).json({
      success: false,
      errors,
    });
    return;
  }
  const repo = new GenreRepository(db);
  repo
    .delete(req.params.id)
    .then(() => {
      res.status(200).json({
        message: `Genre n°${req.params.id} successfully deleted`,
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};
