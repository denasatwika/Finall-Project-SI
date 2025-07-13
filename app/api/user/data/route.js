import User from "@/models/User";
import connectDB from "@/config/db";
import { getAuth, useClerk } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {   
    console.log("=== API ROUTE DEBUG START ===");
    console.log("Permintaan API ke /api/user/data diterima");
    
    try {
        // Step 1: Check authentication
        console.log("Step 1: Getting auth...");
        const authResult = getAuth(request);
        console.log("Auth result:", authResult);
        
        const { userId } = authResult;
        console.log("User ID yang diterima:", userId);
        console.log("Type of userId:", typeof userId);
        console.log("UserId length:", userId ? userId.length : 'null');

        if (!userId) {
            console.log("ERROR: User ID tidak ditemukan");
            return NextResponse.json({ 
                success: false, 
                message: "User ID tidak ditemukan" 
            });
        }

        // Step 2: Connect to database
        console.log("Step 2: Connecting to database...");
        await connectDB();
        console.log("Database connected successfully");

        // Step 3: Search for user
        console.log("Step 3: Searching for user...");
        console.log("Searching for user with _id:", userId);
        
        const user = await User.findById(userId);
        console.log("User query completed");
        console.log("User found:", user ? "Yes" : "No");
        
        if (user) {
            console.log("User data preview:", {
                _id: user._id,
                name: user.name,
                email: user.email,
                hasCartItems: !!user.cartItems
            });
        }

        if (!user) {
            console.log("ERROR: User tidak ditemukan in database");
            return NextResponse.json({ 
                success: false, 
                message: "User tidak ditemukan"
            });
        }

        console.log("SUCCESS: Returning user data");
        return NextResponse.json({ success: true, user });
        
    } catch (error) {
        console.log("=== ERROR CAUGHT ===");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Check if it's a MongoDB connection error
        if (error.name === 'MongooseError' || error.name === 'MongoError') {
            console.error("MongoDB Error Details:", error);
        }
        
        // Check if it's a Clerk auth error
        if (error.message.includes('clerk') || error.message.includes('auth')) {
            console.error("Possible Clerk Auth Error");
        }
        
        return NextResponse.json({ 
            success: false, 
            message: `Server Error: ${error.message}`,
            errorType: error.constructor.name
        });
    } finally {
        console.log("=== API ROUTE DEBUG END ===");
    }
}

// export async function GET(request) {
//   console.log("Permintaan API ke /api/user/data diterima");
//   try {
  
//         const {userId} = getAuth(request)
//         console.log("User ID yang diterima:", userId);

//         if (!userId) {
//             return NextResponse.json({ success: false, message: "User ID tidak ditemukan" });
//             }


//         await connectDB()
//         const user = await User.findById(userId)

//         if (!user) {
//             return NextResponse.json({ success: false, message: "User tidak ditemukan"})
//         }

//         return NextResponse.json({ success: true, user})

//   } catch (error) {
//         return NextResponse.json({ success: false, message: error.message});
//   }
// }
    