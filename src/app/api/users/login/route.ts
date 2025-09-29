import { connectToDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    console.log("user found:", user);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }
    // createing jwt token - Note: Pass only id of the user, else are optional. to keep it light weight
    const tokenData = {
      id: user._id, // only required
      username: user.username, // optional
      email: user.email, //optional
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1h" });

    const response = NextResponse.json(
      {
        message: "Logged In Success",
        success: true,
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
        httpOnly: true
    });
    return response; // Here actually user will get logged in
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
