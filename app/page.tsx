'use client'; import React, { useState } from 'react'; import { Copy } from 'lucide-react';

export default function TokenChecker() { const [token, setToken] = useState(''); const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null); const [error, setError] = useState<string | null>(null); const [toast, setToast] = useState<string | null>(null);

const playSound = (type: 'success' | 'error') => { const audio = new Audio( type === 'success' ? 'https://cdn.pixabay.com/audio/2022/03/15/audio_c1de6b324b.mp3' : 'https://cdn.pixabay.com/audio/2022/03/15/audio_22fa5dbf4c.mp3' ); audio.play(); };

const showToast = (message: string) => { setToast(message); setTimeout(() => setToast(null), 3000); };

const checkToken = async () => { setLoading(true); setError(null); setResult(null); try { const res = await fetch(/api/check?access_token=${token}); const data = await res.json(); if (data.error) { playSound('error'); setError(data.error.message); showToast('❌ Token invalid!'); } else { playSound('success'); setResult(data); showToast('✅ Token checked successfully!'); } } catch (e) { playSound('error'); setError('Something went wrong while checking the token.'); } finally { setLoading(false); } };

const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); playSound('success'); showToast('✅ UID copied!'); };

const isGroupChat = (name: string) => name.toLowerCase().includes('group') || name.includes('⚫') || name.includes('◉') || name.includes('ग्रुप') || name.length > 25;

return ( <div className="max-w-xl mx-auto mt-10 p-4"> <h1 className="text-2xl font-bold mb-4 text-center">TUF4N 4C - Facebook Token Checker</h1> <div className="flex items-center space-x-2"> <input className="border p-2 w-full" placeholder="Enter Facebook Token" value={token} onChange={(e) => setToken(e.target.value)} /> <button
className="bg-blue-500 text-white px-4 py-2 rounded"
onClick={checkToken}
disabled={loading}
> {loading ? 'Loading...' : 'Check'} </button> </div>

{error && <div className="text-red-500 mt-4 font-semibold">❌ {error}</div>}

  {result && (
    <div className="mt-6">
      <div className="bg-gray-100 p-4 rounded">
        <p><strong>Token Owner:</strong> {result.name}</p>
        <p><strong>Token Type:</strong> {result.type}</p>
        <p><strong>ID:</strong> {result.id}</p>
      </div>

      <p className="mt-4 font-semibold text-lg">Chats:</p>

      {/* Group chats */}
      <div className="mt-2 space-y-2">
        {result.conversations
          .filter((c: any) => isGroupChat(c.name))
          .map((chat: any, idx: number) => (
            <div
              key={idx}
              className="bg-black text-white p-2 rounded flex justify-between items-center"
            >
              <span>{chat.name} ({chat.id})</span>
              <button onClick={() => copyToClipboard(chat.id)}>
                <Copy size={16} />
              </button>
            </div>
          ))}
      </div>

      {/* Single chats */}
      <div className="mt-6 space-y-2">
        {result.conversations
          .filter((c: any) => !isGroupChat(c.name))
          .map((chat: any, idx: number) => (
            <div
              key={idx}
              className="bg-sky-300 text-red-600 p-2 rounded flex justify-between items-center"
            >
              <span>{chat.name} ({chat.id})</span>
              <button onClick={() => copyToClipboard(chat.id)}>
                <Copy size={16} />
              </button>
            </div>
          ))}
      </div>
    </div>
  )}

  {toast && (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg">
      {toast}
    </div>
  )}
</div>

); }

                                                                                         
