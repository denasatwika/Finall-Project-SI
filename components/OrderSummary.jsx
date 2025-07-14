import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext()

    // const { currency, router, getCartCount, getCartAmount, cartItems, setCartItems } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  // const { user, isLoaded, isSignedIn } = useUser();
  // const { getToken } = useClerk();

  const fetchUserAddresses = async () => {
    try {

      const { data } = await axios.get('/api/user/get-address',)

      if (data.success) {
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {

      if (!selectedAddress) {
        return toast.error('Please select an address')
      }

      let cartItemsArray = Object.keys(cartItems).map((key) => ({product:key, quantity:cartItems[key]}))
      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0)

      if (cartItemsArray.length === 0) {
        return toast.error('Cart is empty')
      }

      // const token = await getToken()

      const { data } = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        items: cartItemsArray
      } 
      // , {
      //   headers: {Authorization: `Bearer  ${token}` }
      // }
    )

      if (data.success) {
        toast.success(data.message)
        setCartItems({});
        router.push('/order-placed')
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary; //asli


// import { addressDummyData } from "@/assets/assets";
// import { useAppContext } from "@/context/AppContext";
// import { useClerk, useAuth } from "@clerk/nextjs";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const OrderSummary = () => {

//   const { currency, router, getCartCount, getCartAmount, user, cartItems, setCartItems } = useAppContext()
//   const { getToken } = useAuth(); // Gunakan useAuth untuk getToken
  
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchUserAddresses = async () => {
//     if (!user) return;
    
//     setIsLoading(true);
//     try {
//       // Cek apakah getToken tersedia
//       if (!getToken || typeof getToken !== 'function') {
//         toast.error('Authentication service not available');
//         return;
//       }

//       const token = await getToken();
      
//       if (!token) {
//         toast.error('Authentication required');
//         return;
//       }

//       const { data } = await axios.get('/api/user/get-address', {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (data.success) {
//         setUserAddresses(data.addresses);
//         if (data.addresses.length > 0) {
//           setSelectedAddress(data.addresses[0]);
//         }
//       } else {
//         toast.error(data.message || 'Failed to fetch addresses');
//       }

//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//       toast.error(error.response?.data?.message || error.message || 'Failed to fetch addresses');
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   const createOrder = async () => {
//     if (isLoading) return;
    
//     try {
//       // Validasi user login
//       if (!user) {
//         toast.error('Please login to place an order');
//         return;
//       }

//       // Validasi alamat
//       if (!selectedAddress) {
//         toast.error('Please select an address');
//         return;
//       }

//       // Validasi cart
//       let cartItemsArray = Object.keys(cartItems).map((key) => ({
//         product: key, 
//         quantity: cartItems[key]
//       }));
//       cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);

//       if (cartItemsArray.length === 0) {
//         toast.error('Cart is empty');
//         return;
//       }

//       setIsLoading(true);
      
//       // Cek apakah getToken tersedia
//       if (!getToken || typeof getToken !== 'function') {
//         toast.error('Authentication service not available');
//         return;
//       }
      
//       // Ambil token
//       const token = await getToken();
      
//       if (!token) {
//         toast.error('Authentication failed. Please login again');
//         return;
//       }

//       // Kirim order
//       const { data } = await axios.post('/api/order/create', {
//         address: selectedAddress._id,
//         items: cartItemsArray
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (data.success) {
//         toast.success(data.message || 'Order placed successfully');
//         setCartItems({});
//         router.push('/order-placed');
//       } else {
//         toast.error(data.message || 'Failed to create order');
//       }

//     } catch (error) {
//       console.error('Error creating order:', error);
      
//       // Handle specific error types
//       if (error.response?.status === 401) {
//         toast.error('Session expired. Please login again');
//         router.push('/sign-in');
//       } else if (error.response?.status === 400) {
//         toast.error(error.response.data?.message || 'Invalid order data');
//       } else if (error.response?.status === 500) {
//         toast.error('Server error. Please try again later');
//       } else {
//         toast.error(error.response?.data?.message || error.message || 'Failed to create order');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (user) {
//       fetchUserAddresses();
//     }
//   }, [user]);

//   return (
//     <div className="w-full md:w-96 bg-gray-500/5 p-5">
//       <h2 className="text-xl md:text-2xl font-medium text-gray-700">
//         Order Summary
//       </h2>
//       <hr className="border-gray-500/30 my-5" />
//       <div className="space-y-6">
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">
//             Select Address
//           </label>
//           <div className="relative inline-block w-full text-sm border">
//             <button
//               className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none disabled:opacity-50"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               disabled={isLoading}
//             >
//               <span>
//                 {isLoading ? "Loading addresses..." : 
//                  selectedAddress
//                   ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
//                   : userAddresses.length === 0 ? "No addresses found" : "Select Address"}
//               </span>
//               <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
//                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {isDropdownOpen && !isLoading && (
//               <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
//                 {userAddresses.length > 0 ? (
//                   userAddresses.map((address, index) => (
//                     <li
//                       key={address._id || index}
//                       className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
//                       onClick={() => handleAddressSelect(address)}
//                     >
//                       {address.fullName}, {address.area}, {address.city}, {address.state}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-4 py-2 text-gray-500 text-center">
//                     No addresses found
//                   </li>
//                 )}
//                 <li
//                   onClick={() => router.push("/add-address")}
//                   className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center border-t"
//                 >
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">
//             Promo Code
//           </label>
//           <div className="flex flex-col items-start gap-3">
//             <input
//               type="text"
//               placeholder="Enter promo code"
//               className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
//               disabled={isLoading}
//             />
//             <button 
//               className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700 disabled:opacity-50"
//               disabled={isLoading}
//             >
//               Apply
//             </button>
//           </div>
//         </div>

//         <hr className="border-gray-500/30 my-5" />

//         <div className="space-y-4">
//           <div className="flex justify-between text-base font-medium">
//             <p className="uppercase text-gray-600">Items {getCartCount()}</p>
//             <p className="text-gray-800">{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Fee</p>
//             <p className="font-medium text-gray-800">Free</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax (2%)</p>
//             <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
//             <p>Total</p>
//             <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//         </div>
//       </div>

//       <button 
//         onClick={createOrder} 
//         className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
//         disabled={isLoading || !user || !selectedAddress || getCartCount() === 0}
//       >
//         {isLoading ? 'Processing...' : 'Place Order'}
//       </button>
//     </div>
//   );
// };

// export default OrderSummary;