// error middleware || NEXT function 
const errorMiddleware = (err,req,res,next) => {
    console.log(err);
    const defaultErrors = { 
        statusCode : 500,
        message:'Something went wrong'

    }
    // missing field error 
    if(err.name === 'ValidationError') { 
        defaultErrors.statusCode = 400
        defaultErrors.message = Object.values(err.errors).map(item => item.message).join(',')

    }

    // duplicate error 
    if(err.code && err.code === 110000){ 
        defaultErrors.statusCode = 400 
        defaultErrors.message = `${Object.keys(err.keyValue)} field has to be unique`;

    }

    res.status(defaultErrors.statusCode).json({
        success: false,
        message: defaultErrors.message,
        err
    });
 };

 export default errorMiddleware; 
