import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { getRandomInterviewCover } from '@/lib/utils';
import DisplayTechIcons from './DisplayTechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

const InterviewCard = async ({id, userId,role,type,techstack,createdAt}:InterviewCardProps) => {
    // getFeedbackByInterviewId returns Feedback[] | null, so pick first element if exists
    const feedbackArr = userId && id ? await getFeedbackByInterviewId({ interviewId: id, userId: userId }) : null;
    const Feedback = feedbackArr && feedbackArr.length > 0 ? feedbackArr[0] : null;
    const normalizeType = /mix/gi.test(type)? 'Mixed': type;
    const formattedDate = dayjs(createdAt).format('MMM D, YYYY')
    function getRandomInterviewCover(): string {
        const covers = [
            '/covers/adobe.png',
            '/covers/amazon.png',
            '/covers/facebook.png',
            '/covers/hostinger.png',
            '/covers/pinterest.png',
            '/covers/quora.png',
            '/covers/reddit.png',
            '/covers/skype.png',
            '/covers/spotify.png',
            '/covers/telegram.png',
            '/covers/tiktok.png',
            '/covers/yahoo.png'
        ];
        const idx = Math.floor(Math.random() * covers.length);
        return covers[idx];
    }

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>

        <div className="card-interview">
            <div>
                <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                    <p className='badge-text'>{normalizeType}</p>
                </div>

                <Image src={getRandomInterviewCover()} alt="cover" width={90} height={90} className='rounded-full object-fit size-[90px]'  />

                <h3 className='mt-5 capitalize'>
                     {role} Interview

                </h3>

                <div className='flex flex-row gap-5 mt-3'>
                            <div className='flex flex-row gap-2'>
                                <Image src='/calendar.svg' alt='calendar' width={22} height={22} />
                                <p className='text-sm'>{formattedDate}</p>
                            </div>

                            <div className='flex flex-row gap-2 items-center'>
                                <Image src='/star.svg' alt='start' width={22} height={22} />
                                   <p>{Feedback?.totalScore || '---'}/100</p>
                            </div>

                </div>

                <p className='line-clamp-2 mt-5'>
                    {Feedback?.finalAssessment || "you haven't taken the interview yet. Taken it now to improve yoour skills."}

                </p>
            </div>
            <div className='flex flex-row justify-between'>
               <DisplayTechIcons techStack={techstack} />
                <Button className='btn-primary'>
                    <Link href={Feedback
                        ? `/interview/${id}/feedback`
                        : `/interview/${id}`
                    }>
                        {Feedback ? 'Check Feedback' : 'View Interview'}
                    </Link>
                    
                </Button>

            </div>
        </div>

    </div>
  )
}

export default InterviewCard