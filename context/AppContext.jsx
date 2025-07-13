'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
// import { toast } from 'react-toastify';
import { toast } from 'react-hot-toast';
import axios from 'axios'; 


export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    // const { user } = useUser();
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useClerk();

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {

            const { data } = await axios.get('/api/product/list');

            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // const fetchUserData = async () => {
    //     try {
    //         if (user.publicMetadata.role === 'seller') {
    //         setIsSeller(true)
    //     }
    //     const token = await getToken()

    //     const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })
    //     console.log("Data yang diterima: ", data); 

    //     if (data.success) {
    //         setUserData(data.user)
    //         setCartItems(data.user.cartItems)
    //     } else {
    //         toast.error(data.message);
    //     }

    // } catch (error) {
    //         toast.error(error.message);
    //     }
    // }

const fetchUserData = async () => {
    console.log("=== CLIENT DEBUG START ===");
    
    try {
        console.log("User object:", user);
        console.log("Is loaded:", isLoaded);
        console.log("Is signed in:", isSignedIn);
        console.log("User ID:", user?.id);
        
        if (user?.publicMetadata?.role === 'seller') {
            console.log("User is a seller");
            setIsSeller(true);
        }

        // Try without Authorization header first (let Clerk handle it automatically)
        console.log("Making API call to /api/user/data...");
        
        const response = await axios.get('/api/user/data');
        console.log("API Response status:", response.status);
        console.log("API Response data:", response.data);

        const { data } = response;

        if (data.success) {
            console.log("Success! Setting user data...");
            setUserData(data.user);
            setCartItems(data.user.cartItems || {});
        } else {
            console.log("API returned error:", data.message);
            toast.error(data.message);
        }

    } catch (error) {
        console.log("=== CLIENT ERROR CAUGHT ===");
        console.error("Error object:", error);
        console.error("Error message:", error.message);
        
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
            console.error("Response headers:", error.response.headers);
            
            toast.error(error.response.data?.message || `Server Error: ${error.response.status}`);
        } else if (error.request) {
            console.error("Request error:", error.request);
            toast.error("Network error - no response from server");
        } else {
            console.error("Setup error:", error.message);
            toast.error(error.message);
        }
    } finally {
        console.log("=== CLIENT DEBUG END ===");
    }
}

    // const addToCart = async (itemId) => {

    //     let cartData = structuredClone(cartItems);
    //     if (cartData[itemId]) {
    //         cartData[itemId] += 1;
    //     }
    //     else {
    //         cartData[itemId] = 1;
    //     }
    //     setCartItems(cartData);
    //     if (user) {
    //         try {
    //             // const token = await getToken()

    //             // await axios.post('/api/cart/update', {cartData}, {headers: { Authorization: `Bearer ${await getToken()}` } })

    //             await axios.post('/api/cart/update', cartData);

    //             toast.success("Item added to cart");

    //         } catch (error) {
    //             toast.error(error.message)
    //         }
    //     }

    // }

    // const updateCartQuantity = async (itemId, quantity) => {

    //     let cartData = structuredClone(cartItems);
    //     if (quantity === 0) {
    //         delete cartData[itemId];
    //     } else {
    //         cartData[itemId] = quantity;
    //     }
    //     setCartItems(cartData)
    //             if (user) {
    //         try {
    //             // const token = await getToken()

    //             await axios.post('/api/cart/update', cartData)

    //             toast.success("Cart Updated");

    //         } catch (error) {
    //             toast.error(error.message)
    //         }
    //     }

    // }

        const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        if (user) {
            try {
            // ✔️ PERBAIKAN: Bungkus 'cartData' dalam sebuah objek
            await axios.post('/api/cart/update', { cartData }); 
            toast.success("Item added to cart");
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

        const updateCartQuantity = async (itemId, quantity) => {
            let cartData = structuredClone(cartItems);
            if (quantity === 0) {
                delete cartData[itemId];
            } else {
                cartData[itemId] = quantity;
            }
            setCartItems(cartData);
            if (user) {
                try {
                    // ✔️ PERBAIKAN: Bungkus 'cartData' dalam sebuah objek
                    await axios.post('/api/cart/update', { cartData });
                    toast.success("Cart Updated");
                } catch (error) {
                    toast.error(error.message);
                }
            }
        };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    // useEffect(() => {
    //     if (user){
    //     fetchUserData()
    // }
    // }, [user])

     // Menjadi useEffect yang baru dan lebih baik ini:
    useEffect(() => {
    // Hanya jalankan fetchUserData jika:
    // 1. Clerk sudah selesai loading (isLoaded = true)
    // 2. DAN pengguna sudah terbukti login (isSignedIn = true)
    if (isLoaded && isSignedIn) {
        fetchUserData();
    }
    }, [isLoaded, isSignedIn]); // <-- Perhatikan dependensinya juga diubah

    const value = {
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}