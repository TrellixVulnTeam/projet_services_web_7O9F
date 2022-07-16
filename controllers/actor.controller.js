const db = require("../database");
const ActorRepository = require("../repositories/actor.repository");
const serviceRepo = require("../services/service.repo");
const checkActorsRepo = serviceRepo.checkActorsRepo;

exports.actor_all = (req, res) => {
  const repo = new ActorRepository(db);

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

exports.actor_get = async (req, res) => {
  const errors = [];
  const repo = new ActorRepository(db);

  const checkActorsRepoResult = await checkActorsRepo(
    req,
    res,
    parseInt(req.params.id)
  );

  if (checkActorsRepoResult === undefined) {
    errors.push("Actor ID : " + req.params.id + " not found");
  }
  if (errors.length) {
    res.status(404).json({
      success: false,
      errors,
    });
    return;
  }
  repo
    .get(req.params.id)
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

exports.actor_create = (req, res) => {
  const errors = [];

  [("first_name", "last_name", "date_of_birth", "date_of_death")].forEach(
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

  const repo = new ActorRepository(db);

  repo
    .create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
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

exports.actor_update = async (req, res) => {
  const errors = [];
  const errorsNotFound = [];
  const checkActorsRepoResult = await checkActorsRepo(
    req,
    res,
    parseInt(req.params.id)
  );

  if (checkActorsRepoResult === undefined) {
    errorsNotFound.push("Actor ID : " + req.params.id + " not found");
  }

  ["first_name", "last_name", "date_of_birth", "date_of_death"].forEach(
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
  if (errorsNotFound.length) {
    res.status(404).json({
      success: false,
      errorsNotFound,
    });
    return;
  }

  const repo = new ActorRepository(db);

  repo
    .update(req.params.id, {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    })
    .then(() => {
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

exports.actor_delete = async (req, res) => {
  checkActorsRepo(req, res, parseInt(req.params.id));
  const errorsNotFound = [];
  const checkActorsRepoResult = await checkActorsRepo(
    req,
    res,
    parseInt(req.params.id)
  );
  const repo = new ActorRepository(db);
  if (checkActorsRepoResult === undefined) {
    errorsNotFound.push("Actor ID : " + req.params.id + " not found");
  }
  if (errorsNotFound.length) {
    res.status(404).json({
      success: false,
      errorsNotFound,
    });
    return;
  }

  repo
    .delete(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "Actor n° " + req.params.id + " successfully deleted",
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};
