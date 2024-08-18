const mongodb = require("../database/mongodb")
const wrapper = require("../error/wrapper.js")

const logging = wrapper(async(req, res, next) =>{
    const client = await mongodb()
    const value = {
        "req method" : req.method,
        "req api" : req.path,
        "req.body" : JSON.stringify(req.body),
        "req.params" : req.params,
        "req.query" : req.query,
        "req id idx" : req.session.userIdx,
        
        "res.statusCode" : res.statusCode,
        "res.body" : res.body,  
        "res.time" : new Date() 
    }
    await client.db("hw").collection("logging").insertOne(value)
})

module.exports = logging