import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, Key, Bot, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Vapi Integration Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how to set up your Vapi AI integration with step-by-step instructions and best practices.
          </p>
        </div>

        {/* Main Article */}
        <article className="max-w-4xl mx-auto">
          <Card className="border-border shadow-sm mb-8">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <span>Updated December 2024</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
              <CardTitle className="text-3xl mb-4">🔑 How to Create Your Vapi Key and Get Your Assistant ID</CardTitle>
              <CardDescription className="text-lg">
                If you're building an AI Voice or Chat application using <strong>Vapi</strong>, you'll need two
                important credentials: your Web Token and Assistant ID. This guide walks you through the complete setup
                process.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="border-l-4 border-primary pl-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Create a Vapi Account
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      1. Go to{" "}
                      <a
                        href="https://vapi.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        vapi.ai <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <p>2. Sign up with your email (or use Google/GitHub login)</p>
                    <p>3. Verify your email to activate your account</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border-l-4 border-secondary pl-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    Generate a Vapi Web Token
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      1. After logging into the dashboard, navigate to <strong>Settings</strong> →{" "}
                      <strong>API Keys</strong> (or Web Tokens)
                    </p>
                    <p>
                      2. Click <strong>Generate Token</strong>
                    </p>
                    <p>3. Copy the token and keep it safe</p>
                    <div className="bg-muted p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">👉 Example:</p>
                      <code className="text-sm bg-background px-2 py-1 rounded border">
                        NEXT_PUBLIC_VAPI_WEB_TOKEN=your_generated_token_here
                      </code>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="border-l-4 border-accent pl-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    Create a New Assistant (Workflow)
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      1. From the Vapi dashboard, go to <strong>Workflows</strong> or <strong>Assistants</strong> tab
                    </p>
                    <p>
                      2. Click <strong>Create New Workflow</strong>
                    </p>
                    <p>3. Configure your assistant:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Add a name and description</li>
                      <li>Connect it with any LLM or API you want</li>
                      <li>Save your changes</li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="border-l-4 border-primary pl-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    Get Your Assistant ID
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>1. Open the workflow you just created</p>
                    <p>
                      2. In the workflow settings or details page, you'll find a unique <strong>ID</strong> (called{" "}
                      <strong>Workflow ID</strong> or <strong>Assistant ID</strong>)
                    </p>
                    <p>3. Copy this value</p>
                    <div className="bg-muted p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">👉 Example:</p>
                      <code className="text-sm bg-background px-2 py-1 rounded border">
                        NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id_here
                      </code>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="border-l-4 border-secondary pl-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      5
                    </span>
                    Add Them to Your Project
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      For <strong>React / Next.js / Vite projects</strong>, add the following inside your{" "}
                      <code>.env</code> file:
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                        {`NEXT_PUBLIC_VAPI_WEB_TOKEN=your_generated_token_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id_here`}
                      </pre>
                    </div>
                    <p>Then restart your development server. 🚀</p>
                  </div>
                </div>

                {/* Final Notes */}
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    🎯 Final Notes
                  </h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      Your <strong>Web Token</strong> is like a password — don't share it publicly
                    </li>
                    <li className="flex items-start gap-2">
                      <Bot className="h-4 w-4 mt-1 text-secondary flex-shrink-0" />
                      You can create multiple workflows if you want different assistants
                    </li>
                    <li className="flex items-start gap-2">
                      <Key className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                      If your wallet runs out of credits, you'll need to purchase credits or create a new account
                    </li>
                  </ul>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-6 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <h3 className="font-semibold">You're All Set!</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300">
                    Now you know how to generate your <strong>Vapi Web Token</strong> and get your{" "}
                    <strong>Assistant ID</strong> to integrate into your applications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Ready to Configure Your Settings?</h3>
                <p className="text-muted-foreground">
                  Head back to your profile to securely save your Vapi credentials.
                </p>
                <Link href="/">
                  <Button size="lg" className="font-medium">
                    <Shield className="h-4 w-4 mr-2" />
                    Go to Profile Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  )
}
