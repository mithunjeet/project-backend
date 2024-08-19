class apiResponse{

constructor(

    statuscode,
    message="success",
    data
)
{
    this.data=data
    this.statuscode=statuscode
    this.message=message
    this.sucess= statuscode 

}

}


export { apiResponse }