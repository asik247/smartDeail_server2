const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
