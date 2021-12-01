const express = require("express");
const { MongoClient } = require("mongodb");

// mongodb er id jonno
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
// middleware 1 by cors must be use
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
// middleware 2,3 by cors must be use
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v25nn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
async function run() {
	try {
		await client.connect();
		const database = client.db("carMechanic");
		const servicesCollection = database.collection("services");
		// post api --------------------------------------
		app.post("/services", async (req, res) => {
			const service = req.body;
			console.log("hits the post api", service);
			const result = await servicesCollection.insertOne(service);
			console.log("this is service result", result);
			res.json(result);
		});
		// Get api-------------------------------------------------------------------------
		app.get("/services", async (req, res) => {
			const cursor = servicesCollection.find({});
			const services = await cursor.toArray();
			res.send(services);
		});
		// Get a single api------------------------------------------
		app.get("/services/:id", async (req, res) => {
			const id = req.params.id;
			console.log("getting specific service", id);
			const query = { _id: ObjectId(id) };
			const service = await servicesCollection.findOne(query);
			res.json(service);
		});
		//Delete api id------------------------------------
		app.delete("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await servicesCollection.deleteOne(query);
			res.json(result);
		});

		console.log("connected to database");
	} finally {
		//   await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`running my server port on`, port);
});
