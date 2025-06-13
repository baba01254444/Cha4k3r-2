'use client';
import React, { useState, useEffect } from 'react';

export default function TokenChecker() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

  const playSound = (type: 'success' | 'error') => {
    const audio = new Audio(
      type === 'success'
        ? 'https://notificationsounds.com/storage/sounds/file-sounds-1155-pristine.mp3'
        : 'https://notificationsounds.com/storage/sounds/file-sounds-1146-plucky.mp3'
    );
    audio.play();
  };

  const showToast = (message: string) => {
    setToast(message);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    playSound('success');
    showToast('✅ UID copied!');
  };

  const checkToken = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/check?access_token=${token}`);
      const data = await res.json();
      if (data.error) {
        playSound('error');
        setError(data.error.message);
        showToast('❌ Token invalid!');
      } else {
        playSound('success');
        setResult(data);
        showToast('✅ Token checked successfully!');
      }
    } catch (e) {
      playSound('error');
      setError('Something went wrong while checking the token.');
    } finally {
      setLoading(false);
    }
  };

  const isGroupChat = (name: string) => {
    return (
      name.toLowerCase().includes('group') ||
      name.includes('⚫') ||
      name.includes('◉') ||
      name.includes('ग्रुप') ||
      name.length > 25
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">TUF4N 4C - Facebook Token Checker</h1>

      <div className="flex items-center space-x-2 mb-4">
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
          {loading ? 'Loading...' : 'Check'}
        </button>
      </div>

      {toast && (
        <div className="bg-yellow-400 text-black px-4 py-2 rounded mb-4 text-center">
          {toast}
        </div>
      )}

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

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Group Chats</h2>
            {result.conversations
              .filter((chat: any) => isGroupChat(chat.name))
              .map((chat: any, idx: number) => (
                <div key={idx} className="bg-black text-white p-2 mb-2 rounded flex justify-between items-center">
                  <span>{chat.name} ({chat.id})</span>
                  <button
                    onClick={() => copyToClipboard(chat.id)}
                    className="text-sm bg-white text-black px-2 py-1 rounded"
                  >
                    Copy UID
                  </button>
                </div>
              ))}

            <h2 className="text-xl font-semibold mt-6 mb-2">Single Chats</h2>
            {result.conversations
              .filter((chat: any) => !isGroupChat(chat.name))
              .map((chat: any, idx: number) => (
                <div key={idx} className="bg-sky-300 text-red-700 p-2 mb-2 rounded flex justify-between items-center">
                  <span>{chat.name} ({chat.id})</span>
                  <button
                    onClick={() => copyToClipboard(chat.id)}
                    className="text-sm bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Copy UID
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
