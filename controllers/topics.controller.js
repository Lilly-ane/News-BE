
const {selectTopics} =require("../models/topics.model")
const endpoints =require("../endpoints.json")



const getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        //console.log(topics)
        res.status(200).send(topics)
    })
    .catch(next)
};

module.exports = {getTopics}