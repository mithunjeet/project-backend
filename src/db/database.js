import mongoose from "mongoose"
// import { DATABASENAME } from "../constants.js"

const CONNECT_DB = async()=>{

try {

    const connectionInstances = mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`)
// const connectionInstances = mongoose.connect( `${process.env.MONGODB_URL}` / `${process.env.DATABASE_NAME}`);
console.log("DATABASE CONNECTED SUCCESFULLY !! " +connectionInstances)
        

} catch (error) {
 
    console.log("DATABASE CONNECTION FAILED" + error)

    throw error


    }

}



export {CONNECT_DB}