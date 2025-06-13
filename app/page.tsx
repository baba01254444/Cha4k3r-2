'use client';
import React, { useState } from "react";

export default function TokenChecker() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">TUF4N 4C - Facebook Token Checker</h1>
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
        <div className="bg-gray-100 p-4 rounded mt-4">
          <p><strong>Token Owner:</strong> {result.name}</p>
          <p><strong>Token Type:</strong> {result.type}</p>
          <p><strong>ID:</strong> {result.id}</p>
          <p className="mt-2 font-semibold">Chats:</p>
          <ul className="list-disc list-inside">
            {result.conversations.map((chat, idx) => (
              <li key={idx}>{chat.name} ({chat.id})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
        }
