import Vapi from "@vapi-ai/web";

let vapiInstance: Vapi | null = null;

const getVapiInstance = () => {
  if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_VAPI_WEB_TOKEN');
  }

  if (!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_VAPI_ASSISTANT_ID');
  }

  if (!vapiInstance) {
    vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN);
  }

  return vapiInstance;
};

export const vapi = getVapiInstance();
export const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
