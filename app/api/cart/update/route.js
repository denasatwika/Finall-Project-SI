import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// /api/cart/update

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { cartData } = await request.json();

        // Pengecekan jika frontend mengirim body yang salah
        if (cartData === undefined) {
             return NextResponse.json({ success: false, message: "Invalid payload. 'cartData' is missing." }, { status: 400 });
        }

        await connectDB();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        user.cartItems = cartData;
        await user.save();

        return NextResponse.json({ success: true, message: "Cart updated successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


// export async function POST(request) {
//     try {

//         const { userId } = getAuth(request)

//         const { cartData } = await request.json()

//         await connectDB()
//         const user = await User.findById(userId)

//         user.cartItems = cartData
//         await user.save()

//         return NextResponse.json({ success: true, message: "Cart updated successfully" }, { status: 200 })

        
//     } catch (error) {
//         return NextResponse.json({ success: false, message:error.message })
//     }
// }