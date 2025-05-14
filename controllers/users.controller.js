const { selectUsers} = require("../models/user.model")
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

// const getUserByUsername = (req, res, next) => {
//     const username = req.params.username
//     return selectUserByUsername(username)
//     .then((user) => {
//         res.status(200).send({ user })
//     })
//     .catch((err) => {
//         next(err)
//     })
// }


module.exports = {getUsers,}