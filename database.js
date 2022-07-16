/* eslint-disable no-console */
const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (errConnect) => {
  if (errConnect) {
    // Cannot open database
    console.error(errConnect.message);
    throw errConnect;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `
              CREATE TABLE 'genres' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' varchar(255) NOT NULL
              );
            `,
      (errQuery) => {
        if (errQuery) {
          // Table already created
        } else {
          // Table just created, creating some rows
          const insert = "INSERT INTO genres (name) VALUES (?)";
          db.run(insert, ["Comédie"]);
          db.run(insert, ["Action"]);
          db.run(insert, ["Horreur"]);
        }
      }
    );

    db.run(
      `
              CREATE TABLE 'actors' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'first_name' varchar(255) NOT NULL,
                'last_name' varchar(255) NOT NULL,
                'date_of_birth' date NOT NULL,
                'date_of_death' date
              );
            `,
      (errQuery) => {
        if (errQuery) {
          // Table already created
        } else {
          // Table just created, creating some rows
          const insert =
            "INSERT INTO actors (first_name, last_name, date_of_birth, date_of_death) VALUES (?,?,?,?)";
          db.run(insert, ["Louis", "De Funès", "1914-07-31", "1983-01-27"]);
          db.run(insert, ["Vin", "Diesel", "1967-07-18", null]);
          db.run(insert, ["Paul", "Walker", "1973-09-12", "2013-11-30"]);
        }
      }
    );

    db.run(
      `
              CREATE TABLE 'films' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' varchar(255) NOT NULL,
                'synopsis' text NOT NULL,
                'release_year' int,
                'genre_id' int NOT NULL,
                FOREIGN KEY (genre_id) REFERENCES genres(id)
              );
            `,
      (errQuery) => {
        if (errQuery) {
          // Table already created
        } else {
          // Table just created, creating some rows
          const insert =
            "INSERT INTO films (name, synopsis, release_year, genre_id) VALUES (?,?,?,?)";
          db.run(insert, ["Fast and Furious", "Grosses voitures", 2001, 2]);
          db.run(insert, [
            "Fast and Furious 9",
            "Grosses voitures mais sans Paul Walker",
            2021,
            2,
          ]);
          db.run(insert, [
            "La Folie des Grandeurs",
            "Il est l'or, mon seignor",
            1971,
            1,
          ]);
        }
      }
    );

    db.run(
      `
              CREATE TABLE 'films_actors' (
                'film_id' INTEGER,
                'actor_id' INTEGER,
                FOREIGN KEY (film_id) REFERENCES films(id),
                FOREIGN KEY (actor_id) REFERENCES actors(id),
                PRIMARY KEY ('film_id', 'actor_id')
              );
            `,
      (errQuery) => {
        if (errQuery) {
          // Table already created
        } else {
          // Table just created, creating some rows
          const insert =
            "INSERT INTO films_actors (film_id, actor_id) VALUES (?,?)";
          db.run(insert, [3, 1]);
          db.run(insert, [1, 2]);
          db.run(insert, [1, 3]);
          db.run(insert, [2, 2]);
        }
      }
    );
  }
});

module.exports = db;
