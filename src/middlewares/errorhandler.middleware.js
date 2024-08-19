

const errorhandler = (err, req, res, next) => {
    console.log("hii from error middleware ")
    // console.log(err)
    // console.log(err.statuscode)
    // console.log(err.message)
    res.json({message : err?.message , statuscode: err?.statuscode, sucess:false  })
 }


export { errorhandler }


// const errorHandler = (err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode).json({
//       message: err.message || 'Internal Server Error',
//       stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//     });
// };
