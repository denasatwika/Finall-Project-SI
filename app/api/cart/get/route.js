import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// /api/user/data (atau di mana pun file GET Anda berada)

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        // Tambahkan pengecekan untuk keamanan
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(userId).select('-password'); // Hindari mengirim password

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // ✔️ PERBAIKAN: Kembalikan seluruh objek 'user'
        return NextResponse.json({ success: true, user: user }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// export async function GET(request) {
//     try {
        
//         const { userId } = getAuth(request)

//         await connectDB()
//         const user = await User.findById(userId)

//         const { cartItems } = user

//         return NextResponse.json({ success: true, cartItems: cartItems }, { status: 200 });

//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message });
//     }
// }