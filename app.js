const express = require('express')
const _connstring = require("./credentials")
const { MongoClient } = require("mongodb");
var bodyParser = require('body-parser')
var crypto = require('crypto'); 

const app = express()
// app.use(bodyParser.urlencoded())
// app.use(express.json())

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

async function Auth(username, password) {
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

    await Auth(req.query.username, req.query.password)
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
                let userLegit = await Auth(req.query.username, req.query.password)
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

async function GetCircle(username, password, circleName) { 
    // includes user auth and checks if user is in circle
    // circle found is passed under .circle
    return new Promise(async (res, err) => {
        let res_value = {
            success: 0
        }
        if (!username || !password || !circleName) {
            res(res_value)
        } else {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })

                await mongoClient.connect();
                const database = mongoClient.db('sigma');
                let userLegit = await Auth(username, password)
                userLegit = userLegit.success

                if (userLegit) {
                    const circles = database.collection('circles');
                    const query = { name: circleName };
                    const circle = await circles.findOne(query);
                    if (circle) {
                        if (username in circle.members) {
                            res_value.success = 1
                            res_value.circle = circle
                        }   
                    }
                }             
            } finally {
                await mongoClient.close();
                res(res_value)
            }
        }
    })
}

async function SetCircle(circleName, newcircleData) {
    return new Promise(async (res, err) => {
        let res_value = {
            success: 0
        }
        if (!circleName || !newcircleData) {
            res(res_value)
        } else {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })

                await mongoClient.connect();
                const database = mongoClient.db('sigma');

                const circles = database.collection('circles');
                const query = { name: circleName };
                const circle = await circles.findOne(query);
                if (circle) {
                    const options = {
                        upsert: false, // do not create a document if no documents match the query
                    };
                    const result = await circles.replaceOne(query, newcircleData, options);
                    if (result.modifiedCount === 1) {
                        res_value.success = 1
                    }
                }
            } finally {
                await mongoClient.close();
                res(res_value)
            }
        }
    })
}

