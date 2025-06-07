'use client'
import { useEffect } from "react";
import axios from "axios";
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  useEffect(() => {
    const fetchUser = async () => {
      
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      if (user?.id) {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/getUser`, {
          params: { id: user.id }
        });
        console.log(res);
        
        if (res.data.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
        }
      }
    };
    fetchUser();
  }, []);

    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-10 max-w-lg text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          You&apos;re now a Premim User at CollabSphere! Kindly head back to Dashboard to enjoy the features. 
        </p>
        <Link href="/">
          <Button className=" bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}