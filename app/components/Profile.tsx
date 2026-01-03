"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Key, Bot, CheckCircle, AlertCircle, ExternalLink, BookOpen, User } from "lucide-react"
import Link from "next/link"

interface SecureProfileProps {
  email: string
  initialAssistantId?: string
}

export default function SecureProfile({ email, initialAssistantId }: SecureProfileProps) {
  const [assistantId, setAssistantId] = useState(initialAssistantId || "")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showAssistantId, setShowAssistantId] = useState(false)

  // Validation function
  const isAssistantIdValid = assistantId.length >= 5
  const isFormValid = isAssistantIdValid

  const handleSave = async () => {
    if (!isFormValid) {
      setError("Please provide a valid Assistant ID")
      return
    }

    setSaving(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch("/api/profile/assistant-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage("Assistant ID saved successfully!")
        setError("")
      } else {
        setMessage("")
        setError(data.error || "Failed to save Assistant ID. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account and AI integration settings</p>
          <Link href="/blog">
            <Button variant="outline" size="sm" className="mt-3 inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              View Setup Guide
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-lg">{email.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Bot className="h-5 w-5" />
              AI Assistant Configuration
            </CardTitle>
            <CardDescription>
              Configure your AI assistant for interviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="assistant-id" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Assistant ID
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setShowAssistantId(!showAssistantId)}
                  >
                    {showAssistantId ? (
                      <EyeOff className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 mr-1" />
                    )}
                    {showAssistantId ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              <Input
                id="assistant-id"
                type={showAssistantId ? 'text' : 'password'}
                value={assistantId}
                onChange={(e) => setAssistantId(e.target.value)}
                placeholder="asst_..."
                className={cn("font-mono", !assistantId || isAssistantIdValid ? '' : 'border-red-500')}
              />
              {!isAssistantIdValid && assistantId && (
                <p className="text-sm text-red-500">Assistant ID must be at least 5 characters long</p>
              )}
              <p className="text-xs text-muted-foreground">
                Create an assistant in the{' '}
                <a
                  href="https://app.vapi.ai/assistants"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Vapi dashboard
                </a>{' '}
                and paste its ID here
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <AlertDescription className="text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                <AlertDescription className="text-sm text-green-700 dark:text-green-400">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSave}
                disabled={!isFormValid || saving}
                className="w-full sm:w-auto"
              >
                {saving ? 'Saving...' : 'Save Assistant ID'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {(!assistantId) && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-5 w-5" />
                Setup Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-700 dark:text-amber-300">
                To enable AI features, please configure your AI assistant:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-amber-700 dark:text-amber-300">
                <li>
                  Visit{" "}
                  <a
                    href="https://vapi.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    vapi.ai <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  and sign in
                </li>
                <li>Copy your Web Token and Assistant ID</li>
                <li>Paste them above and click Save</li>
              </ol>
              <Link href="/blog">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Setup Guide
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200 mb-2">Security & Privacy</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your API credentials are encrypted using AES-256 encryption. Only you can access and modify this
                  information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
