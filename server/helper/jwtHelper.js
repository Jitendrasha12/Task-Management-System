import { Strategy, ExtractJwt } from 'passport-jwt';
import Config from 'config';
import Jwt from 'jsonwebtoken';
import Passport from 'passport';
import Boom from '@hapi/boom';
import  userServices  from '../api/v1/app/services/users.service.js';

const jwtStrategyApp = new Strategy(
  {
    secretOrKey: Config.get("jwtsecret"), // Correct secret from config
    ignoreExpiration: true, // Optional, ensures token expiration is ignored
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from auth header
  },
  async (jwtPayload, done) => {
    try {
      console.log("jwtPayload>>>>>>>>>>>>>>>>>>>>>>", jwtPayload);
      const { _id, role } = jwtPayload;
       console.log(_id,role,'line188888888888')
      if (!_id || !role) {
        return done(Boom.unauthorized("Unauthorized access")); // Unauthorized if _id or role is missing
      }

      // Fetch the user by _id
      const user = await userServices.findUserByid(_id);
      if (!user) {
        return done(Boom.unauthorized("User not found")); // If user doesn't exist
      }

      // Pass the user to the next step
      return done(null, user); // User found, return the user object
    } catch (error) {
      return done(Boom.unauthorized(error.message)); // Catch and handle any errors
    }
  }
);





const authenticateApp = () =>
	Passport.authenticate('app', {
		failWithError: true,
		session: false,
	});

const generateJwt = async (payload, type) => {
  try {
    let jwtOptions = Config.get("jwtOptions");
   const secret = Config.get("jwtsecret");  
    return await Jwt.sign(payload, secret, {
      expiresIn: jwtOptions.expiresInHour,
    });
  } catch (error) {
    return error;
  }
};

const validateJwt = async (token, isDateCheck, type, done) => {
	console.log('tokeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeen', token);
	const secret =Config.get('jwtsecret') 
	Jwt.verify(token,secret,
		{
			ignoreExpiration: true,
		},
		function (err, decoded) {
			let currentTime = new Date().getTime();
			if (isDateCheck && decoded.exp * 1000 < currentTime) {
				console.log('validateJwt -> isDateCheck', isDateCheck);
				return done(Boom.unauthorized('Token Expired.'));
			}
			if (err) {
				console.log("error is", err)
				return done(Boom.unauthorized(err.message));
			}
			return done(null, decoded);
		}
	);
};




module.exports = {
	generateJwt,
	validateJwt,
	authenticateApp,
	jwtStrategyApp,
	
};
