const express = require("express");
const filmController = require("../controllers/film.controller");

const router = express.Router();

router.get("/", filmController.film_all);
router.get("/:id", filmController.film_get);
router.post("/", filmController.film_create);
router.put("/:id", filmController.film_update);
router.delete("/:id", filmController.film_delete);

module.exports = router;
