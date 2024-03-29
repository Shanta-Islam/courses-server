const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());

app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onvejqf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const coursesCollection = client.db("coursesDB").collection("courses");

    
    app.get('/courses', async (req, res) => {
      const query = {};
      const courses = await coursesCollection.find(query).toArray();
      res.send(courses);
    })
    app.get('/course/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const course = await coursesCollection.findOne(query);
      res.send(course);
    })
     app.patch('/:id/like', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $inc: {
          upVote: 1
        }

      }
      const result = await coursesCollection.updateOne(query, updatedDoc);
      res.send(result);

    });


    
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('courses making server is running')
})

app.listen(port, () => {
  console.log(`courses Server is running on port: ${port}`)
})