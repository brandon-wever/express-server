const mongoose = require('mongoose');
const uri = `mongodb+srv://atlasAdmin:R6NpNDRHq74RmqN@cluster0.a8dgx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; // connection string to database

mongoose.connect(uri, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (error) => {
        if (error) {
            console.error(`Connection to MongoDb failed: ${error.message}`);
            return;
        }

        console.log('Successfully connected to MongoDb ...');
    }
);

module.exports = mongoose;