/* eslint-disable no-console */
/* eslint-disable func-names */
class ActorRepository {
  constructor(database) {
    this.database = database;
  }

  all() {
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * FROM actors", [], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows.map((row) => row));
        }
      });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT * FROM actors WHERE id = ?",
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
        "INSERT INTO actors (first_name,last_name,date_of_birth,date_of_death) VALUES (?,?,?,?)",
        [
          data.first_name,
          data.last_name,
          data.date_of_birth,
          data.date_of_death,
        ],
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
        `UPDATE actors
                 SET first_name = ?,
                     last_name = ?,
                     date_of_birth = ?,
                     date_of_death = ?
                 WHERE id = ?`,
        [
          data.first_name,
          data.last_name,
          data.date_of_birth,
          data.date_of_death,
          id,
        ],
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
        `DELETE FROM actors
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

module.exports = ActorRepository;
