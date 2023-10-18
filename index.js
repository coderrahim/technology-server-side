const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');



const uri = "mongodb+srv://techzone:vC7vSjUS5m9e3xW3@rahim.iilssri.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();

        const productCollection = client.db('productsDB').collection('products')
        const brandCollection = client.db('productsDB').collection('brand')

        app.get('/products', async (req, res) => {
            const products = await productCollection.find().toArray();
            res.send(products)
        })

              
        
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })
        
        // brands added  

        app.get('/brands', async(req, res) => {
            const brands = await brandCollection.find().toArray()
            res.send(brands)
        })

        app.post('/brands', async(req, res) => {
            const brands = req.body;
            const result = await brandCollection.insertOne(brands)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('technology server running now')
})

app.listen(port, () => {
    console.log(`technology running port ${port}`)
})