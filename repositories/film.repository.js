/* eslint-disable no-console */

const FilmsActorsRepository = require("./filmsActors.repository");

const toto = new FilmsActorsRepository();
/* eslint-disable func-names */
class FilmRepository {
  constructor(database) {
    this.database = database;
  }

  all() {
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * FROM films", [], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows.map((row) => row));
        }
      });
    });
  }

  getGenreFromFilm(id) {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT * FROM genres WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log(row);
            resolve(row);
          }
        }
      );
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT * FROM films WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log(row);
            resolve(row);
          }
        }
      );
    });
  }

  create(data) {
    return new Promise((resolve, reject) => {
      this.database.run(
        "INSERT INTO films (name,synopsis,genre_id,release_year) VALUES (?,?,?,?)",
        [data.name, data.synopsis, data.genre_id, data.release_year],
        function (err) {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  update(id, data) {
    return new Promise((resolve, reject) => {
      this.database.run(
        `UPDATE films
                 SET name = ?,
                     synopsis = ?,
                     genre_id = ?,
                     release_year = ?
                 WHERE id = ?`,
        [data.name, data.synopsis, data.genre_id, data.release_year, id],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.database.run(
        `DELETE FROM films
                 WHERE id = ?`,
        [id],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }
}

module.exports = FilmRepository;
