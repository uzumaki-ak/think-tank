import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { verify } = jwt;

export const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select('-password');
      next();
    } catch (error) {
      let err = new Error("not authorized token failed");
      err.statusCode = 401;
      next(err);
    }
  } else{
    let error = new Error("not authorized, no token");
    error.statusCode = 401;
    next(error);
  }
};

// to check whwether user is admin or some random user to not leta nyone else create post 

export const adminGuard = (req, res, next) => {
  // logic for admin guard
  if(req.user && req.user.admin) {
    next();
  } else {
    let error = new Error("not authorized, not admin");
    error.statusCode = 401;
    next(error);
  }
};
