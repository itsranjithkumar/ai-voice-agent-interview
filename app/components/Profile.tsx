"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Key, Bot, CheckCircle, AlertCircle, ExternalLink, BookOpen } from "lucide-react"
import Link from "next/link"

interface SecureProfileProps {
  email: string
  initialVapiKey?: string
  initialAssistantId?: string
}

export default function SecureProfile({ email, initialVapiKey, initialAssistantId }: SecureProfileProps) {
  const [vapiKey, setVapiKey] = useState(initialVapiKey || "")
  const [assistantId, setAssistantId] = useState(initialAssistantId || "")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showVapiKey, setShowVapiKey] = useState(false)
  const [showAssistantId, setShowAssistantId] = useState(false)

  // Validation functions
  const isVapiKeyValid = vapiKey.length >= 10
  const isAssistantIdValid = assistantId.length >= 5
  const isFormValid = isVapiKeyValid && isAssistantIdValid

  const handleSave = async () => {
    if (!isFormValid) {
      setError("Please provide valid Vapi Key and Assistant ID")
      return
    }

    setSaving(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch("/api/profile/vapi-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vapiKey, assistantId }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage("Configuration saved securely!")
        setError("")
      } else {
        setMessage("")
        setError(data.error || "Failed to save configuration. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12">
          <div className="xl:col-span-3 space-y-8">
            <div className="text-center xl:text-left mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
                Profile Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl">
                Manage your account and AI integration settings with enterprise-grade security
              </p>
            </div>

            <Card className="border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-slate-800 dark:text-slate-100">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-blue-100 dark:border-slate-600">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{email.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Email Address
                    </p>
                    <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">{email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-slate-800 dark:text-slate-100">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  AI Integration
                </CardTitle>
                <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                  Configure your Vapi AI settings. Your credentials are encrypted and stored securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <Label
                    htmlFor="vapiKey"
                    className="flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Vapi Web Token
                    {isVapiKeyValid && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                  </Label>
                  <div className="relative">
                    <Input
                      id="vapiKey"
                      type={showVapiKey ? "text" : "password"}
                      value={vapiKey}
                      onChange={(e) => setVapiKey(e.target.value)}
                      placeholder="Enter your Vapi Web Token"
                      className={cn(
                        "pr-14 h-14 text-base border-2 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200",
                        !isVapiKeyValid && vapiKey
                          ? "border-red-300 focus-visible:ring-red-500 dark:border-red-600"
                          : "border-slate-200 dark:border-slate-600 focus-visible:ring-blue-500",
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-600"
                      onClick={() => setShowVapiKey(!showVapiKey)}
                    >
                      {showVapiKey ? (
                        <EyeOff className="h-5 w-5 text-slate-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label
                    htmlFor="assistantId"
                    className="flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <Bot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Assistant ID
                    {isAssistantIdValid && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                  </Label>
                  <div className="relative">
                    <Input
                      id="assistantId"
                      type={showAssistantId ? "text" : "password"}
                      value={assistantId}
                      onChange={(e) => setAssistantId(e.target.value)}
                      placeholder="Enter your Assistant ID"
                      className={cn(
                        "pr-14 h-14 text-base border-2 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200",
                        !isAssistantIdValid && assistantId
                          ? "border-red-300 focus-visible:ring-red-500 dark:border-red-600"
                          : "border-slate-200 dark:border-slate-600 focus-visible:ring-blue-500",
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-600"
                      onClick={() => setShowAssistantId(!showAssistantId)}
                    >
                      {showAssistantId ? (
                        <EyeOff className="h-5 w-5 text-slate-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving || !isFormValid}
                  className="w-full h-14 text-base font-semibold bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white shadow-lg transition-all duration-200"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Saving Securely...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-3" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                <CheckCircle className="h-5 w-5" />
                <AlertDescription className="text-base font-medium">{message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="xl:col-span-2 space-y-8">
            <Card className="border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-slate-800 dark:text-slate-100">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  Learn how to set up your Vapi integration with our comprehensive step-by-step guide.
                </p>
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-all duration-200 bg-transparent"
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    View Setup Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {(!vapiKey || !assistantId) && (
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertDescription>
                  <div className="space-y-4">
                    <p className="font-semibold text-amber-800 dark:text-amber-200">Setup Required</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      To enable AI features, please configure your Vapi credentials:
                    </p>
                    <ol className="list-decimal list-inside space-y-3 text-sm ml-2 text-amber-700 dark:text-amber-300">
                      <li>
                        Visit{" "}
                        <a
                          href="https://vapi.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          vapi.ai <ExternalLink className="h-3 w-3" />
                        </a>{" "}
                        and sign in
                      </li>
                      <li>
                        Copy your <strong>Web Token</strong>
                      </li>
                      <li>
                        Copy your <strong>Assistant ID</strong>
                      </li>
                      <li>Paste both above and click Save</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950 dark:to-teal-950">
              <CardContent className="pt-8">
                <div className="flex items-start gap-4 text-sm">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                    <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 text-base">
                      Security & Privacy
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                      Your API credentials are encrypted using industry-standard AES-256 encryption. Only you can access
                      and modify this information. We never store or transmit your data in plain text.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
