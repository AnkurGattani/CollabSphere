'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function Header() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [login, setLogin] = useState('Login')
  const [signup, setIsSignup] = useState('Sign Up')
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const isLogin = useAuthStore((state) => state.isLogin)
  const setIsLogin = useAuthStore((state) => state.setIsLogin)
  const setToken = useAuthStore((state) => state.setToken)
  const setUser = useAuthStore((state) => state.setUser)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && storedUser) {
      setIsLogin(true);
      setIsSubscribed(storedUser.isSubscribed || false);
    }
  }, [setIsLogin]);

  // const fetchSubscriptionStatus = async(email: String) => {
  //   try {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/checkSubscription`, {
  //       params: { email },
  //     });
      
  //     return res.data.isSubscribed;
  //   } catch (error) {
  //     console.error("Subscription check failed", error);
  //     return false;
  //   }
  // }


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLogin('Logging in...')

    //console.log("email: " + email + " password: " + password)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/login`, { email: email, password: password })
     // console.log(response.data)
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        //console.log("token: " + accessToken + " user: " + JSON.stringify(user))
        localStorage.setItem('token', accessToken)
        localStorage.setItem('user', JSON.stringify(user))
        setIsLogin(true)
        setToken(accessToken)
        setUser(user)

        const isUserSubscribed = user?.isSubscribed;
        setIsSubscribed(isUserSubscribed);

        user.isSubscribed = isUserSubscribed;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.log(error)
      setIsLogin(false);
    
    }
    setEmail('')
    setPassword('')
    setLogin('Login')
    setIsLoginOpen(false)
  }
  
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSignup('Signing up...')
    console.log("firstname: " + firstname + " lastname: " + lastname + " email: " + email + " password: " + password)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/register`, { firstName: firstname, lastName: lastname, email: email, password: password })
      if (response.data.success) {
        const { accessToken, user } = response.data.data
        localStorage.setItem('token', accessToken)
        localStorage.setItem('user', JSON.stringify(user))
        setIsLogin(true)
        setToken(accessToken)
        setUser(user)
       
      }
    } catch (error) {
      console.log(error)
      setIsLogin(false);
     
    }
    setFirstname('')
    setLastname('')
    setEmail('')
    setPassword('')
    setIsSignupOpen(false)
    setIsSignup('Sign Up')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLogin(false)
    setToken(null)
    setUser(null)
    router.push('/')
  }

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 bg-white shadow-md sticky top-0 z-10"
    >
      <nav className="flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/"><h1 className="text-2xl font-bold text-navy-900">CollabSphere</h1></Link>
       
        </motion.div>
        <div className="space-x-4">
          {!isLogin && (
            <>
              <Button variant="outline" onClick={() => setIsLoginOpen(true)} className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">Login</Button>
              <Button onClick={() => setIsSignupOpen(true)} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">Sign Up</Button>
            </>
          )}
          {isLogin && (
            <>
            {!isSubscribed ? (
              <Button onClick={handleUpgrade} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">
                Upgrade
              </Button>
            ):(
              <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 cursor-default">
                Premium User
              </Button>
            )}
            <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 transition-all duration-300">
              Logout
            </Button>
          </>
          )}
        </div>
      </nav>

      {!isLogin && (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="bg-white text-gray-900 border border-blue-200">
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>
                Enter your credentials to log in.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-navy-300" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-navy-300" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">{login}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {!isLogin && (
        <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
          <DialogContent className="bg-white text-gray-900 border border-blue-200">
            <DialogHeader>
              <DialogTitle>Sign Up</DialogTitle>
              <DialogDescription>
                Create a new account to get started.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="name">First Name</Label>
                <Input id="name" placeholder="Enter your first name" value={firstname} onChange={(e)=>setFirstname(e.target.value)} className="border-navy-300" />
              </div>
              <div>
                <Label htmlFor="name">Last Name</Label>
                <Input id="name" placeholder="Enter your last name" value={lastname} onChange={(e)=>setLastname(e.target.value)} className="border-navy-300" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border-navy-300" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Choose a password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border-navy-300" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">{signup}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      
    </motion.header>
  )
}