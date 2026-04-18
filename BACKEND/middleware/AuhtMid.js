import { json } from "express";
import jwt from "jsonwebtoken"

export const AuthMid = async (req , res, next) =>{
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(402),json({
                message : "Not Autherized, token epired",
                success : false
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decode.id;
        req.role = decode.role

        next()
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
}

export const isRecruiter = async (req , res , next) =>{
    try {
        if(req.role && req.role !== 'recruiter'){
            res.status(403).json({
                message : "Recruiter access only"
            })
        }
        next()
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
}