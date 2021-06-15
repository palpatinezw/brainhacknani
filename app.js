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

async function auth(username, password) {
    return new Promise(async (res, err) => {
        let res_value = {
            success: 0
        }
        if (!username || !password) {
            res_value = {
                success: 0
            }
            res(res_value)
        } else {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                await mongoClient.connect();
                const database = mongoClient.db('sigma');
                const users = database.collection('users');
                const query = { username: username };
                const userExists = await users.findOne(query);
                if (userExists) {
                    const hash = crypto.pbkdf2Sync(password, userExists.salt,  
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
                res(res_value)
            }
        }
    })
}

app.get('/login', async (req, res) => {
    let res_value = {
        success: 0
    }

    await auth(req.query.username, req.query.password)
    .then(res => res_value = res)

    res.json(res_value)
})

app.get('/create_circle', async (req, res) => {
    let res_value = {
        success: 0
    }
    await new Promise(async (res, err) => {
        if (!req.query.username || !req.query.password || !req.query.circleName
            || !req.query.circleVis) {
            res()
        } else {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })

                await mongoClient.connect();
                const database = mongoClient.db('sigma');
                let userLegit = await auth(req.query.username, req.query.password)
                userLegit = userLegit.success

                if (userLegit) {
                    const circles = database.collection('circles');
                    const query = { name: req.query.circleName };
                    const circleExists = await circles.findOne(query);

                    if (!circleExists) {
                        const circle = {name: req.query.circleName, vis: req.query.circleVis, members: {
                            [req.query.username] : [0]
                                // username: ,
                                // flairs: [0],
                                // visroles: ["owner"],
                                // hidroles: ["creator", "flair0"]
                        }, flairs: [
                            {
                                name: "Owner",
                                id: 0,
                                active: 1,
                                power: 0,
                                allowAssignFlairs: 1,
                                allowCreateFlairs: 1,
                                allowAcceptMembers: 1
                            }
                        ], infoText: "Hey! I just created my own circle." }
                        const result = await circles.insertOne(circle);
                        if (result.insertedCount == 1) {
                            res_value.success = 1
                        }
                    }
                }             
            } finally {
                await mongoClient.close();
                res()
            }
        }
    })
    .then(result => {
        res.json(res_value)
    })
    .catch(result => {
        res.json({
            success: 0
        })
    })
    
})

app.get('/create_flair_info', async (req, res) => {
    let res_value = {
        success: 0
    }
    await new Promise(async (res, err) => {
        if (!req.query.username || !req.query.password || !req.query.circleName) {
            res()
        } else {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })

                await mongoClient.connect();
                const database = mongoClient.db('sigma');
                let userLegit = await auth(req.query.username, req.query.password)
                userLegit = userLegit.success

                if (userLegit) {
                    const circles = database.collection('circles');
                    const query = { name: req.query.circleName };
                    const circle = await circles.findOne(query);
                    console.log(circle)
                    if (circle) {
                        if (req.query.username in circle.members) {
                            let userflairs = circle.members[req.query.username]
                            let minFlairPower = -1
                            let minFlair
                            for (flairId in userflairs) {
                                let flair = circle.flairs[flairId]
                                if (flair.allowCreateFlairs) {
                                    if (minFlairPower == -1) {
                                        minFlairPower = flair.power
                                        minFlair = flair
                                    } else {
                                        minFlairPower = Math.min(flair.power, minFlairPower)
                                        minFlair = flair
                                    }
                                }
                            }
                            if (minFlairPower != -1) {
                                // can create flairs
                                res_value = {
                                    success: 1,
                                    power: minFlair.power,
                                    allowAssignFlairs: minFlair.allowAssignFlairs,
                                    allowCreateFlairs: minFlair.allowCreateFlairs,
                                    allowAcceptMembers: minFlair.allowAcceptMembers
                                }
                            }
                        }
                    }
                }             
            } finally {
                await mongoClient.close();
                res()
            }
        }
    })
    .then(result => {
        res.json(res_value)
    })
    .catch(result => {
        res.json({
            success: 0
        })
    })
    
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})