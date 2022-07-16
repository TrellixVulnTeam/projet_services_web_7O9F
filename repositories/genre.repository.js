class GenreRepository {
  constructor(database) {
    this.database = database;
  }

  all() {
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * FROM genres", [], (err, rows) => {
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

  create(data) {
    return new Promise((resolve, reject) => {
      this.database.run(
        "INSERT INTO genres (name) VALUES (?)",
        [data.name],
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

  delete(id) {
    return new Promise((resolve, reject) => {
      this.database.run(
        `DELETE FROM genres
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
module.exports = GenreRepository;
