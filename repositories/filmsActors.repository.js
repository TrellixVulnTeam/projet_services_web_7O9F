class FilmsActorsRepository {
  constructor(database) {
    this.database = database;
  }

  all() {
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * FROM films_actors", [], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows.map((row) => row));
        }
      });
    });
  }

  get_related_actors(id) {
    return new Promise((resolve, reject) => {
      this.database.all(
        `SELECT * from actors WHERE id IN (SELECT actor_id FROM films_actors WHERE film_id = ${id})`,
        [],
        (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows.map((row) => row));
          }
        }
      );
    });
  }

  create(film_id, actors_id) {
    return new Promise((resolve, reject) => {
      // For Multiple actors
      if (actors_id.length) {
        actors_id.forEach(
          (actor_id) =>
            this.database.run(
              `INSERT INTO films_actors (film_id,actor_id) VALUES (${film_id},${actor_id})`
            ),
          function (err) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
      }
      // For only one actor
      if (!actors_id.length) {
        this.database.run(
          `INSERT INTO films_actors (film_id,actor_id) VALUES (${film_id},${actors_id})`
        ),
          function (err) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              resolve(this.lastID);
            }
          };
      }
    });
  }
  update(film_id, actors_id) {
    return new Promise((resolve, reject) => {
      // For Multiple actors
      if (actors_id.length) {
        actors_id.forEach(
          (actor_id) =>
            this.database.run(
              `UPDATE films_actors  SET actor_id = ${actor_id} WHERE film_id = ${film_id}`
            ),
          function (err) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
      }
      // For only one actor
      if (!actors_id.length) {
        console.log("test simple");
        this.database.run(
          `UPDATE films_actors SET actor_id = ${actors_id} WHERE film_id = ${film_id}`
        ),
          function (err) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              resolve(this.lastID);
            }
          };
      }
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.database.run(
        `DELETE FROM films_actors
                 WHERE film_id = ?`,
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

module.exports = FilmsActorsRepository;
