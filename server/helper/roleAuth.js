const jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");
import Config from "config";

function roleAuth(requiredRoles) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers
     console.log(token,'this is token')
    if (!token) {
      return next(Boom.unauthorized("Token not found"));
    }

    try {
      console.log(Config.get("jwtsecret"),'config');
      let secretOrKey = Config.get("jwtsecret");
      console.log(secretOrKey, "jwtsecret");
      const decodedToken = jwt.verify(token, secretOrKey);
      console.log(decodedToken,'decondeToken')
      if (!requiredRoles.includes(decodedToken.role)) {
        return next(
          Boom.forbidden("You do not have permission to access this resource")
        );
      }
      req.user = decodedToken;
      next(); 
    } catch (error) {
      return next(Boom.unauthorized("Invalid token it is here"));
    }
  };
}
module.exports = roleAuth;