import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI!

if(!MONGO_URI){
    throw new Error("please define mongo_uri in environment variable");
}

let catched = global.mongoose;

if(!catched){
    catched = global.mongoose = { conn : null, promise : null}
}

export async function connectToDatabase(){
    if(catched.conn){
        return catched.conn;
    }

    if(!catched.promise){
        const opts = {
            bufferCommands :true,
            maxPoolSize : 10
        }
        mongoose.connect(MONGO_URI, opts).then(()=>{mongoose.connection});
    } 
    
    try {
        catched.conn = await catched.promise;
    } catch (error) {
        catched.promise = null;
        throw error;
    }

    return catched.conn;
}