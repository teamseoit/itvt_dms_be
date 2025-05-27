const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const options = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    autoIndex: true, //this is the code I added that solved it all
    // keepAlive: true,
    // poolSize: 10,
    // bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    // useFindAndModify: false,
    useUnifiedTopology: true,
}

const optsValidator = {
    runValidators: true,
    new: true,
}

mongoose.set('strictQuery', true);

mongoose
    .connect(process.env.MONGO_URL + process.env.DB_NAME, options)
    .then(() => {
        console.log(process.env.DB_NAME + ' is connected')
        console.log(`===================================================================================`)
    })
    .catch((err) => {
        console.error(`Error! Fail to connect DB`)
        console.error(err)
    })