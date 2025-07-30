import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { dummyInterviews } from '../constants'
import InterviewCard from '../components/InterviewCard'
import { getCurrentUser, getInterviewsByUserId, getLatestInterview } from '@/lib/actions/auth.action'

const page = async () => {
  const user = await getCurrentUser()

  const [userInterviews, latestInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterview({userId: user?.id!})
  ]);


  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterview?.length > 0;

  return (
    <>
       <section className="card-cta">
          <div className="flex flex-col gap-4 max-w-lg">
            <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
            <p className="text-lg">
              Practice on real Interview Questions & get instant feedback

            </p>

            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href='/interview'>Start an Interview</Link>
            </Button>



          </div>
          <Image src="/robot.png" alt="robo-dude" width={400} height={400} className='max-sm:hidden' />
        
       </section>

       <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interview</h2>

        <div className='interview-section'> 
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>You haven't taken any interview yet</p>
            )
          }
        </div>
        {/* <p>You haven't taken any interview yet</p> */}

        <section className="flex flex-col gap-6 mt-8">
          <h2>Take an Interview</h2>

          <div className='interview-section'></div>
          {
            hasUpcomingInterviews ? (
              latestInterview?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>There are no new interview available</p>
            )
          }
        </section>

       </section>
    </>
  )
}

export default page 


