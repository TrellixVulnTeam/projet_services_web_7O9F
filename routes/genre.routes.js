const express = require("express");
const genreController = require("../controllers/genre.controller");

const router = express.Router();

router.get("/", genreController.genre_all);
router.post("/", genreController.genre_create);
router.delete("/:id", genreController.genre_delete);

module.exports = router;
