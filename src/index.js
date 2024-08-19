import { CONNECT_DB } from "./db/database.js";
import dotenv from "dotenv"


// require('dotenv').config({

//     path: "./env"
// })

dotenv . config({

    path : "./env"

})


import { app } from "./app.js";

CONNECT_DB()


.then(()=>{

  app.listen(process.env.PORT,()=>{

   console.log(`SERVER IS RUNNING ON THE PORT ${process.env.PORT}`)


    })


})
.catch((error)=>{
    console.log("DATABASE CONNECTION FAILED " + error)
})