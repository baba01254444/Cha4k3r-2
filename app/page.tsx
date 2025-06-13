'use client';
import React, { useState } from "react";

export default function TokenChecker() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const checkToken = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/check?access_token=${token}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error.message);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Something went wrong while checking the token.");
    } finally {
      setLoading(false);
    }
  };

  const isGroupChat = (chatName: string) => {
    return chatName.toLowerCase().includes("group") ||
           chatName.includes("⚫") ||
           chatName.includes("◉") ||
           chatName.includes("ग्रुप") ||
           chatName.length > 25;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">TUF4N 4C - Facebook Token Checker</h1>
      
      <div className="flex items-center space-x-2">
        <input
          className="border p-2 w-full"
          placeholder="Enter Facebook Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={checkToken}
          disabled={loading}
        >
          {loading ? "Loading..." : "Check"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Token Owner:</strong> {result.name}</p>
            <p><strong>Token Type:</strong> {result.type}</p>
            <p><strong>ID:</strong> {result.id}</p>
          </div>

          <div className="mt-4">
            <p className="text-xl font-semibold mb-2">Chats:</p>

            {/* Group Chats */}
            <div className="bg-black text-white p-4 rounded mb-4">
              <p className="font-bold mb-2">Group Chats:</p>
              <ul className="list-disc list-inside">
                {result.conversations
                  .filter(chat => isGroupChat(chat.name))
                  .map((chat, idx) => (
                    <li key={idx}>{chat.name} ({chat.id})</li>
                ))}
              </ul>
            </div>

            {/* Single Chats */}
            <div className="bg-sky-300 text-red-700 p-4 rounded">
              <p className="font-bold mb-2">Single Chats:</p>
              <ul className="list-disc list-inside">
                {result.conversations
                  .filter(chat => !isGroupChat(chat.name))
                  .map((chat, idx) => (
                    <li key={idx}>{chat.name} ({chat.id})</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
