const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o3pkv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    collection.insertMany(products)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      });
  });

  app.get('/products', (req, res) => {
    collection.find({})
      .toArray((err, document) => {
        res.send(document);
      });
  });

  app.get('/product/:key', (req, res) => {
    collection.find({ key: req.params.key })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body
    console.log(productKeys);
    collection.find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      })
  });


  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      });
  });



});

app.listen(process.env.PORT|| port);