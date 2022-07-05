const express = require("express")
const {graphqlHTTP} = require("express-graphql")
const graphqlSchema = require("./graphql/schema")
const graphqlResolvers = require("./graphql/resolvers")
const mongoose = require("mongoose")
const cors = require('cors')
const {verifyToken,verifyAdmin}=require ("./helper/jwt")
require('dotenv').config()

const app = express()

const corsOptions = {
  origin(origin, callback) {
      callback(null, true);
  },
  credentials: true
};
app.use(cors(corsOptions));
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,token');
  next();
}
app.use(allowCrossDomain);
app.use(verifyToken)
app.use(verifyAdmin)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
)

const uri =`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}cluster0.oeegj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true,
autoIndex: true}
mongoose
  .connect(uri, options)
  .then(() => app.listen(process.env.PORT || 3000, console.log("Server is running")))
  .catch(error => {
    throw error
  })