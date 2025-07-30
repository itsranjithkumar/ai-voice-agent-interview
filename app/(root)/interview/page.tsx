"use server";
import React from 'react';
import Agent from '@/app/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';

const InterviewPage = async () => {
  const user = await getCurrentUser();
  if (!user) return <div>Loading...</div>;

  const role = 'Frontend Developer';
  const level = 'Junior';
  const techstack = ['React', 'TypeScript'];

  return (
    <>
      <h3>Interview Generation</h3>
      {/* Add selection UI if needed */}
      <Agent
        userName={user.name}
        userId={user.id}
        type="generate"
        role={role}
        level={level}
        techstack={techstack}
      />
    </>
  );
};

export default InterviewPage;