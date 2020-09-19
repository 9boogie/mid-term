/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const checkAllUserParamsExist = (user) => {
  if (user.username && user.name && user.password && user.organization_id) {
    return true;
  }
  return false;
}

const checkUserExists = (user, db) => {
  const queryString =
    `SELECT username
   FROM users
   WHERE username = $1`;
  const queryParams = [user.username];

  return db.query(queryString, queryParams)
    .then(data => {
      const matchingUser = data.rows;
      if (matchingUser.length > 0) {
        return true;
      }
      return false;
    })
}

const createNewUser = (newUser, db) => {
  const signupQuery = `
  INSERT INTO users( username, name, password, organization_id)
  VALUES ($1, $2, $3, $4);
  `
  const hashedPassword = bcrypt.hashSync(newUser.password, 5);
  const signupParams = [newUser.username, newUser.name, hashedPassword, newUser.organization_id];
  return db.query(signupQuery, signupParams).then(data => {
    return `SUCCESFULLY CREATED USER ${newUser.username}`;
  })
}

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const newUser = req.body;
    if (!checkAllUserParamsExist(newUser)) {
      return res
        .status(500)
        .json({ error: "Request is missing a field (name, username, password, organization_id)" });
    }

    checkUserExists(newUser, db).then(userExists => {
      if (userExists) {
        return res
          .status(500)
          .json({ error: "Username already exists" });
      }

      createNewUser(newUser, db).then(message => {
        return res.json(message);
      }).catch(err => {
        return res
          .status(500)
          .json({ error: err.message });
      });
    })


    // const queryString =
    //   `SELECT username
    //    FROM users
    //    WHERE username = $1`;
    // const queryParams = [newUser.username];

    // db.query(queryString, queryParams)
    //   .then(data => {
    //     const matchingUser = data.rows;
    //     if (matchingUser.length > 0) {
    //       return res
    //         .status(500)
    //         .json({ error: "Username already exists" });
    //     }

    //     createNewUser(newUser, db).then(message => {
    //       return res.json(message);
    //     }).catch(err => {
    //       return res
    //         .status(500)
    //         .json({ error: err.message });
    //     });
    //   })
  });

  router.post("/login", (req, res) => {
    console.log("login ROUTE WORKS")
    console.log(req.body)
  });
  return router;
};
