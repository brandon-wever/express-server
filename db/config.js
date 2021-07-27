const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}.a8dgx.mongodb.net/${process.env.DB_DATABASE_NAME}?retryWrites=true&w=majority`; // connection string to database

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