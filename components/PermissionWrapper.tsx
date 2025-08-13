"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield, Clock, AlertCircle, Sparkles, UserIcon, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomModal } from "@/components/CustomModal"

interface PermissionWrapperProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user" | null
}

export default function PermissionWrapper({ children, requiredRole = null }: PermissionWrapperProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
    isLoading: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      checkUser()
    }
  }, [mounted])

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    isLoading = false,
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      isLoading,
    })
  }

  const checkUser = async () => {
    try {
      const currentUser = await User.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setError(null)
      } else {
        setError("অনুমতি প্রয়োজন")
      }
    } catch (err) {
      setError("অনুমতি প্রয়োজন")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!loginEmail.trim()) {
      showModal("ইমেইল প্রয়োজন", "দয়া করে একটি বৈধ ইমেইল ঠিকানা লিখুন।", "warning")
      return
    }

    setIsLoggingIn(true)
    showModal("লগইন হচ্ছে", "আপনার অ্যাকাউন্ট যাচাই করা হচ্ছে...", "info", true)

    try {
      const user = await User.loginWithEmail(loginEmail.trim())

      setModal({ ...modal, isOpen: false })
      showModal("লগইন সফল!", `স্বাগতম ${user.email}! আপনি সফলভাবে লগইন করেছেন।`, "success")

      setTimeout(() => {
        setUser(user)
        setError(null)
        setModal({ ...modal, isOpen: false })
        // Force a page reload to reinitialize the layout
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("Login failed:", error)
      setModal({ ...modal, isOpen: false })
      showModal("লগইন ব্যর্থ!", "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    showModal("লগআউট নিশ্চিতকরণ", "আপনি কি নিশ্চিত যে লগআউট করতে চান?", "warning")
  }

  const confirmLogout = () => {
    User.logout()
    setModal({ ...modal, isOpen: false })
    // Force a page reload to reinitialize the layout
    window.location.reload()
  }

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto opacity-50"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">সিস্টেম লোড হচ্ছে...</p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login Screen - NO NAVIGATION/SIDEBAR
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl border-0 relative z-10 overflow-hidden">
          {/* Animated top border */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 animate-pulse"></div>

          <CardHeader className="text-center pb-6 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20"></div>

            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>

              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">UAGen Pro</CardTitle>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Access required</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 relative">
            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  ইমেইল ঠিকানা
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="আপনার ইমেইল লিখুন"
                  className="h-12 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl transition-all duration-200"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  disabled={isLoggingIn}
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold"
              >
                {isLoggingIn ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>লগইন হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    <span>লগইন করুন</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm"> অ্যাকাউন্ট</p>
                  <p className="text-blue-600 dark:text-blue-300 text-xs">যেকোনো ইমেইল দিয়ে লগইন করুন</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200 text-sm">Special Features</p>
                  <p className="text-green-600 dark:text-green-300 text-xs">All Unique and Updated User Agents (Without Duplicates)

</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                আপনার ইমেইল নিরাপদ এবং সংরক্ষিত থাকবে।
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Modal */}
        <CustomModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          isLoading={modal.isLoading}
        />
      </div>
    )
  }

  // Approval Pending Screen - NO NAVIGATION/SIDEBAR
  if (!user.is_approved && user.email !== "admin@example.com") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-600/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl border-0 relative z-10 overflow-hidden">
          {/* Animated top border */}
          <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 animate-pulse"></div>

          <CardHeader className="text-center pb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20"></div>

            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="w-10 h-10 text-white animate-pulse" />
              </div>

              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                অনুমোদনের অপেক্ষায়
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">আপনার অ্যাকাউন্ট পর্যালোচনা করা হচ্ছে</p>
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-6 relative">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  আপনার অ্যাকাউন্ট <strong>{user.email}</strong> এখনো অনুমোদিত হয়নি। অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।
                </p>
              </div>

              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-12 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 border-2 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
            >
              <UserIcon className="w-5 h-5 mr-2" />
              অন্য অ্যাকাউন্ট দিয়ে লগইন
            </Button>
          </CardContent>
        </Card>

        <CustomModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={confirmLogout}
          showCancel={true}
          confirmText="হ্যাঁ, লগআউট করুন"
          cancelText="বাতিল"
        />
      </div>
    )
  }

  // Access Denied Screen - NO NAVIGATION/SIDEBAR
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl border-0 relative z-10 overflow-hidden">
          {/* Animated top border */}
          <div className="h-1 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 animate-pulse"></div>

          <CardHeader className="text-center pb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20"></div>

            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>

              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                অ্যাক্সেস নিষিদ্ধ
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">আপনার পর্যাপ্ত অনুমতি নেই</p>
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-6 relative">
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                এই পেজটি শুধুমাত্র <strong>অ্যাডমিনদের</strong> জন্য। আপনি একজন{" "}
                <strong>{user.role === "admin" ? "অ্যাডমিন" : "সাধারণ ব্যবহারকারী"}</strong>।
              </p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-12 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 border-2 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
            >
              <UserIcon className="w-5 h-5 mr-2" />
              অন্য অ্যাকাউন্ট দিয়ে লগইন
            </Button>
          </CardContent>
        </Card>

        <CustomModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={confirmLogout}
          showCancel={true}
          confirmText="হ্যাঁ, লগআউট করুন"
          cancelText="বাতিল"
        />
      </div>
    )
  }

  // User is authenticated and authorized - show children with navigation
  return (
    <div>
      {/* User info bar - Only shown when authenticated */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              লগইন: {user.email} ({user.role === "admin" ? "অ্যাডমিন" : "ইউজার"})
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            লগআউট
          </Button>
        </div>
      </div>

      {children}

      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={confirmLogout}
        showCancel={true}
        confirmText="হ্যাঁ, লগআউট করুন"
        cancelText="বাতিল"
      />
    </div>
  )
}
