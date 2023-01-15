const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req,res,next) => {
    console.log("11111");
    const Token = req.body;
    console.log(Token.token);
    // const token = req.body.token || req.query.token || req.headers['x-access-token']
    if(!Token){
         return res.status(403).send("A token is required for authentications");
    }

    try {
        const decoded = jwt.verify(Token.token,config.TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        return res.status(404).send("Invalid Token")
    }
    return next();
}

module.exports = verifyToken;