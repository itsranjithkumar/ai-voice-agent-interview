"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form, FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import FormField from "../components/FormField"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"


const authFormSchema = (type:FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  })
}
const AuthForm = ({type }:{type: FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type)
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      if(type === 'sign-up') {
        const{name, email, password} = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password
        })

        if(!result?.success) {
          toast.error(result?.message)
          return
        }
        toast.success('Account created successfully please sign in.');
        console.log('Redirecting to /sign-in');
        router.push('/sign-in');
        setTimeout(() => {
          // Fallback in case router.push fails
          window.location.href = '/sign-in';
        }, 500);
        
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await userCredential.user.getIdToken()
        if(!idToken) {
          toast.error('Failed to sign in')
          return
        }
        await  signIn({
          email, idToken
        })

        
        toast.success('sign in successfully.')
        router.push('/')
      }
    } catch (error: any) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please sign in or use a different email.');
      } else {
        toast.error(`There was an error: ${error.message || error}`);
      }
    }

  }

  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-row gap-2 justify-center"></div>
          <Image src={"logo.svg"} alt={"logo"} width={38} height={32} />

          <h2 className="text-primary-100">Prepwise</h2>
          <h3 className="text-primary-100">practice job interview with ai</h3>

<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ml-4 form">

        {!isSignIn && (
          <FormField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Your Name"
            type="text"
          />
        )}
        <FormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="Your Email Address"
          type="email"
        />
        <FormField
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <Button className='btn'type="submit">{isSignIn ? "Sign in" : "Create an account"}</Button>
      </form>
    </Form>
    <p className='text-center'>
      {isSignIn ? 'No account yet? ' : 'Already have an account? '}
      <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
        {isSignIn ? 'Create an account' : 'Sign in'}
      </Link>
    </p>
    </div>
    </div>

  )
}

export default AuthForm