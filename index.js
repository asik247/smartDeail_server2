const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
//?dotenv requere cde her;
require('dotenv').config();
// console.log(`dotenvhere ${process.env.DB_PASS}`);
const app = express();
//?middleware her;
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;
//?Root api;
app.get('/', (req, res) => {
    res.send('This is root server api here now')
})
//?mongodb uri code hre;
/**W4IT9gaf6XcApfTg smartDeails2 */
// const uri = "mongodb+srv://smartDeails2:W4IT9gaf6XcApfTg@cluster0.fdzc9ua.mongodb.net/?appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.fdzc9ua.mongodb.net/?appName=Cluster0`;
//?mongodb client code hre;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
//?mongodb run funk code her;
async function run() {
    try {
        //?connect the client to the server;
        await client.connect();
        const myDB = client.db("smartDeails2");
        const usersColl = myDB.collection("usersInfo2");
        //?products2 coll;
        const productsColl = myDB.collection('products2');
        //?BidsColl2
        const bidsColl = myDB.collection('bids2')
        //Todo:product get method code hre;
        app.get('/products2', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = {};
            if (email) {
                query.email = email
            }
            const cursor = productsColl.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        //! Latest Products get;
        app.get('/latestProducts2', async (req, res) => {
            const latestPro = productsColl.find().sort({ created_at: -1 }).limit(6)
            const result = await latestPro.toArray();
            res.send(result);
        })
        //? id use get specifique product get;
        app.get('/products2/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsColl.findOne(query);
            res.send(result)
        })
        //Todo:post userData in db;
        app.post('/usersInfo2', async (req, res) => {
            const allUserData = req.body;
            // same user second time db te store hobe na;email dia condition dai;
            // const email = req.body.email;
            // const query = {email:email}
            const existingUsers = await usersColl.findOne({ email: allUserData.email });
            if (existingUsers) {
                return res.status(409).send({
                    message: 'এই email দিয়ে user আগেই আছে!'
                });
            }
            const result = await usersColl.insertOne(allUserData);
            res.send(result);

        });
        //Todo:Get specifique usersInfo;
        app.get('/usersInfo2/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersColl.findOne(query);
            res.send(result)
        })
        //Todo:Patch/update userInfo;
        app.patch('/usersInfo2/:id', async (req, res) => {
            const id = req.params.id;
            const newUserInfo = req.body;
            const query = { _id: new ObjectId(id) };
            const updatData = {
                $set: {
                    name: newUserInfo.name,
                    email: newUserInfo.email
                }
            }
            const result = await usersColl.updateOne(query, updatData);
            res.send(result)
        })
        //Todo:Bids get all bids for db;
        app.get('/bids2/:thisProductId',async(req,res)=>{
            const id = req.params.thisProductId;
            const query = {product:id}
            console.log(id);
            const cursor = bidsColl.find(query).sort({bid_price:-1})
            const result = await cursor.toArray();
            res.send(result)
        })
        //Todo:Bids Post Method code here;
        app.post('/bids2',async(req,res)=>{
            const bidsData = req.body;
            console.log(bidsData);
            const result = await bidsColl.insertOne(bidsData);
            res.send(result)
        })








        //?send a ping to confirm a successful connection;
        await client.db("admin").command({ ping: 1 });
        console.log('Ping your deployment. You successfully connected to MongoDB! ');
    }
    finally {

    }
}
run().catch(console.dir);
//?Listing code here;
app.listen(port, () => {
    console.log(`This server is runing in port:${port}`);
})
