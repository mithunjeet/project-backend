// node js provide karta  hai ERROR class 
// stack mera matlab hai error stack


class apiError extends Error{
constructor(
    statuscode,
    message="",
    errors=[],
    stack=""
)
{

    super(message)
    this.statuscode=statuscode
    this.data=null
    this.message=message
    this.success=false
    this.errors= errors

    if(stack){
        this.stack=stack

    }else{
        Error.captureStackTrace(this,this.constructor)
    }

}


}

export  default apiError