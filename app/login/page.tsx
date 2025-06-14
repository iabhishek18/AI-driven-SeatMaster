"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { useNotification } from "@/context/notification-context"
import { Mail, Lock, User, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { notify } = useNotification()
  const { login, register, resetPassword, isLoading, isAuthenticated } = useAuth()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [resetEmail, setResetEmail] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const [showResetForm, setShowResetForm] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setRegisterData({
      ...registerData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      notify("Please enter both email and password", "error")
      return
    }

    const success = await login(loginData.email, loginData.password)

    if (success) {
      notify("You have successfully logged in", "success", "Welcome back!")
      router.push("/")
    } else {
      notify("Invalid email or password. Please try again.", "error", "Login Failed")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerData.name || !registerData.email || !registerData.password) {
      notify("Please fill in all required fields", "error")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      notify("Passwords do not match. Please try again.", "error", "Registration Failed")
      return
    }

    if (!registerData.agreeToTerms) {
      notify("You must agree to the Terms of Service and Privacy Policy.", "error", "Registration Failed")
      return
    }

    const success = await register(registerData.name, registerData.email, registerData.password)

    if (success) {
      notify("Your account has been created successfully!", "success", "Registration Successful")
      router.push("/")
    } else {
      notify("There was an error creating your account. Please try again.", "error", "Registration Failed")
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resetEmail) {
      notify("Please enter your email address.", "error", "Email Required")
      return
    }

    const success = await resetPassword(resetEmail)

    if (success) {
      notify("Check your email for instructions to reset your password.", "success", "Password Reset Email Sent")
      setShowResetForm(false)
    } else {
      notify("There was an error sending the reset email. Please try again.", "error", "Password Reset Failed")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <motion.h1
            className="text-3xl font-bold text-primary mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to SeatMaster
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Book seats for your favorite events with ease
          </motion.p>
        </motion.div>

        {showResetForm ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email to receive a password reset link</CardDescription>
              </CardHeader>
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Sending...">
                    Send Reset Link
                  </Button>
                  <Button variant="ghost" type="button" className="w-full" onClick={() => setShowResetForm(false)}>
                    Back to Login
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader>
                    <CardTitle>Login to Your Account</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLoginSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-xs"
                            onClick={() => setShowResetForm(true)}
                            type="button"
                          >
                            Forgot password?
                          </Button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          name="rememberMe"
                          checked={loginData.rememberMe}
                          onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal">
                          Remember me
                        </Label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Logging in...">
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>For demo purposes, you can use any email and password</p>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Register to book seats and manage your bookings</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegisterSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            className="pl-10"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            className="pl-10"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className="pl-10"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          name="agreeToTerms"
                          checked={registerData.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setRegisterData({ ...registerData, agreeToTerms: checked as boolean })
                          }
                          required
                        />
                        <Label htmlFor="terms" className="text-sm font-normal">
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Creating account...">
                        Create Account
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  )
}
