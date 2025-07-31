import { getInterviewById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import DisplayTechIcons from '@/app/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Agent from '@/app/components/Agent';
const page = async ({params}: RouteParams) => {
    const {id} = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);

    if(!interview) redirect('/');
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
   <>
     <div className='flex flex-row gap-4 justify-between'>
        <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
            <div className='flex flex-row gap-4'>
               <Image src={getRandomInterviewCover()} 
               alt ='cover-image' width={40} height={40} className='rounded-full object-fit size-[40px]' />
                   <h3 className='capitalize'>{interview.role} Interview</h3>
            </div>

            <DisplayTechIcons techStack={interview.techstack} />

        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">{interview.type}</p>
     </div>

     <Agent 
     userName={user?.name || ''} 
     userId={user?.id}
     interviewId={id}
     type="interview"
     role={interview.role}
     level={interview.level}
     techstack={interview.techstack}
     questions={interview.questions}
     />


   
   
   </>
  )
}

export default page