const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./services/service.autorization");

const app = express();
const filmRoutes = require("./routes/film.routes");
const genreRoutes = require("./routes/genre.routes");
const actorRoutes = require("./routes/actor.routes");

const HTTP_PORT = 8000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

// Globally use Etag
app.enable("etag");

// Auth Middleware
app.use((req, res, next) => auth(req, res, next));

// Router
app.use("/api/film", filmRoutes);
app.use("/api/genre", genreRoutes);
app.use("/api/actor", actorRoutes);
