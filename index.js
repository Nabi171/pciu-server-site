const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 4000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://anas:AYEx3Rv6xtEZVVze@cluster0.v3q4mcg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    await client.connect();
    const collectionOne = client.db("anas").collection("projects");
    const collectionTwo = client.db("anas").collection("members");
    const collectionThree = client.db("anas").collection("newmembers");
    const collectionUsers = client.db("anas").collection("users");
    const collectionposts = client.db("anas").collection("posts");
    console.log('connected to mongodb');

    const verifyAdmin = async (req, res, next) => {
        const requester = req.decoded.email;
        const requseterAccount = await collectionUsers.findOne({ email: requester });
        if (requseterAccount.role === 'admin') {
            next();
        }
        else {
            res.status(403).send({ message: 'forbidden' });
        }

    }

    try {
        // get the data from mongodb
        app.get('/details', async (req, res) => {
            const query = {};
            const cursor = collectionOne.find(query);
            const results = await cursor.toArray();
            console.log(results);
            res.send(results);
        });
        app.get('/members', async (req, res) => {
            const query = {};
            const cursor = collectionTwo.find(query);
            const results = await cursor.toArray();
            console.log(results);
            res.send(results);
        });
        app.get('/newmembers', async (req, res) => {
            const query = {};
            const cursor = collectionThree.find(query);
            const results = await cursor.toArray();
            console.log(results);
            res.send(results);
        });
        app.get('/posts', async (req, res) => {
            const query = {};
            const cursor = collectionposts.find(query);
            const results = await cursor.toArray();
            console.log(results);
            res.send(results);
        });

        app.get('/members/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const mems = await collectionTwo.findOne(query);
            res.send(mems);

        });

        app.get('/users', async (req, res) => {
            const users = await collectionUsers.find().toArray();
            res.send(users);
        })
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await collectionUsers.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })

        // post the data in mongodb
        app.post('/members', async (req, res) => {
            const newMember = req.body;
            const result = await collectionTwo.insertOne(newMember);
            res.send(result);
        });
        app.post('/newmembers', async (req, res) => {
            const newMember = req.body;
            const result = await collectionThree.insertOne(newMember);
            res.send(result);
        });
        app.post('/posts', async (req, res) => {
            const newPost = req.body;
            const result = await collectionposts.insertOne(newPost);
            res.send(result);
        });


        // DELETE
        app.delete('/members/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collectionTwo.deleteOne(query);
            res.send(result);
        });
        app.delete('/newmembers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collectionThree.deleteOne(query);
            res.send(result);
        });
        app.delete('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collectionposts.deleteOne(query);
            res.send(result);
        });



    } finally {




    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('wellcome to pciu application')
});
app.listen(port, () => {
    console.log('db connected')
})

// module.exports = app;