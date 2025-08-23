"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Profile({ email, initialVapiKey, initialAssistantId }: { email: string; initialVapiKey?: string; initialAssistantId?: string }) {
  const [vapiKey, setVapiKey] = useState(initialVapiKey || "");
  const [assistantId, setAssistantId] = useState(initialAssistantId || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/profile/vapi-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vapiKey, assistantId }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setMessage("Vapi key and Assistant ID saved!");
      setError("");
    } else {
      setMessage("");
      setError(data.error || "Failed to save Vapi key and Assistant ID.");
    }
    setSaving(false);
  };

  return (
    <div className="profile-section p-4 bg-dark-200 rounded-lg mb-8">
      <div className="mb-2">
        <strong>Email:</strong> {email}
      </div>
      <div className="mb-2">
        <label htmlFor="vapiKey">Vapi Key:</label>
        <input
          id="vapiKey"
          type="text"
          value={vapiKey}
          onChange={e => setVapiKey(e.target.value)}
          className="input ml-2"
          style={{ minWidth: 200 }}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="assistantId">Assistant ID:</label>
        <input
          id="assistantId"
          type="text"
          value={assistantId}
          onChange={e => setAssistantId(e.target.value)}
          className="input ml-2"
          style={{ minWidth: 200 }}
        />
        <Button onClick={handleSave} className="ml-2" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      {/* Instructions and warning if key or assistantId is missing */}
      {(!vapiKey || !assistantId) && (
        <div className="mt-2 text-yellow-400">
          <strong>To use AI features, you must add both your Vapi Web Token and Assistant ID.</strong>
          <br />
          <span>
            1. Go to <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">vapi.ai</a> and log in.<br />
            2. Open the dashboard and look for your <strong>Web Token</strong> (public/client key) and <strong>Assistant ID</strong> (or Workflow ID).<br />
            3. Paste both above, then click Save.<br />
            <em>If you can't find your key or Assistant ID, check Vapi's documentation or contact their support.</em>
          </span>
        </div>
      )}
      {error && <div className="mt-2 text-red-400">{error}</div>}
      {message && <div className="mt-2 text-green-400">{message}</div>}
    </div>
  );
}

