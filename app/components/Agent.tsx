"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import Vapi from "@vapi-ai/web";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId?: string;
  feedbackId?: string;
  type: string;
  questions?: string[];
  vapiKey?: string;
  assistantId?: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  vapiKey,
  assistantId,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Initialize Vapi SDK with user's key
  const [vapi, setVapi] = useState<Vapi | null>(null);

  useEffect(() => {
    if (vapiKey) {
      setVapi(new Vapi(vapiKey));
    } else {
      setVapi(null);
    }
  }, [vapiKey]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    if (!vapi) return;
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      if (!vapi) return;
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [vapi]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    if (!vapi) {
      alert("Vapi is not initialized. Please ensure you have entered a valid Vapi key in your profile.");
      return;
    }
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      // Use assistantId from user profile
      if (!assistantId || assistantId.trim().length === 0) {
        alert("Assistant ID is not configured. Please add your Assistant ID in your profile.");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }
      console.log("Calling vapi.start with assistantId:", assistantId);
      await vapi.start(assistantId, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      // Use assistantId from user profile
      if (!assistantId || assistantId.trim().length === 0) {
        alert("Assistant ID is not configured. Please add your Assistant ID in your profile.");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }
      console.log("Calling vapi.start with assistantId:", assistantId, { questions: formattedQuestions });
      try {
        await vapi.start(assistantId, {
          variableValues: {
            questions: formattedQuestions,
            username: userName,
            userid: userId,
          },
        });
      } catch (err: any) {
        let errorMsg = "Unknown error";
        if (err?.error && typeof err.error.json === "function") {
          // Try to extract error message from Vapi response
          err.error.json().then((data: any) => {
            errorMsg = data?.message || JSON.stringify(data);
            alert("Vapi Error: " + errorMsg);
            console.error("Vapi call error:", errorMsg, err);
          });
        } else {
          alert("Vapi Error: " + (err?.message || JSON.stringify(err)));
          console.error("Vapi call error:", err);
        }
        throw err;
      }
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    if (vapi) {
      vapi.stop();
    }
  };

  if (!vapiKey) {
    return (
      <div className="p-4 bg-yellow-200 text-yellow-900 rounded">
        <strong>Vapi key is missing.</strong> Please add your Vapi key in your profile to use AI agent features.
      </div>
    );
  }

  return (
    <div className="agent-container">
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Start"
                : "Connecting..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;