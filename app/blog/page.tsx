"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, Cpu, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function BlogPage() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const steps = [
    {
      number: "1",
      title: "Create a Vapi Account",
      description: "Sign up on Vapi.ai to access the dashboard and voice-AI features.",
      substeps: [
        { label: "a.", text: "Go to vapi.ai and click Sign Up", link: "https://vapi.ai" },
        { label: "b.", text: "Complete registration with your email or social login" },
        { label: "c.", text: "Verify your email address to activate the account" }
      ],
      tip: "Use a work email for easy team onboarding later.",
      code: ""
    },
    {
      number: "2",
      title: "Generate Your Vapi Web Token",
      description: "Create a secure Web Token that links your Vapi account to our application.",
      substeps: [
        { label: "a.", text: "From the dashboard, open Settings → API Keys / Web Token" },
        { label: "b.", text: "Click Generate Token" },
        { label: "c.", text: "Copy the newly-created token e.g. sk-1234abcd5678efgh" },
        { label: "d.", text: "Head to the Profile page in this app and paste it into the “Vapi Web Token” field" }
      ],
      tip: "Keep this token secret—treat it like a password.",
      code: ""
    },
    {
      number: "3",
      title: "Create an Assistant (Workflow)",
      description: "Design and configure the voice assistant you want to use.",
      substeps: [
        { label: "a.", text: "In the dashboard, go to Workflows / Assistants" },
        { label: "b.", text: "Click Create Workflow and set voice, model, etc." },
        { label: "c.", text: "Save the workflow once you're happy with it" }
      ],
      tip: "Experiment in the playground to fine-tune personality before going live.",
      code: ""
    },
    {
      number: "4",
      title: "Get the Assistance ID",
      description: "Copy the unique ID of the workflow you just created.",
      substeps: [
        { label: "a.", text: "Open the workflow details page" },
        { label: "b.", text: "Copy the Workflow ID e.g. asst-xyz987654321" },
        { label: "c.", text: "Paste it into the “Assistance ID” field on your Profile page" }
      ],
      tip: "Double-check that you didn’t copy extra spaces.",
      code: ""
    },
    {
      number: "5",
      title: "Start Using Your Assistant",
      description: "With both the Web Token and Assistance ID saved in your profile, you’re ready to go!",
      substeps: [
        { label: "a.", text: "Navigate to the Interview page" },
        { label: "b.", text: "Hit Start Interview to begin a voice chat powered by your assistant" }
      ],
      tip: "Create multiple workflows if you need different assistants for separate use-cases.",
      code: `import Vapi from '@vapi-ai/web'

const vapi = new Vapi({
  token: userProfile.token,
  assistantId: userProfile.assistantId
})

vapi.start()`
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black" ref={containerRef}>
      {/* Apple-style gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent)`,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Hero Header - Apple Style */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center pt-20 pb-16"
          style={{ opacity, scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 mb-8"
          >
            <Cpu className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 tracking-wide uppercase">
              Developer Guide
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
          >
            Vapi Integration.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Simplified.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Add powerful voice AI capabilities to your application in minutes. 
            A comprehensive guide to integrating Vapi's voice assistant technology.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-6 justify-center text-sm text-gray-500 dark:text-gray-500"
          >
            <span>December 2024</span>
            <span>•</span>
            <span>10 min read</span>
            <span>•</span>
            <span>AI Integration</span>
          </motion.div>
        </motion.div>

        {/* Introduction Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Why Vapi?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            Vapi revolutionizes how developers integrate voice AI into their applications. 
            With its powerful SDK and intuitive dashboard, you can create sophisticated voice 
            assistants that understand context, handle complex conversations, and deliver 
            exceptional user experiences.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Easy Integration", desc: "Simple SDK with clear documentation" },
              { icon: "⚡", title: "Real-time Voice", desc: "Ultra-low latency conversations" },
              { icon: "🔒", title: "Enterprise Ready", desc: "Secure and scalable infrastructure" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Steps Section */}
        <motion.section 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-semibold text-gray-900 dark:text-white mb-12 text-center"
          >
            Integration Steps
          </motion.h2>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="mb-12"
            >
              <div className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
                
                <div className="ml-14 space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {step.substeps && (
                    <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-6 border border-gray-200 dark:border-gray-800">
                      <div className="space-y-3 text-sm">
                        {step.substeps.map((substep, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-gray-400 dark:text-gray-600">{substep.label}</span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {substep.link ? (
                                <>
                                  {substep.text.split('vapi.ai')[0]}
                                  <Link 
                                    href={substep.link} 
                                    className="text-blue-600 dark:text-blue-400 hover:underline" 
                                    target="_blank"
                                  >
                                    vapi.ai
                                  </Link>
                                  {substep.text.split('vapi.ai')[1]}
                                </>
                              ) : (
                                substep.text
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.code && (
                    <div className="rounded-2xl bg-gray-900 dark:bg-black p-6 border border-gray-800 dark:border-gray-700">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="mt-0.5">💡</span>
                    <p>
                      <span className="font-medium">Pro tip:</span> {step.tip}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Success Message */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-12 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-4">
              You're All Set!
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your Vapi integration is complete. Start building amazing voice experiences 
              that will delight your users and set your application apart.
            </p>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center pb-20"
        >
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Start your AI interview journey today and experience the power of voice-enabled interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/interview">
              <Button 
                size="lg" 
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white px-8 py-6 text-base rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Start Interview
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button 
                size="lg" 
                variant="outline"
                className="border-gray-300 dark:border-gray-700 px-8 py-6 text-base rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Configure Profile
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
