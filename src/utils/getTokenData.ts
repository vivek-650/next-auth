import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getTokenData = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        if (!token) throw new Error("No token found");
        
        // Temporary: try with hardcoded secret first
        const secret = process.env.TOKEN_SECRET || "thisisaverysecuretoken";        
        const decoded = jwt.verify(token, secret) as { id: string };
        return decoded.id;
    } catch (error: unknown) {
        console.error("JWT verification error:", (error as Error).message);
        throw new Error("error from helper: " + (error as Error).message);
    }
}