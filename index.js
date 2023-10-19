const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const addToCartCollection = client.db('productsDB').collection('addToCart')

        app.get('/products', async (req, res) => {
            const products = await productCollection.find().toArray();
            res.send(products)
        })
  
        app.get('/detailsProducts/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        app.put('/updateProduct/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)}
            const options = { upsert: true };
            const updateProduct = req.body;

            const product = {
                $set: {
                    name: updateProduct.name,
                    brand: updateProduct.brand,
                    product: updateProduct.product,
                    image: updateProduct.image,
                    price: updateProduct.price,
                    ratting: updateProduct.ratting,
                    description: updateProduct.description,
                    }
            }
            const result = await productCollection.updateOne(filter, product, options)
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

        // BRAND PRODUCT
        app.get('/products/:brand', async(req, res) => {
            const brand = req.params.brand;
            const products = await productCollection.find({brand}).toArray()
            res.send(products)
        })

        // ADD TO CART

        app.get('/addtocart', async(req, res) => {
            const product  = await addToCartCollection.find().toArray()
            res.send(product)
        })

        app.post('/addtocart', async(req, res) => {
            const product = req.body;
            const result = await addToCartCollection.insertOne(product)
            res.send(result)
        })

        app.delete('/addtocart/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await addToCartCollection.deleteOne(query)
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