async function MinFlair(username, password, circleName) {
    return new Promise(async (res, err) => {
        let res_value = {
            success: 0
        }
        if (!username || !password || !circleName) {
            res(res_value)
        } else {
            try {
                mongoClient = new MongoClient(_connstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })

                await mongoClient.connect();
                const database = mongoClient.db('sigma');
                let userLegit = await Auth(username, password)
                userLegit = userLegit.success

                if (userLegit) {
                    const circles = database.collection('circles');
                    const query = { name: circleName };
                    const circle = await circles.findOne(query);
                    console.log(circle)
                    if (circle) {
                        if (username in circle.members) {
                            let userflairs = circle.members[username]
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
                res(res_value)
            }
        }
    })
}

app.get('/create_flair_info', async (req, res) => {
    await MinFlair(req.query.username, req.query.password, req.query.circleName)
    .then(result => {
        res.json(result)
    })
    .catch(result => {
        res.json({
            success: 0
        })
    })
    
})

app.get('/create_flair', async (req, res) => {
    let res_value = {
        success: 0
    }
    return new Promise(async (res, err) => {
        if (!req.query.username || !req.query.password || !req.query.circleName 
            || !req.query.flairName || !req.query.flairPower || !req.query.flairAssign
            || !req.query.flairCreate || !req.query.flairAccept) {
                // checks for all required params
                res()
            } else {
                await MinFlair(req.query.username, req.query.password, req.query.circleName)
                .then(async minFlair => {
                    if (minFlair.success) { // managed to find the user's flair creation abilities
                        if (req.query.flairPower >= minFlair.power) {
                            if (req.query.flairCreate <= minFlair.allowCreateFlairs && 
                                req.query.flairAssign <= minFlair.allowAssignFlairs && 
                                req.query.flairAccept <= minFlair.allowAcceptMembers) {
                                    // flair intending to create is under valid permissions
                                    await GetCircle(req.query.username, req.query.password, req.query.circleName)
                                    .then(async circleRes => {
                                        if (circleRes.success) { // found target circle
                                            let flairExists = false // checks if target flair already exists
                                            for (let testflair of circleRes.circle.flairs) {
                                                console.log(testflair.name, req.query.flairName)
                                                if (testflair.name == req.query.flairName) {
                                                    flairExists = true
                                                    break
                                                }
                                            }
                                            if (!flairExists) {
                                                circleRes.circle.flairs.push({
                                                    name: req.query.flairName,
                                                    id: circleRes.circle.flairs.length,
                                                    active: 1,
                                                    power: req.query.flairPower,
                                                    allowAssignFlairs: req.query.flairAssign,
                                                    allowCreateFlairs: req.query.flairCreate,
                                                    allowAcceptMembers: req.query.flairAccept
                                                }) // updates the current circle and updates the server with it
                                                setCircleRes = await SetCircle(req.query.circleName, circleRes.circle)
                                                if (setCircleRes.success) {
                                                    res_value.success = 1
                                                    // res()
                                                }
                                            }
                                        }
                                    })
                                }
                        }
                    }
                })
                res()
            }
    })
    .then(result => {
        res.json(res_value)
    })
})

app.get('/get_members', async (req, res) => {
    let res_value = {
        success: 0
    }
    return new Promise(async (res, err) => {
        if (!req.query.username || !req.query.password || !req.query.circleName) {
                // checks for all required params
                res()
            } else {
                await GetCircle(req.query.username, req.query.password, req.query.circleName)
                .then(async circleRes => {
                    if (circleRes.success) { // user auth AND found target circle
                        let circle = circleRes.circle
                        res_value.success = 1
                        for (let member in circle.members) {
                            let memberFlairList = []
                            for (let flair of circle.members[member]) {
                                let targetFlair = circle.flairs[parseInt(flair)]
                                if (targetFlair.active == 1) {
                                    memberFlairList.push(targetFlair.name)
                                }
                            }
                            circle.members[member] = memberFlairList
                        }
                        res_value.members = circle.members
                    }
                })
                res()
            }
    })
    .then(result => {
        res.json(res_value)
    })
})

app.get('/assign_flair_info', async (req, res) => {
    let res_value = {
        success: 0
    }
    return new Promise(async (res, err) => {
        if (!req.query.username || !req.query.password || !req.query.circleName) {
                // checks for all required params
                res()
            } else {
                await MinFlair(req.query.username, req.query.password, req.query.circleName)
                .then(async minFlair => {
                    if (minFlair.success) { // managed to find the user's flair creation abilities
                        // flair intending to create is under valid permissions
                        await GetCircle(req.query.username, req.query.password, req.query.circleName)
                        .then(async circleRes => {
                            if (circleRes.success) { // found target circle
                                let availableFlairs = []
                                for (let testflair of circleRes.circle.flairs) {
                                    if (testflair.power >= minFlair.power) {
                                        availableFlairs.push(testflair)
                                    }
                                }
                                res_value.success = 1
                                res_value.availableFlairs = availableFlairs
                            }
                        })
                    }
                })
                res()
            }
    })
    .then(result => {
        res.json(res_value)
    })
})

app.get('/assign_flair', async (req, res) => {
    let res_value = {
        success: 0
    }
    return new Promise(async (res, err) => {
        if (!req.query.username || !req.query.password || !req.query.circleName
            || !req.query.flairNames || !req.query.targetUsernames) {
                // checks for all required params
                res()
            } else {
                let targetUsers = req.query.targetUsers.split(",")
                let flairNames = req.query.flairNames.split("0")
                for (let x = 0; x < flairNames.length; x++) {
                    flairNames[x] = flairNames[x].split(",")
                }
                if (targetUsers.length == 1) {
                    targetUsers = Array(flairNames.length).fill(targetUsers[0])
                }
                if (targetUsers.length == flairNames.length) {
                    await MinFlair(req.query.username, req.query.password, req.query.circleName)
                    .then(async minFlair => {
                        if (minFlair.success) { // managed to find the user's flair creation abilities
                            // flair intending to create is under valid permissions
                            await GetCircle(req.query.username, req.query.password, req.query.circleName)
                            .then(async circleRes => {
                                if (circleRes.success) { // found target circle
                                    let circle = circleRes.circle
                                    let availableFlairs = []
                                    for (let testflair of circle.flairs) {
                                        if (testflair.power >= minFlair.power) {
                                            availableFlairs.push(testflair)
                                        }
                                    }
                                    targetUsernames.forEach((targetUser, idx) => {
                                        let intendedFlairs = flairNames[idx]
                                        for (let intendedFlair of intendedFlairs) {
                                            let intendedFlair_id = -1
                                            if (targetUser in circle.members) {
                                                flairIsAvailable = false
                                                for (let testflair of availableFlairs) {
                                                    if (testflair.name == intendedFlair) {
                                                        intendedFlair_id = testflair.id
                                                        flairIsAvailable = true
                                                        break
                                                    }
                                                }
                                                if (flairIsAvailable) {
                                                    res_value.success = 1
                                                    res_value.availableFlairs = availableFlairs
                                                    if (intendedFlair_id in circle.members[targetUser]) {
                                                        // target user already has the flair so remove it
                                                        circle.members[targetUser].splice(circle.members[targetUser].indexOf(intendedFlair_id), 1)
                                                    } else {
                                                        circle.members[targetUser].push(intendedFlair_id)
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                res()
            }
    })
    .then(result => {
        res.json(res_value)
    })
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})