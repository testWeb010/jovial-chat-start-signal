import "dotenv/config";
import jwt, { decode } from "jsonwebtoken";
import express from "express";
import { getDb } from "../db/conn.mjs";
const router = express.Router();


router.use(async (req, res, next) => {
    const db = getDb().connection;

    try {
        const bearer = req.headers["authorization"];
        if (!bearer) {
          return res.status(401).send("Unauthorized access - no token provided");
        }
    
        const token = bearer.split(" ")[1];
        if (!token) {
          return res.status(401).send("Unauthorized access");
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const user = await db.collection("users").findOne({ username: decoded.username });

    
        if (user.role === "admin" || user.role === "superadmin") {
          req.user = decoded; // Attach user info to the request
          next();
        } else {
          return res.status(403).json({ message: "Unauthorized: Admin access required" });
        }
      } catch (error) {
        console.error(error);
        return res.status(401).send("Unauthorized access - Invalid token");
      }
});

export default router;