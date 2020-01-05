const {MongoClient} = require('mongodb'),
uri = "mongodb+srv://admin:Password@clusteralpha-yoizh.mongodb.net/test?retryWrites=true&w=majority",
client = new MongoClient(uri, {useNewUrlParser:true,useUnifiedTopology:true});

/* async function main(){

    try {
        await client.connect();
        await findUser(client,"Lovely Loft");
    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}

main().catch(console.err); */

function getClient() { return new MongoClient(uri, {useNewUrlParser:true,useUnifiedTopology:true}); }

async function dbConnect(){
    try {
        await client.connect();
    }
    catch(e){
        console.error(e);
    }
}

async function dbDisconnect(){
    await client.close();
}

async function findUser(client, user, pass){
    console.log(`user requested: ${user}`)
    const result = await client.db("student_cv").collection("cvUser").findOne({_id: user,password: pass});
    if(result){
        console.log("user validated")
        return result;
    }
    else{
        console.warn("user not validated")
        return null;
    }
}

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}` ));
}

async function createUser(client, newUser){
    const result = await client.db("student_cv").collection("cvUser").insertOne(newUser);
    console.log(`New user created with the following id: ${result._id}`);
}

module.exports = {getClient,findUser,createUser}
