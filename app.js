const express = require('express')
const _connstring = require("./credentials")
const { MongoClient } = require("mongodb");
var bodyParser = require('body-parser')
var crypto = require('crypto'); 

const app = express()
app.use(bodyParser.urlencoded())

let port = process.env.PORT;
if (port == null || port == "") {
	port = 10991;
}

let mongoClient // global mongo client variable

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/create', async (req, res) => {
    if (req.query.username && req.query.password) {
        await new Promise(async (res, err) => {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                await mongoClient.connect();
                const database = mongoClient.db('sigma');
                const users = database.collection('users');

                const query = { username: req.query.username }; // round
                const userExists = await users.findOne(query);
                if (userExists) {
                    res(-1)
                } else {
                    const salt = crypto.randomBytes(16).toString('hex'); 
                    const hash = crypto.pbkdf2Sync(req.query.password, salt, 1000, 64, `sha512`).toString(`hex`); 
                    const user = {username: req.query.username, password: hash, salt: salt}
                    const result = await users.insertOne(user);
                    res(result)
                }                
            } finally {
                await mongoClient.close();
            }
        })
        .then(result => {
            if (result.insertedCount === 1) {
                // successfully created user
                res.json({
                    success: 1,
                    info: "created user"
                })
                // res.send("created user!")
            } else if (result === -1) {
                // res.send("user already exists ...")
                res.json({
                    success: 0,
                    info: "user already exists"
                })
            } else {
                // res.send("failed to create user")
                res.json({
                    success: 0,
                    info: "generic failure to create user"
                })
            }
        })
    } else {
        res.json({
            success: 0,
            info: "generic failure to create user"
        })
    }
})

app.get('/login', async (req, res) => {
    res_value = {
        success: 0
    }
    await new Promise(async (res, err) => {
        if (!req.query.username || !req.query.password) {
            res_value = {
                success: 0
            }
            res()
        } else {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                await mongoClient.connect();
                const database = mongoClient.db('sigma');
                const users = database.collection('users');
                const query = { username: req.query.username };
                const userExists = await users.findOne(query);
                if (userExists) {
                    const hash = crypto.pbkdf2Sync(req.query.password, userExists.salt,  
                        1000, 64, `sha512`).toString(`hex`);
                    if (hash == userExists.password) {
                        res_value = {
                            success: 1
                        }
                    } else {
                        res_value = {
                            success: 0
                        }
                    }
                } else {
                    res_value = {
                        success: 0
                    }
                }
            } finally {
                await mongoClient.close();
                res()
            }
        }
    })
    res.json(res_value)
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})