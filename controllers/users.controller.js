const { selectUsers, selectUserByUsername} = require("../models/user.model")
const endpoints =require("../endpoints.json")

const getUsers = (req, res, next) => {
    return selectUsers()
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch((err) => {
            next(err)
        })
}

getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};



module.exports = {getUsers,getUserByUsername}