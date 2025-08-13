"use client"

import { useState, useEffect } from "react"
import {
  DeviceModel,
  IOSVersion,
  AppVersion,
  Configuration,
  GenerationHistory,
  BlacklistedUserAgent,
  User,
} from "@/lib/supabase"
import PermissionWrapper from "@/components/PermissionWrapper"
import {
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Settings,
  Loader2,
  Instagram,
  Facebook,
  Download,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  X,
  Cpu,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomModal } from "@/components/CustomModal"

// Enhanced Progress Modal Component with Clean, Solid Backgrounds
function ProgressModal({ isOpen, title, message, progress, onCancel, showCancel = false, type = "info" }) {
  const [pulseAnimation, setPulseAnimation] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // Pulse animation counter
      const interval = setInterval(() => {
        setPulseAnimation((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen) return null

  const iconMap = {
    info: Loader2,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle,
  }

  const colorMap = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
  }

  const gradientMap = {
    info: "from-blue-400 via-indigo-500 to-purple-500",
    success: "from-green-400 via-emerald-500 to-teal-500",
    warning: "from-amber-400 via-orange-500 to-red-500",
    error: "from-red-400 via-rose-500 to-pink-500",
  }

  const Icon = iconMap[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Simple Dark Backdrop - No Gradients */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!showCancel ? undefined : onCancel} />

      {/* Main Modal with Completely Clean Background */}
      <div className="relative z-10 w-full max-w-lg transform transition-all duration-500 animate-in zoom-in-95">
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Simple Colored Top Border */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

          {/* Header Section - Clean White/Dark Background */}
          <div className="px-6 py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Simple Icon Container */}
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                  <Icon
                    className={`w-6 h-6 ${colorMap[type]} ${type === "info" ? "animate-spin" : ""}`}
                    style={{ animationDuration: type === "info" ? "2s" : "1s" }}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                          style={{
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: "1s",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{pulseAnimation} সেকেন্ড চলছে...</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              {showCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Content Section - Clean White/Dark Background */}
          <div className="px-6 py-6 bg-white dark:bg-slate-800">
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-base">{message}</p>

            {/* Progress Section */}
            {progress !== undefined && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    প্রগ্রেস
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>

                {/* Clean Progress Bar */}
                <div className="relative">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Simple shimmer effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{
                          animation: "shimmer 2s ease-in-out infinite",
                          transform: "translateX(-100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>উচ্চ গতি</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 animate-spin text-blue-500" style={{ animationDuration: "3s" }} />
                    <span>প্রসেসিং...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simple Info Box */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>💡 টিপস: প্রতিটি ইউজার এজেন্ট ইউনিক এবং সম্পূর্ণ বৈধ হবে!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple CSS Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default function Generator() {
  const [appType, setAppType] = useState("instagram")
  const [quantity, setQuantity] = useState(100)
  const [userAgents, setUserAgents] = useState([])
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [stats, setStats] = useState({ devices: 0, versions: 0, apps: 0, blacklisted: 0 })
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [allCopied, setAllCopied] = useState(false)

  // Progress Modal states
  const [progressModal, setProgressModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    progress: 0,
    type: "info",
    showCancel: false,
  })

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
    onConfirm: () => {},
    showCancel: false,
  })

  // Data for generation
  const [deviceModels, setDeviceModels] = useState([])
  const [iosVersions, setIosVersions] = useState([])
  const [appVersions, setAppVersions] = useState([])
  const [configurations, setConfigurations] = useState({})
  const [blacklistedUAs, setBlacklistedUAs] = useState(new Set())

  useEffect(() => {
    loadData()
  }, [])

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    onConfirm?: () => void,
    showCancel = false,
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || (() => setModal((prev) => ({ ...prev, isOpen: false }))),
      showCancel,
    })
  }

  const showProgressModal = (title: string, message: string, progress = 0, type = "info", showCancel = false) => {
    setProgressModal({
      isOpen: true,
      title,
      message,
      progress,
      type,
      showCancel,
    })
  }

  const hideProgressModal = () => {
    setProgressModal((prev) => ({ ...prev, isOpen: false }))
  }

  const loadData = async () => {
    try {
      const [devices, ios, apps, configs, blacklisted] = await Promise.all([
        DeviceModel.list(),
        IOSVersion.list(),
        AppVersion.list(),
        Configuration.list(),
        BlacklistedUserAgent.list(),
      ])

      setDeviceModels(devices.filter((d) => d.is_active))
      setIosVersions(ios.filter((v) => v.is_active))
      setAppVersions(apps.filter((a) => a.is_active))

      const configsObj = {}
      configs.forEach((config) => {
        try {
          configsObj[config.config_key] = JSON.parse(config.config_value)
        } catch (e) {
          configsObj[config.config_key] = config.config_value
        }
      })
      setConfigurations(configsObj)

      // Create blacklist set for faster lookup
      const blacklistSet = new Set(blacklisted.map((b) => b.user_agent))
      setBlacklistedUAs(blacklistSet)

      setStats({
        devices: devices.length,
        versions: ios.length,
        apps: apps.length,
        blacklisted: blacklisted.length,
      })
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const parseIOSVersion = (version) => {
    return version.split(".").map(Number)
  }

  const compareVersions = (v1, v2) => {
    const version1 = parseIOSVersion(v1)
    const version2 = parseIOSVersion(v2)

    for (let i = 0; i < Math.max(version1.length, version2.length); i++) {
      const a = version1[i] || 0
      const b = version2[i] || 0
      if (a < b) return -1
      if (a > b) return 1
    }
    return 0
  }

  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const generateUserAgent = () => {
    try {
      const device = getRandomElement(deviceModels)
      if (!device) throw new Error("No device models available")

      const validIOSVersions = iosVersions.filter((ios) => {
        const versionCompareMin = compareVersions(ios.version, device.min_ios_version)
        const versionCompareMax = compareVersions(ios.version, device.max_ios_version)
        return versionCompareMin >= 0 && versionCompareMax <= 0
      })

      if (validIOSVersions.length === 0) {
        return generateUserAgent()
      }

      const iosVersion = getRandomElement(validIOSVersions)
      const appVersionsForType = appVersions.filter((app) => app.app_type === appType)

      if (appVersionsForType.length === 0) {
        throw new Error(`No app versions available for ${appType}`)
      }

      const appVersion = getRandomElement(appVersionsForType)

      // Get device-specific resolutions and screen scaling
      const languages = configurations.languages || ["en_US", "es_US"]
      const deviceResolutions =
        device.resolutions && device.resolutions.length > 0 ? device.resolutions : ["828x1792", "1170x2532"] // fallback
      const deviceScaling =
        device.screen_scaling && device.screen_scaling.length > 0 ? device.screen_scaling : ["2.00", "3.00"] // fallback

      const language = getRandomElement(languages)
      const scale = getRandomElement(deviceScaling)
      const resolution = getRandomElement(deviceResolutions)
      const iosVersionUA = iosVersion.version.replace(/\./g, "_")

      let userAgent

      if (appType === "instagram") {
        userAgent =
          `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) ` +
          `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
          `Instagram ${appVersion.version} (${device.model_name}; iOS ${iosVersionUA}; ${language}; ${language.replace("_", "-")}; ` +
          `scale=${scale}; ${resolution}; ${appVersion.build_number})`
      } else {
        const fbss = getRandomElement(deviceScaling.map((s) => s.replace(".00", "")))
        const extra = Math.random() < 0.1 ? ";FBOP/80" : ""

        // Fixed FBRV handling
        let fbrv = appVersion.fbrv
        if (fbrv) {
          // Use the exact FBRV from database
          fbrv = fbrv.toString()
        } else {
          // Generate random FBRV if not provided
          fbrv = (Math.floor(Math.random() * 999999) + 700000000).toString()
        }

        const fbrv_part = extra ? "" : `;FBOP/5;FBRV/${fbrv}`
        const iabmv = Math.random() < 0.9 ? ";IABMV/1" : ""

        userAgent =
          `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) ` +
          `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
          `[FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${device.model_name};FBMD/iPhone;FBSN/iOS;` +
          `FBSV/${iosVersion.version};FBSS/${fbss};FBID/phone;FBLC/${language}${extra}${fbrv_part}${iabmv}]`
      }

      return userAgent
    } catch (error) {
      console.error("Error generating user agent:", error)
      return null
    }
  }

  const handleGenerate = async () => {
    if (!appType || quantity < 1 || quantity > 5000) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Show progress modal
    showProgressModal("🚀 ইউজার এজেন্ট জেনারেট হচ্ছে", `${quantity}টি ইউনিক ইউজার এজেন্ট তৈরি করা হচ্ছে...`, 0, "info", false)

    const generatedUAs = new Set()
    const requestedQuantity = quantity

    try {
      let attempts = 0
      const maxAttempts = quantity * 20 // Increased attempts for better duplicate handling

      while (generatedUAs.size < quantity && attempts < maxAttempts) {
        const ua = generateUserAgent()
        if (ua && !blacklistedUAs.has(ua) && !generatedUAs.has(ua)) {
          generatedUAs.add(ua)

          // Update progress
          const progress = Math.round((generatedUAs.size / quantity) * 100)
          setGenerationProgress(progress)

          // Update progress modal
          setProgressModal((prev) => ({
            ...prev,
            progress,
            message: `✨ ${generatedUAs.size}/${quantity} ইউজার এজেন্ট তৈরি হয়েছে...`,
          }))
        }
        attempts++

        // Add small delay for smooth animation
        if (generatedUAs.size % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      const finalUserAgents = Array.from(generatedUAs)
      setUserAgents(finalUserAgents)

      // Hide progress modal
      hideProgressModal()

      // Save to history (not downloaded yet)
      const user = await User.me()
      const historyEntry = await GenerationHistory.create({
        app_type: appType,
        quantity: finalUserAgents.length,
        user_agents: finalUserAgents,
        is_downloaded: false,
        generated_at: new Date().toISOString(),
        created_by: user.email,
      })

      setCurrentHistoryId(historyEntry.id)

      // Check if we got the requested quantity
      if (finalUserAgents.length < requestedQuantity) {
        // Show warning modal for incomplete generation
        showModal(
          "⚠️ জেনারেশন আংশিক সম্পন্ন!",
          `অনুরোধ: ${requestedQuantity}টি ইউজার এজেন্ট\n` +
            `জেনারেট হয়েছে: ${finalUserAgents.length}টি\n` +
            `কারণ: ডুপ্লিকেট এবং ব্ল্যাকলিস্ট এড়ানোর জন্য\n\n` +
            `আপনি কি ${finalUserAgents.length}টি ইউজার এজেন্ট নিতে চান?`,
          "warning",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      } else {
        // Show success modal for complete generation
        showModal(
          "🎉 জেনারেশন সম্পন্ন!",
          `সফলভাবে ${finalUserAgents.length}টি ইউনিক ইউজার এজেন্ট তৈরি করা হয়েছে।`,
          "success",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      }
    } catch (error) {
      console.error("Error generating user agents:", error)
      hideProgressModal()
      showModal("❌ জেনারেশন ব্যর্থ!", "ইউজার এজেন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error")
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const processAndBlacklistUAs = async () => {
    if (!userAgents.length || !currentHistoryId) return false

    try {
      const user = await User.me()
      console.log(`Adding ${userAgents.length} user agents to blacklist...`)

      // Show processing progress
      showProgressModal("⚙️ প্রসেসিং চলছে", "ইউজার এজেন্টগুলো ব্ল্যাকলিস্ট করা হচ্ছে...", 0, "info", false)

      // Add all user agents to blacklist with progress tracking
      const blacklistPromises = userAgents.map(async (ua, index) => {
        try {
          const hash = btoa(ua)
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 32)

          const result = await BlacklistedUserAgent.create({
            user_agent: ua,
            hash,
            downloaded_by: user.email,
            app_type: appType,
          })

          // Update progress
          const progress = Math.round(((index + 1) / userAgents.length) * 100)
          setProgressModal((prev) => ({
            ...prev,
            progress,
            message: `🔒 ${index + 1}/${userAgents.length} ইউজার এজেন্ট প্রসেস করা হয়েছে...`,
          }))

          return result
        } catch (error) {
          console.error(`Error blacklisting UA ${index + 1}:`, error)
          throw error
        }
      })

      await Promise.all(blacklistPromises)
      console.log(`Successfully blacklisted ${userAgents.length} user agents`)

      // Update history as downloaded
      await GenerationHistory.update(currentHistoryId, { is_downloaded: true })

      // Refresh blacklist state
      await loadData()

      hideProgressModal()
      return true
    } catch (error) {
      console.error("Error during blacklisting process:", error)
      hideProgressModal()
      return false
    }
  }

  const handleDownload = async () => {
    if (!userAgents.length || !currentHistoryId) return

    showModal(
      "📥 ডাউনলোড নিশ্চিতকরণ",
      `আপনি কি ${userAgents.length}টি ইউজার এজেন্ট ডাউনলোড করতে চান? এগুলো স্থায়ীভাবে ব্ল্যাকলিস্ট হয়ে যাবে।`,
      "warning",
      async () => {
        setModal((prev) => ({ ...prev, isOpen: false }))

        try {
          const success = await processAndBlacklistUAs()
          if (!success) {
            showModal("❌ ব্ল্যাকলিস্ট ব্যর্থ!", "ব্ল্যাকলিস্ট করতে সমস্যা হয়েছে!", "error")
            return
          }

          // Download file
          const content = userAgents.join("\n")
          const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${appType}_user_agents_${new Date().getTime()}.txt`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          // Show success message
          showModal(
            "✅ ডাউনলোড সফল!",
            `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে ডাউনলোড এবং ব্ল্যাকলিস্ট করা হয়েছে।`,
            "success",
          )

          // Clear current results
          setUserAgents([])
          setCurrentHistoryId(null)
        } catch (error) {
          console.error("Error creating download file:", error)
          showModal("❌ ডাউনলোড ব্যর্থ!", "ডাউনলোড করতে সমস্যা হয়েছে!", "error")
        }
      },
      true,
    )
  }

  const handleCopyAll = async () => {
    if (!userAgents.length || !currentHistoryId) return

    showModal(
      "📋 কপি নিশ্চিতকরণ",
      `আপনি কি ${userAgents.length}টি ইউজার এজেন্ট কপি করতে চান? এগুলো স্থায়ীভাবে ব্ল্যাকলিস্ট হয়ে যাবে।`,
      "warning",
      async () => {
        setModal((prev) => ({ ...prev, isOpen: false }))

        try {
          setAllCopied(true)

          const success = await processAndBlacklistUAs()
          if (!success) {
            showModal("❌ ব্ল্যাকলিস্ট ব্যর্থ!", "ব্ল্যাকলিস্ট করতে সমস্যা হয়েছে!", "error")
            setAllCopied(false)
            return
          }

          // Copy to clipboard
          const content = userAgents.join("\n")
          await navigator.clipboard.writeText(content)

          // Show success message
          showModal("✅ কপি সফল!", `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে কপি এবং ব্ল্যাকলিস্ট করা হয়েছে।`, "success")

          // Clear current results
          setUserAgents([])
          setCurrentHistoryId(null)

          setTimeout(() => setAllCopied(false), 2000)
        } catch (error) {
          console.error("Error copying to clipboard:", error)
          showModal("❌ কপি ব্যর্থ!", "কপি করতে সমস্যা হয়েছে!", "error")
          setAllCopied(false)
        }
      },
      true,
    )
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <PermissionWrapper>
      <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">প্রফেশনাল গ্রেড</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">ইউজার এজেন্ট জেনারেটর</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            হাজার হাজার ইউনিক, বৈধ iOS ইউজার এজেন্ট তৈরি করুন Instagram এবং Facebook এর জন্য
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-600/60 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.devices}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">ডিভাইস মডেল</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-600/60 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.versions}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">iOS ভার্সন</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-600/60 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.apps}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">অ্যাপ ভার্সন</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-600/60 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.blacklisted || 0}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">ব্ল্যাকলিস্ট</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generator Controls */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              জেনারেশন সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="appType" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  প্ল্যাটফর্ম টাইপ
                </Label>
                <Select value={appType} onValueChange={setAppType} disabled={isGenerating}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                    <SelectValue placeholder="প্ল্যাটফর্ম নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                        Instagram iOS
                      </div>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" />
                        Facebook iOS
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  পরিমাণ
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="5000"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                  placeholder="পরিমাণ লিখুন (১-৫০০০)"
                  disabled={isGenerating}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !appType}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-blue-700 shadow-lg h-12 text-base font-semibold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {quantity} টি ইউজার এজেন্ট তৈরি করা হচ্ছে...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  {quantity} টি ইউজার এজেন্ট তৈরি করুন
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {userAgents.length > 0 && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  তৈরিকৃত ইউজার এজেন্ট ({userAgents.length} টি)
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleCopyAll}
                    variant="outline"
                    className="shadow-md bg-transparent dark:bg-slate-700 dark:border-slate-600"
                    disabled={isGenerating}
                  >
                    {allCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                        কপি হয়েছে
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        সবগুলো কপি
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-blue-700 shadow-lg"
                    disabled={isGenerating}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    সবগুলো ডাউনলোড
                  </Button>
                </div>
              </div>

              {/* Blacklist Warning */}
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    ⚠️ গুরুত্বপূর্ণ: কপি বা ডাউনলোড করলে এই ইউজার এজেন্টগুলো স্থায়ীভাবে ব্ল্যাকলিস্ট হয়ে যাবে এবং পরবর্তীতে আর জেনারেট হবে না।
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {userAgents.slice(0, 10).map((ua, index) => (
                <div
                  key={index}
                  className="group relative p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed break-all">
                        {ua}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(ua, index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-600"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              {userAgents.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    এবং আরও {userAgents.length - 10} টি... সবগুলো দেখতে ডাউনলোড করুন
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Progress Modal */}
        <ProgressModal
          isOpen={progressModal.isOpen}
          title={progressModal.title}
          message={progressModal.message}
          progress={progressModal.progress}
          type={progressModal.type}
          showCancel={progressModal.showCancel}
          onCancel={() => hideProgressModal()}
        />

        {/* Custom Modal */}
        <CustomModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={modal.onConfirm}
          showCancel={modal.showCancel}
        />
      </div>
    </PermissionWrapper>
  )
}
