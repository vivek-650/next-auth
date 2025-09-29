import mongoose from "mongoose";

export async function connectToDB() {
    try{
        mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("Connected to MongoDB");
        });

        connection.on('error', (err) => {
            console.log("Error connecting to MongoDB. Please make sur your db is up", err);
            process.exit();
        });

    }catch(err){
        console.log("Something went wrong. Error connecting to DB", err);
    }
}