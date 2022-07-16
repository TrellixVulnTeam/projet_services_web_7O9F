const express = require("express");
const actorController = require("../controllers/actor.controller");

const router = express.Router();

router.get("/", actorController.actor_all);
router.get("/:id", actorController.actor_get);
router.post("/", actorController.actor_create);
router.put("/:id", actorController.actor_update);
router.delete("/:id", actorController.actor_delete);

module.exports = router;
