import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import connectDB from '@/config/db'; 


export async function GET(request) {
    try {

        await connectDB();

        const products = await Product.find({})
        return NextResponse.json({ success: true, products }, { status: 200 });

    } catch (error) {
        return  NextResponse.json({ success: false, message: error.message }, { status: 500 });

    }
}