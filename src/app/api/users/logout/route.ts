import { connectToDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
connectToDB();

export async function GET() {
    try{
        const response = NextResponse.json({
            message: "Logout Successfully",
            success: true,

        });

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        return response; // Here actually user will get logged out

    }catch(error: unknown){
        return NextResponse.json(
            {message: "Internal Server Error", error}, 
            {status: 500}
        );
    }
}