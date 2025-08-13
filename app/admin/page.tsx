"use client"

import { useState, useEffect } from "react"
import { DeviceModel, IOSVersion, AppVersion, Configuration } from "@/lib/supabase"
import PermissionWrapper from "@/components/PermissionWrapper"
import {
  Smartphone,
  Settings,
  Layers,
  Instagram,
  Facebook,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Predefined options for dropdowns
const DEVICE_MODELS = [
  "iPhone14,5",
  "iPhone14,4",
  "iPhone14,3",
  "iPhone14,2",
  "iPhone13,4",
  "iPhone13,3",
  "iPhone13,2",
  "iPhone13,1",
  "iPhone12,8",
  "iPhone12,5",
  "iPhone12,3",
  "iPhone12,1",
  "iPhone11,8",
  "iPhone11,6",
  "iPhone11,4",
  "iPhone11,2",
]

const IOS_VERSIONS = [
  "18.3",
  "18.2.1",
  "18.1.1",
  "18.0",
  "17.7.2",
  "17.6.1",
  "17.5.1",
  "17.4.1",
  "17.3.1",
  "17.2.1",
  "17.1.1",
  "17.0.1",
  "16.7.10",
  "16.6.1",
  "16.5.1",
  "16.4.1",
  "16.3.1",
  "16.2",
  "16.1.1",
  "16.0",
]

const BUILD_NUMBERS = {
  "18.3": ["22D63", "22D68"],
  "18.2.1": ["22C161", "22C162"],
  "18.1.1": ["22B91", "22B92"],
  "17.7.2": ["21H221", "21H222"],
  "17.6.1": ["21G93", "21G94"],
}

const WEBKIT_VERSIONS = ["605.1.15", "605.1.14", "605.1.13"]

const RESOLUTIONS_BY_MODEL = {
  "iPhone14,5": ["1179x2556"], // iPhone 14 Plus
  "iPhone14,4": ["1170x2532"], // iPhone 14
  "iPhone14,3": ["1290x2796"], // iPhone 14 Pro Max
  "iPhone14,2": ["1284x2778"], // iPhone 14 Pro
  "iPhone13,4": ["1284x2778"], // iPhone 12 Pro Max
  "iPhone13,3": ["1170x2532"], // iPhone 12 Pro
  "iPhone13,2": ["1170x2532"], // iPhone 12
  "iPhone13,1": ["828x1792"], // iPhone 12 mini
  "iPhone12,8": ["828x1792"], // iPhone SE 3rd gen
  "iPhone12,5": ["1242x2688"], // iPhone 11 Pro Max
  "iPhone12,3": ["1125x2436"], // iPhone 11 Pro
  "iPhone12,1": ["828x1792"], // iPhone 11
}

const SCREEN_SCALING_BY_MODEL = {
  "iPhone14,5": ["3.00"],
  "iPhone14,4": ["3.00"],
  "iPhone14,3": ["3.00"],
  "iPhone14,2": ["3.00"],
  "iPhone13,4": ["3.00"],
  "iPhone13,3": ["3.00"],
  "iPhone13,2": ["3.00"],
  "iPhone13,1": ["3.00"],
  "iPhone12,8": ["3.00"],
  "iPhone12,5": ["3.00"],
  "iPhone12,3": ["3.00"],
  "iPhone12,1": ["2.00"],
}

export default function AdminPanel() {
  const [deviceModels, setDeviceModels] = useState([])
  const [iosVersions, setIosVersions] = useState([])
  const [appVersions, setAppVersions] = useState([])
  const [configurations, setConfigurations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("devices")
  const [activeAppTab, setActiveAppTab] = useState("instagram")

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Loading all data...")

      const [devices, ios, apps, configs] = await Promise.all([
        DeviceModel.list("-created_date"),
        IOSVersion.list("-created_date"),
        AppVersion.list("-created_date"),
        Configuration.list("-created_date"),
      ])

      console.log("Loaded devices:", devices)
      console.log("Loaded iOS versions:", ios)
      console.log("Loaded app versions:", apps)
      console.log("Loaded configurations:", configs)

      setDeviceModels(devices)
      setIosVersions(ios)
      setAppVersions(apps)
      setConfigurations(configs)

      if (devices.length === 0 && ios.length === 0 && apps.length === 0) {
        setError("কোন ডেটা পাওয়া যায়নি। দয়া করে sample data insert করুন।")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("ডেটা লোড করতে সমস্যা হয়েছে: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate usage percentages
  const calculateIOSUsage = () => {
    const activeVersions = iosVersions.filter((v) => v.is_active)
    const total = activeVersions.reduce((sum, v) => sum + (v.usage_percentage || 0), 0)
    return { total: Math.round(total * 100) / 100, count: activeVersions.length }
  }

  const calculateAppUsage = (appType) => {
    const activeVersions = appVersions.filter((v) => v.is_active && v.app_type === appType)
    const total = activeVersions.reduce((sum, v) => sum + (v.usage_percentage || 0), 0)
    return { total: Math.round(total * 100) / 100, count: activeVersions.length }
  }

  const iosUsage = calculateIOSUsage()
  const instagramUsage = calculateAppUsage("instagram")
  const facebookUsage = calculateAppUsage("facebook")

  // Device Model Functions
  const handleDeviceAdd = async (data) => {
    try {
      await DeviceModel.create(data)
      loadAllData()
      setShowAddDialog(false)
      alert("ডিভাইস মডেল যোগ করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleDeviceUpdate = async (id, data) => {
    try {
      await DeviceModel.update(id, data)
      loadAllData()
      setEditingItem(null)
      alert("ডিভাইস মডেল আপডেট করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleDeviceDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই ডিভাইস মডেল মুছে ফেলতে চান?")) {
      try {
        await DeviceModel.delete(id)
        loadAllData()
        alert("ডিভাইস মডেল মুছে ফেলা হয়েছে!")
      } catch (error) {
        alert("Error: " + error.message)
      }
    }
  }

  // iOS Version Functions
  const handleIOSAdd = async (data) => {
    try {
      await IOSVersion.create(data)
      loadAllData()
      setShowAddDialog(false)
      alert("iOS ভার্সন যোগ করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleIOSUpdate = async (id, data) => {
    try {
      await IOSVersion.update(id, data)
      loadAllData()
      setEditingItem(null)
      alert("iOS ভার্সন আপডেট করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleIOSDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই iOS ভার্সন মুছে ফেলতে চান?")) {
      try {
        await IOSVersion.delete(id)
        loadAllData()
        alert("iOS ভার্সন মুছে ফেলা হয়েছে!")
      } catch (error) {
        alert("Error: " + error.message)
      }
    }
  }

  // App Version Functions
  const handleAppAdd = async (data) => {
    try {
      await AppVersion.create(data)
      loadAllData()
      setShowAddDialog(false)
      alert("অ্যাপ ভার্সন যোগ করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleAppUpdate = async (id, data) => {
    try {
      await AppVersion.update(id, data)
      loadAllData()
      setEditingItem(null)
      alert("অ্যাপ ভার্সন আপডেট করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleAppDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই অ্যাপ ভার্সন মুছে ফেলতে চান?")) {
      try {
        await AppVersion.delete(id)
        loadAllData()
        alert("অ্যাপ ভার্সন মুছে ফেলা হয়েছে!")
      } catch (error) {
        alert("Error: " + error.message)
      }
    }
  }

  // Configuration Functions
  const handleConfigAdd = async (data) => {
    try {
      await Configuration.create(data)
      loadAllData()
      setShowAddDialog(false)
      alert("কনফিগারেশন যোগ করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleConfigUpdate = async (id, data) => {
    try {
      await Configuration.update(id, data)
      loadAllData()
      setEditingItem(null)
      alert("কনফিগারেশন আপডেট করা হয়েছে!")
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleConfigDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই কনফিগারেশন মুছে ফেলতে চান?")) {
      try {
        await Configuration.delete(id)
        loadAllData()
        alert("কনফিগারেশন মুছে ফেলা হয়েছে!")
      } catch (error) {
        alert("Error: " + error.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">অ্যাডমিন প্যানেল লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PermissionWrapper requiredRole="admin">
        <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">ডেটা লোড করতে সমস্যা</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-600 dark:text-slate-300">{error}</p>
              <div className="space-y-2">
                <Button onClick={loadAllData} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  আবার চেষ্টা করুন
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400">Browser Console (F12) এ error details দেখুন</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PermissionWrapper>
    )
  }

  return (
    <PermissionWrapper requiredRole="admin">
      <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">অ্যাডমিন প্যানেল</h1>
              <Button onClick={loadAllData} variant="outline" size="sm" className="bg-white/80 dark:bg-slate-800/80">
                <RefreshCw className="w-4 h-4 mr-2" />
                রিফ্রেশ
              </Button>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              ইউজার এজেন্ট জেনারেটরের সমস্ত কনফিগারেশন ডেটা পরিচালনা করুন
            </p>

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300">
              <p>
                Debug: Devices: {deviceModels.length}, iOS: {iosVersions.length}, Apps: {appVersions.length}
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto md:h-12 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <TabsTrigger
                value="devices"
                className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                ডিভাইস মডেল ({deviceModels.length})
              </TabsTrigger>
              <TabsTrigger
                value="ios"
                className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Layers className="w-4 h-4 mr-2" />
                iOS ভার্সন ({iosVersions.length})
              </TabsTrigger>
              <TabsTrigger
                value="apps"
                className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                অ্যাপ ভার্সন ({appVersions.length})
              </TabsTrigger>
              <TabsTrigger
                value="configs"
                className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                কনফিগারেশন ({configurations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="mt-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                      <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ডিভাইস মডেল
                    </CardTitle>
                    <Dialog open={showAddDialog && activeTab === "devices"} onOpenChange={setShowAddDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                          <Plus className="w-4 h-4 mr-2" />
                          নতুন যোগ করুন
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-slate-900 dark:text-slate-100">
                            নতুন ডিভাইস মডেল যোগ করুন
                          </DialogTitle>
                        </DialogHeader>
                        <DeviceForm onSubmit={handleDeviceAdd} onCancel={() => setShowAddDialog(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {deviceModels.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">কোন ডিভাইস মডেল পাওয়া যায়নি</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Supabase SQL Editor এ sample data script চালান
                        </p>
                      </div>
                    ) : (
                      deviceModels.map((device) => (
                        <div
                          key={device.id}
                          className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                        >
                          {editingItem?.id === device.id ? (
                            <DeviceEditForm
                              device={device}
                              onSave={(data) => handleDeviceUpdate(device.id, data)}
                              onCancel={() => setEditingItem(null)}
                            />
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                  {device.model_name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                  iOS {device.min_ios_version} - {device.max_ios_version}
                                </p>
                                {device.resolutions && device.resolutions.length > 0 && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Resolutions: {device.resolutions.join(", ")}
                                  </p>
                                )}
                                {device.screen_scaling && device.screen_scaling.length > 0 && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Scaling: {device.screen_scaling.join(", ")}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={device.is_active ? "default" : "secondary"}>
                                  {device.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={() => setEditingItem(device)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeviceDelete(device.id)}
                                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ios" className="mt-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                      <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      iOS ভার্সন
                    </CardTitle>
                    <Dialog open={showAddDialog && activeTab === "ios"} onOpenChange={setShowAddDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                          <Plus className="w-4 h-4 mr-2" />
                          নতুন যোগ করুন
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-slate-900 dark:text-slate-100">নতুন iOS ভার্সন যোগ করুন</DialogTitle>
                        </DialogHeader>
                        <IOSForm onSubmit={handleIOSAdd} onCancel={() => setShowAddDialog(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>

                {/* Usage Percentage Summary */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${iosUsage.total === 100 ? "bg-green-100 dark:bg-green-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}
                      >
                        {iosUsage.total === 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          মোট Usage: {iosUsage.total}%
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{iosUsage.count} টি সক্রিয় ভার্সন</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={Math.min(iosUsage.total, 100)} className="w-32 h-2 mb-1" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {iosUsage.total === 100 ? "✅ সঠিক" : `⚠️ ${100 - iosUsage.total}% বাকি`}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {iosVersions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">কোন iOS ভার্সন পাওয়া যায়নি</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Supabase SQL Editor এ sample data script চালান
                        </p>
                      </div>
                    ) : (
                      iosVersions.map((ios) => (
                        <div
                          key={ios.id}
                          className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                        >
                          {editingItem?.id === ios.id ? (
                            <IOSEditForm
                              ios={ios}
                              onSave={(data) => handleIOSUpdate(ios.id, data)}
                              onCancel={() => setEditingItem(null)}
                            />
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">iOS {ios.version}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                  Build: {ios.build_number} | WebKit: {ios.webkit_version}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Progress value={ios.usage_percentage || 0} className="flex-1 h-2" />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem]">
                                    {ios.usage_percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant={ios.is_active ? "default" : "secondary"}>
                                  {ios.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={() => setEditingItem(ios)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleIOSDelete(ios.id)}
                                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apps" className="mt-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                    <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    অ্যাপ ভার্সন ম্যানেজমেন্ট
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <Tabs value={activeAppTab} onValueChange={setActiveAppTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                      <TabsTrigger
                        value="instagram"
                        className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                      >
                        <Instagram className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                        Instagram ({appVersions.filter((v) => v.app_type === "instagram").length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="facebook"
                        className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                      >
                        <Facebook className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Facebook ({appVersions.filter((v) => v.app_type === "facebook").length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="instagram" className="mt-0">
                      {/* Instagram Usage Summary */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border border-pink-200 dark:border-pink-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${instagramUsage.total === 100 ? "bg-green-100 dark:bg-green-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}
                            >
                              {instagramUsage.total === 100 ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                Instagram মোট Usage: {instagramUsage.total}%
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {instagramUsage.count} টি সক্রিয় ভার্সন
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Progress value={Math.min(instagramUsage.total, 100)} className="w-32 h-2 mb-1" />
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {instagramUsage.total === 100 ? "✅ সঠিক" : `⚠️ ${100 - instagramUsage.total}% বাকি`}
                              </p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Instagram যোগ করুন
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white dark:bg-slate-800">
                                <DialogHeader>
                                  <DialogTitle className="text-slate-900 dark:text-slate-100">
                                    নতুন Instagram ভার্সন যোগ করুন
                                  </DialogTitle>
                                </DialogHeader>
                                <AppForm
                                  appType="instagram"
                                  onSubmit={handleAppAdd}
                                  onCancel={() => setShowAddDialog(false)}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>

                      <AppVersionList
                        appVersions={appVersions.filter((v) => v.app_type === "instagram")}
                        onEdit={setEditingItem}
                        onDelete={handleAppDelete}
                        onUpdate={handleAppUpdate}
                        editingItem={editingItem}
                      />
                    </TabsContent>

                    <TabsContent value="facebook" className="mt-0">
                      {/* Facebook Usage Summary */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${facebookUsage.total === 100 ? "bg-green-100 dark:bg-green-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}
                            >
                              {facebookUsage.total === 100 ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                Facebook মোট Usage: {facebookUsage.total}%
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {facebookUsage.count} টি সক্রিয় ভার্সন
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Progress value={Math.min(facebookUsage.total, 100)} className="w-32 h-2 mb-1" />
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {facebookUsage.total === 100 ? "✅ সঠিক" : `⚠️ ${100 - facebookUsage.total}% বাকি`}
                              </p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Facebook যোগ করুন
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white dark:bg-slate-800">
                                <DialogHeader>
                                  <DialogTitle className="text-slate-900 dark:text-slate-100">
                                    নতুন Facebook ভার্সন যোগ করুন
                                  </DialogTitle>
                                </DialogHeader>
                                <AppForm
                                  appType="facebook"
                                  onSubmit={handleAppAdd}
                                  onCancel={() => setShowAddDialog(false)}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>

                      <AppVersionList
                        appVersions={appVersions.filter((v) => v.app_type === "facebook")}
                        onEdit={setEditingItem}
                        onDelete={handleAppDelete}
                        onUpdate={handleAppUpdate}
                        editingItem={editingItem}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configs" className="mt-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                      <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      কনফিগারেশন ম্যানেজমেন্ট
                    </CardTitle>
                    <Dialog open={showAddDialog && activeTab === "configs"} onOpenChange={setShowAddDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                          <Plus className="w-4 h-4 mr-2" />
                          নতুন কনফিগ যোগ করুন
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-slate-900 dark:text-slate-100">
                            নতুন কনফিগারেশন যোগ করুন
                          </DialogTitle>
                        </DialogHeader>
                        <ConfigForm onSubmit={handleConfigAdd} onCancel={() => setShowAddDialog(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {configurations.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">কোন কনফিগারেশন পাওয়া যায়নি</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Supabase SQL Editor এ sample data script চালান
                        </p>
                      </div>
                    ) : (
                      configurations.map((config) => (
                        <div
                          key={config.id}
                          className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                        >
                          {editingItem?.id === config.id ? (
                            <ConfigEditForm
                              config={config}
                              onSave={(data) => handleConfigUpdate(config.id, data)}
                              onCancel={() => setEditingItem(null)}
                            />
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                  {config.config_key}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{config.description}</p>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                                  <code className="text-xs text-slate-700 dark:text-slate-300 break-all">
                                    {config.config_value}
                                  </code>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button variant="ghost" size="sm" onClick={() => setEditingItem(config)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleConfigDelete(config.id)}
                                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PermissionWrapper>
  )
}

// Enhanced Form Components with Dropdowns
function DeviceForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    model_name: "",
    min_ios_version: "",
    max_ios_version: "",
    resolutions: [],
    screen_scaling: [],
    is_active: true,
  })

  const handleModelChange = (modelName) => {
    setFormData({
      ...formData,
      model_name: modelName,
      resolutions: RESOLUTIONS_BY_MODEL[modelName] || [],
      screen_scaling: SCREEN_SCALING_BY_MODEL[modelName] || [],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="model_name">মডেল নাম</Label>
        <Select value={formData.model_name} onValueChange={handleModelChange}>
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="মডেল নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            {DEVICE_MODELS.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_ios_version">সর্বনিম্ন iOS ভার্সন</Label>
          <Select
            value={formData.min_ios_version}
            onValueChange={(value) => setFormData({ ...formData, min_ios_version: value })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue placeholder="নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="max_ios_version">সর্বোচ্চ iOS ভার্সন</Label>
          <Select
            value={formData.max_ios_version}
            onValueChange={(value) => setFormData({ ...formData, max_ios_version: value })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue placeholder="নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.model_name && (
        <div className="space-y-2">
          <Label>রেজোলিউশন</Label>
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {formData.resolutions.join(", ") || "কোন রেজোলিউশন নেই"}
            </p>
          </div>
          <Label>স্ক্রীন স্কেলিং</Label>
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {formData.screen_scaling.join(", ") || "কোন স্কেলিং নেই"}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">সক্রিয়</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit">সংরক্ষণ করুন</Button>
      </DialogFooter>
    </form>
  )
}

function DeviceEditForm({ device, onSave, onCancel }) {
  const [formData, setFormData] = useState(device)

  const handleModelChange = (modelName) => {
    setFormData({
      ...formData,
      model_name: modelName,
      resolutions: RESOLUTIONS_BY_MODEL[modelName] || formData.resolutions,
      screen_scaling: SCREEN_SCALING_BY_MODEL[modelName] || formData.screen_scaling,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="model_name">মডেল নাম</Label>
          <Select value={formData.model_name} onValueChange={handleModelChange}>
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_MODELS.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">সক্রিয়</Label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_ios_version">সর্বনিম্ন iOS</Label>
          <Select
            value={formData.min_ios_version}
            onValueChange={(value) => setFormData({ ...formData, min_ios_version: value })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="max_ios_version">সর্বোচ্চ iOS</Label>
          <Select
            value={formData.max_ios_version}
            onValueChange={(value) => setFormData({ ...formData, max_ios_version: value })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="w-4 h-4 mr-2" />
          সংরক্ষণ
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          বাতিল
        </Button>
      </div>
    </form>
  )
}

function IOSForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    version: "",
    build_number: "",
    webkit_version: "605.1.15",
    usage_percentage: 10.0,
    is_active: true,
  })

  const handleVersionChange = (version) => {
    setFormData({
      ...formData,
      version,
      build_number: BUILD_NUMBERS[version] ? BUILD_NUMBERS[version][0] : "",
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="version">ভার্সন</Label>
        <Select value={formData.version} onValueChange={handleVersionChange}>
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="iOS ভার্সন নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            {IOS_VERSIONS.map((version) => (
              <SelectItem key={version} value={version}>
                {version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="build_number">বিল্ড নম্বর</Label>
        <Select
          value={formData.build_number}
          onValueChange={(value) => setFormData({ ...formData, build_number: value })}
        >
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="বিল্ড নম্বর নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            {formData.version && BUILD_NUMBERS[formData.version] ? (
              BUILD_NUMBERS[formData.version].map((build) => (
                <SelectItem key={build} value={build}>
                  {build}
                </SelectItem>
              ))
            ) : (
              <SelectItem value={formData.build_number} disabled>
                প্রথমে ভার্সন নির্বাচন করুন
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="webkit_version">WebKit ভার্সন</Label>
        <Select
          value={formData.webkit_version}
          onValueChange={(value) => setFormData({ ...formData, webkit_version: value })}
        >
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEBKIT_VERSIONS.map((webkit) => (
              <SelectItem key={webkit} value={webkit}>
                {webkit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="usage_percentage">ব্যবহারের শতাংশ</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.usage_percentage}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">সক্রিয়</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit">সংরক্ষণ করুন</Button>
      </DialogFooter>
    </form>
  )
}

function IOSEditForm({ ios, onSave, onCancel }) {
  const [formData, setFormData] = useState(ios)

  const handleVersionChange = (version) => {
    setFormData({
      ...formData,
      version,
      build_number: BUILD_NUMBERS[version] ? BUILD_NUMBERS[version][0] : formData.build_number,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="version">ভার্সন</Label>
          <Select value={formData.version} onValueChange={handleVersionChange}>
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="build_number">বিল্ড</Label>
          <Select
            value={formData.build_number}
            onValueChange={(value) => setFormData({ ...formData, build_number: value })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formData.version && BUILD_NUMBERS[formData.version] ? (
                BUILD_NUMBERS[formData.version].map((build) => (
                  <SelectItem key={build} value={build}>
                    {build}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={formData.build_number}>{formData.build_number}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="usage_percentage">ব্যবহার %</Label>
          <Input
            id="usage_percentage"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.usage_percentage}
            onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">সক্রিয়</Label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            <Save className="w-4 h-4 mr-2" />
            সংরক্ষণ
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            বাতিল
          </Button>
        </div>
      </div>
    </form>
  )
}

function AppForm({ appType, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    app_type: appType,
    version: "",
    build_number: "",
    fbrv: appType === "facebook" ? "" : null,
    usage_percentage: 10.0,
    is_active: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleFbrvChange = (value) => {
    setFormData({ ...formData, fbrv: value || null })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="version">ভার্সন</Label>
        <Input
          id="version"
          value={formData.version}
          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          placeholder={appType === "instagram" ? "389.0.0.49.87" : "518.0.0.52.100"}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>
      <div>
        <Label htmlFor="build_number">বিল্ড নম্বর</Label>
        <Input
          id="build_number"
          value={formData.build_number}
          onChange={(e) => setFormData({ ...formData, build_number: e.target.value })}
          placeholder={appType === "instagram" ? "379506944" : "518052100"}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      {appType === "facebook" && (
        <div>
          <Label htmlFor="fbrv">FBRV (ঐচ্ছিক)</Label>
          <Input
            id="fbrv"
            value={formData.fbrv || ""}
            onChange={(e) => handleFbrvChange(e.target.value)}
            placeholder="752257486 বা আংশিক যেমন 75, 752, 75225"
            className="bg-white dark:bg-slate-700"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            পূর্ণ FBRV দিলে সেটি ব্যবহার হবে, আংশিক দিলে বাকি অংশ র‍্যান্ডম হবে
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="usage_percentage">ব্যবহারের শতাংশ</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.usage_percentage}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">সক্রিয়</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit">সংরক্ষণ করুন</Button>
      </DialogFooter>
    </form>
  )
}

function AppVersionList({ appVersions, onEdit, onDelete, onUpdate, editingItem }) {
  return (
    <div className="space-y-4">
      {appVersions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400 mb-4">কোন অ্যাপ ভার্সন পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Supabase SQL Editor এ sample data script চালান</p>
        </div>
      ) : (
        appVersions.map((app) => (
          <div
            key={app.id}
            className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
          >
            {editingItem?.id === app.id ? (
              <AppEditForm app={app} onSave={(data) => onUpdate(app.id, data)} onCancel={() => onEdit(null)} />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{app.version}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Build: {app.build_number}
                    {app.app_type === "facebook" && app.fbrv && <> | FBRV: {app.fbrv}</>}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={app.usage_percentage || 0} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem]">
                      {app.usage_percentage}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={app.is_active ? "default" : "secondary"}>{app.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(app)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(app.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function AppEditForm({ app, onSave, onCancel }) {
  const [formData, setFormData] = useState(app)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleFbrvChange = (value) => {
    setFormData({ ...formData, fbrv: value || null })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="version">ভার্সন</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
        <div>
          <Label htmlFor="build_number">বিল্ড</Label>
          <Input
            id="build_number"
            value={formData.build_number}
            onChange={(e) => setFormData({ ...formData, build_number: e.target.value })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
      </div>

      {formData.app_type === "facebook" && (
        <div>
          <Label htmlFor="fbrv">FBRV</Label>
          <Input
            id="fbrv"
            value={formData.fbrv || ""}
            onChange={(e) => handleFbrvChange(e.target.value)}
            placeholder="752257486 বা আংশিক"
            className="bg-white dark:bg-slate-700"
          />
        </div>
      )}

      <div>
        <Label htmlFor="usage_percentage">ব্যবহার %</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.usage_percentage}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">সক্রিয়</Label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            <Save className="w-4 h-4 mr-2" />
            সংরক্ষণ
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            বাতিল
          </Button>
        </div>
      </div>
    </form>
  )
}

function ConfigForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    config_key: "",
    config_value: "",
    description: "",
  })
  const [configType, setConfigType] = useState("custom")
  const [arrayItems, setArrayItems] = useState([])
  const [newItem, setNewItem] = useState("")

  const predefinedConfigs = {
    languages: {
      description: "Supported language codes for user agents",
      placeholder: "en_US",
      suggestions: ["en_US", "es_US", "fr_FR", "de_DE", "it_IT", "pt_BR", "ja_JP", "ko_KR"],
    },
  }

  const handleConfigTypeChange = (type) => {
    setConfigType(type)
    if (type !== "custom") {
      setFormData({
        config_key: type,
        config_value: "",
        description: predefinedConfigs[type].description,
      })
      setArrayItems([])
    }
  }

  const addArrayItem = () => {
    if (newItem.trim() && !arrayItems.includes(newItem.trim())) {
      setArrayItems([...arrayItems, newItem.trim()])
      setNewItem("")
    }
  }

  const removeArrayItem = (index) => {
    setArrayItems(arrayItems.filter((_, i) => i !== index))
  }

  const addSuggestion = (suggestion) => {
    if (!arrayItems.includes(suggestion)) {
      setArrayItems([...arrayItems, suggestion])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalData = {
      ...formData,
      config_value: configType === "custom" ? formData.config_value : JSON.stringify(arrayItems),
    }
    onSubmit(finalData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>কনফিগারেশন টাইপ</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            type="button"
            variant={configType === "languages" ? "default" : "outline"}
            size="sm"
            onClick={() => handleConfigTypeChange("languages")}
          >
            ভাষা
          </Button>
          <Button
            type="button"
            variant={configType === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => handleConfigTypeChange("custom")}
          >
            কাস্টম
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="config_key">কনফিগ কী</Label>
        <Input
          id="config_key"
          value={formData.config_key}
          onChange={(e) => setFormData({ ...formData, config_key: e.target.value })}
          placeholder="languages ইত্যাদি"
          disabled={configType !== "custom"}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">বিবরণ</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="এই কনফিগারেশন সম্পর্কে বিবরণ"
          className="bg-white dark:bg-slate-700"
        />
      </div>

      {configType === "custom" ? (
        <div>
          <Label htmlFor="config_value">কনফিগ ভ্যালু</Label>
          <Textarea
            id="config_value"
            value={formData.config_value}
            onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
            placeholder='{"key": "value"} অথবা ["item1", "item2"]'
            className="min-h-24 bg-white dark:bg-slate-700"
            required
          />
        </div>
      ) : (
        <div>
          <Label>আইটেম যোগ করুন</Label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={predefinedConfigs[configType]?.placeholder}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem())}
              className="bg-white dark:bg-slate-700"
            />
            <Button type="button" onClick={addArrayItem} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {predefinedConfigs[configType]?.suggestions && (
            <div className="mb-3">
              <Label className="text-xs text-slate-500 dark:text-slate-400">সাজেশন:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {predefinedConfigs[configType].suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => addSuggestion(suggestion)}
                    disabled={arrayItems.includes(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-32 overflow-y-auto">
            {arrayItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-slate-900 dark:text-slate-100">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(index)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {arrayItems.length > 0 && (
            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Label className="text-xs text-slate-500 dark:text-slate-400">JSON প্রিভিউ:</Label>
              <code className="text-xs text-slate-700 dark:text-slate-300 block mt-1 break-all">
                {JSON.stringify(arrayItems)}
              </code>
            </div>
          )}
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit" disabled={configType !== "custom" && arrayItems.length === 0}>
          সংরক্ষণ করুন
        </Button>
      </DialogFooter>
    </form>
  )
}

function ConfigEditForm({ config, onSave, onCancel }) {
  const [formData, setFormData] = useState(config)
  const [arrayItems, setArrayItems] = useState([])
  const [newItem, setNewItem] = useState("")
  const [isArrayConfig, setIsArrayConfig] = useState(false)

  useEffect(() => {
    // Check if config_value is a JSON array
    try {
      const parsed = JSON.parse(config.config_value)
      if (Array.isArray(parsed)) {
        setArrayItems(parsed)
        setIsArrayConfig(true)
      }
    } catch (e) {
      setIsArrayConfig(false)
    }
  }, [config.config_value])

  const predefinedConfigs = {
    languages: {
      placeholder: "en_US",
      suggestions: ["en_US", "es_US", "fr_FR", "de_DE", "it_IT", "pt_BR", "ja_JP", "ko_KR"],
    },
  }

  const addArrayItem = () => {
    if (newItem.trim() && !arrayItems.includes(newItem.trim())) {
      setArrayItems([...arrayItems, newItem.trim()])
      setNewItem("")
    }
  }

  const removeArrayItem = (index) => {
    setArrayItems(arrayItems.filter((_, i) => i !== index))
  }

  const addSuggestion = (suggestion) => {
    if (!arrayItems.includes(suggestion)) {
      setArrayItems([...arrayItems, suggestion])
    }
  }

  const toggleEditMode = () => {
    if (isArrayConfig) {
      // Switch to raw JSON mode
      setFormData({
        ...formData,
        config_value: JSON.stringify(arrayItems, null, 2),
      })
      setIsArrayConfig(false)
    } else {
      // Try to switch to array mode
      try {
        const parsed = JSON.parse(formData.config_value)
        if (Array.isArray(parsed)) {
          setArrayItems(parsed)
          setIsArrayConfig(true)
        }
      } catch (e) {
        alert("Invalid JSON format")
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalData = {
      ...formData,
      config_value: isArrayConfig ? JSON.stringify(arrayItems) : formData.config_value,
    }
    onSave(finalData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="config_key">কনফিগ কী</Label>
        <Input
          id="config_key"
          value={formData.config_key}
          onChange={(e) => setFormData({ ...formData, config_key: e.target.value })}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">বিবরণ</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white dark:bg-slate-700"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>কনফিগ ভ্যালু</Label>
          <Button type="button" variant="ghost" size="sm" onClick={toggleEditMode} className="text-xs">
            {isArrayConfig ? "Raw JSON" : "Array Mode"}
          </Button>
        </div>

        {isArrayConfig ? (
          <div>
            <div className="flex gap-2 mb-3">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={predefinedConfigs[formData.config_key]?.placeholder || "নতুন আইটেম"}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem())}
                className="bg-white dark:bg-slate-700"
              />
              <Button type="button" onClick={addArrayItem} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {predefinedConfigs[formData.config_key]?.suggestions && (
              <div className="mb-3">
                <Label className="text-xs text-slate-500 dark:text-slate-400">সাজেশন:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {predefinedConfigs[formData.config_key].suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => addSuggestion(suggestion)}
                      disabled={arrayItems.includes(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {arrayItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-slate-900 dark:text-slate-100">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem(index)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            {arrayItems.length > 0 && (
              <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Label className="text-xs text-slate-500 dark:text-slate-400">JSON প্রিভিউ:</Label>
                <code className="text-xs text-slate-700 dark:text-slate-300 block mt-1 break-all">
                  {JSON.stringify(arrayItems)}
                </code>
              </div>
            )}
          </div>
        ) : (
          <Textarea
            value={formData.config_value}
            onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
            className="min-h-24 font-mono text-sm bg-white dark:bg-slate-700"
            required
          />
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="w-4 h-4 mr-2" />
          সংরক্ষণ
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          বাতিল
        </Button>
      </div>
    </form>
  )
}
