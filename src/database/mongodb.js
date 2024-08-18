const mongodb = require("mongodb").MongoClient

const connectMongoDB = async () =>{
    const connect = await mongodb.connect("mongodb://localhost:27017")
    return connect
}

module.exports = connectMongoDB