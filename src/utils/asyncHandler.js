// using the try catch 



const asyncHandler= (fn) => async (req,res,next)=>{

try {
    await fn(req,res,next)
    
} catch (error) {
    
console.log(" ASYNCHANDLER FUNCTION ERROR :!!!!!"+ error)

console.log(error)

}

}




export {asyncHandler}
// const  asyncHandler=(fn)=> async(req,res,next)=>{
//     try {

//      await  fn(req,res,next);
       
       
//     } catch (error) {

//         console.log("ASYNCHANDLER FUNCTION ERROR !! " + error)
       

     
//         res.status(error.code || 500).json({
//             sucess:false,
//             message:"something went wrong "
//         })

//         throw error

    
//     }


// }

// export {asyncHandler}



// const asyncHandler =(fn)=> (req,res,next)=>{

//     Promise.resolve(()=>{
//         fn(req,res,next) 
//     })
    
    
//     .catch((error)=>{
//       console.log("ASYNCHANDLER FUNCTION ERROR " + error)
//       res.status(error.code || 404).json({
//         message:"something went wrong ",
//         success:false 
//       })
//     })
// }

// export {asyncHandler}




// const asyncHandler =(fn)=>( req,res,next)=>{

//     Promise
//     .resolve(()=>{fn(req,res,next)})
//     .catch((error)=>{

//          console.log(" asyncHandler function Error" + error)  
//         next(error)})

// }

// export {asyncHandler}