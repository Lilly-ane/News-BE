const db= require("../db/connection")

const selectTopics = () => {
    return db.query(`SELECT slug, description FROM topics`)
    .then((result) => {
        console.log(result.rows)
        return result.rows;
    });

};

module.exports = {selectTopics}


/* be available on endpoint /api/topics.
get all topics.
an array of topic objects, each of which should have the following properties:
slug
description */
