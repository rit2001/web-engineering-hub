

export const sendToken = (res,user,message,statusCode = 200) => {

    const token = user.getJWTToken();

    //options for cookie
    
    const options = {
        expires : new Date(Date.now() + 15*24*60*60*1000),
        httpOnly : true,
        secure: false,        // ✅ change this
        sameSite: "lax",      // ✅ change this

    };

    res.status(statusCode).cookie("token",token,options).json({
        success : true,
        message,
        user,
    });
};