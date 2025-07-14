import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import { getAuth, User } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        
        const { userId } = getAuth(request)
        const { address, items } = await request.json()
        
        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid Data" }, { status: 400 });
        } 

        // calculate amonunt using items
        const amount = await items.reduce(async (total, item) => {
            const product = await Product.findById(item.product);
            return total + product.offerPrice * item.quantity;
        },0)

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now()
            }
        })

        // clear user card
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json( { success: true, message: 'Order Placed' })

    } catch (error) {
        console.log(error)
        return NextResponse.json( { success: false, message: error.message })
    }
}
//asli

// import { inngest } from "@/config/inngest";
// import Product from "@/models/Product";
// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     // Ambil auth dari request
//     const { userId } = auth();
    
//     if (!userId) {
//       return NextResponse.json({
//         success: false,
//         message: "Unauthorized - Please login"
//       }, { status: 401 });
//     }

//     // Ambil data user dari Clerk
//     const user = await clerkClient.users.getUser(userId);
    
//     if (!user) {
//       return NextResponse.json({
//         success: false,
//         message: "User not found"
//       }, { status: 404 });
//     }

//     // Parse request body
//     const { address, items } = await request.json();

//     // Validasi input
//     if (!address || !items || !Array.isArray(items) || items.length === 0) {
//       return NextResponse.json({
//         success: false,
//         message: "Invalid order data - address and items are required"
//       }, { status: 400 });
//     }

//     // Validasi setiap item
//     for (const item of items) {
//       if (!item.product || !item.quantity || item.quantity <= 0) {
//         return NextResponse.json({
//           success: false,
//           message: "Invalid item data - product and quantity are required"
//         }, { status: 400 });
//       }
//     }

//     // Validasi dan ambil product data
//     const productIds = items.map(item => item.product);
//     const products = await Product.find({ _id: { $in: productIds } });

//     if (products.length !== productIds.length) {
//       return NextResponse.json({
//         success: false,
//         message: "Some products not found"
//       }, { status: 400 });
//     }

//     // Hitung total amount
//     let totalAmount = 0;
//     const orderItems = items.map(item => {
//       const product = products.find(p => p._id.toString() === item.product);
//       if (!product) {
//         throw new Error(`Product ${item.product} not found`);
//       }
      
//       const itemTotal = product.price * item.quantity;
//       totalAmount += itemTotal;
      
//       return {
//         product: product._id,
//         productName: product.name,
//         price: product.price,
//         quantity: item.quantity,
//         total: itemTotal
//       };
//     });

//     // Tambahkan tax (2%)
//     const tax = Math.floor(totalAmount * 0.02);
//     const finalAmount = totalAmount + tax;

//     // Buat order object
//     const orderData = {
//       userId: userId,
//       userEmail: user.emailAddresses[0]?.emailAddress || '',
//       userName: user.fullName || user.firstName || 'Unknown',
//       address: address,
//       items: orderItems,
//       subtotal: totalAmount,
//       tax: tax,
//       total: finalAmount,
//       status: 'pending',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     // Di sini Anda bisa simpan ke database
//     // const newOrder = await Order.create(orderData);

//     // Trigger event untuk processing order (jika menggunakan Inngest)
//     try {
//       await inngest.send({
//         name: "order/created",
//         data: {
//           orderId: orderData._id || 'temp-id',
//           userId: userId,
//           orderData: orderData
//         }
//       });
//     } catch (inngestError) {
//       console.error("Inngest error:", inngestError);
//       // Jangan gagalkan order jika inngest error
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Order created successfully",
//       order: orderData
//     }, { status: 201 });

//   } catch (error) {
//     console.error("Order creation error:", error);
    
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Failed to create order"
//     }, { status: 500 });
//   }
// }