"use client";
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';


enum callStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}
const Agent = ({userName}:AgentProps) => {
  const [status, setStatus] = React.useState<callStatus>(callStatus.INACTIVE);
  const isSpeaking = status === callStatus.ACTIVE;
  const message =[
    'what is your name?',
    'My Name is Ranjith Kumar, Nice to meet you'
  ]
  const lastMessage = message[message.length - 1];
  return (
    <>
        <div className="call-view">
      <div className="card-interviewer">
        <div className='avatar'>
          <Image src='/ai-avatar.png' alt='vapi' width={65} height={65} className='object-cover' />
          {isSpeaking && <div className="animate-speak"></div>}
        </div>
        <h3>AI Interviewer</h3>
      </div>
      <div className='card-border'>
        <div className='card-content'>
          <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className="rounded-full object-cover size-[120px]" />

              <h3>{userName}</h3>
        </div>

      </div>
    </div>

    {message.length>0 && (
      <div className='transcript-border'>
        <div className='transcript'>
          <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
            {lastMessage}

          </p>

        </div>

      </div>
    )}

    <div className='w-full flex justify-center'>
      {status !== callStatus.ACTIVE ? (
        <button className="btn-call" onClick={() => setStatus(callStatus.ACTIVE)}>
          <span className={cn('absolute animate-ping rounded-full opacity-75', status !== callStatus.CONNECTING && 'hidden')}>
          </span>

          <span>
          {(status === callStatus.INACTIVE || status === callStatus.FINISHED) ? 'Call' : '...'}
          </span>
        </button>
      ) : (
        <button className='btn-disconnect' onClick={() => setStatus(callStatus.FINISHED)}>
          End
        </button>
      )}
    </div>
    
    </>
   
  )
}


export default Agent