const mongoose = require("mongoose")
const data = require("./data.js")
const listing = require("../models/schema.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

main().then(() => {
    console.log("connection successful")
}).catch((err)=> {
    console.log(err)
});

const initDB = async () => {
    await listing.deleteMany({})
    data.data = data.data.map((obj) => ({...obj,  owner : '6959d6509e51b02972be2b55'}))
    await listing.insertMany(data.data)
    console.log("done")
}

initDB()