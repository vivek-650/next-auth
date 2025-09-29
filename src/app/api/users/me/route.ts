import { connectToDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/utils/getTokenData";

connectToDB();

export const POST = async (request: NextRequest) => {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    // check if user exists
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }

    return NextResponse.json({
      message: "User fetched successfully",
      success: true,
      user,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
};
