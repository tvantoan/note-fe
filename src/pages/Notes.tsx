import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import type { Note } from '../types';
import { Link } from 'react-router-dom';

const Notes: React.FC = () => {
  const { token, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { fullName, email, avatar } = useAuth();
  const getNotes = async () => {
    if (!token) return;

    const res = await fetch('http://localhost:5299/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await fetch('http://localhost:5299/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    setTitle('');
    setContent('');
    getNotes();
  };

  const deleteNote = async (id: string) => {
    if (!token) return;
    await fetch(`http://localhost:5299/api/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    getNotes();
  };
  console.log(fullName, email, avatar);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-3xl font-bold mb-6 text-teal-700">
              Create New Note
            </h2>
            <form onSubmit={createNote} className="space-y-4">
              <input
                className="w-full p-3 rounded-lg border"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full p-3 rounded-lg border h-28"
                placeholder="Content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-green-400 to-blue-500"
              >
                Create Note
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <img
                  src={`/avatars/${avatar + 1}.png`}
                  alt="Profile Picture"
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <div>
                <span className="font-semibold text-white">{fullName}</span>
                <p className="text-sm text-gray-200">{email}</p>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-red-400 to-pink-500"
              onClick={logout}
            >
              Log out
            </button>
          </div>

          <div className="grid gap-5">
            <button
              onClick={getNotes}
              className="px-5 py-2 rounded-lg font-semibold bg-white text-purple-600"
            >
              Refresh
            </button>
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-[2px] rounded-xl bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500"
                >
                  <div className="bg-white rounded-xl p-5">
                    <h3 className="text-xl font-bold text-purple-700">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="mt-4 px-4 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-red-400 to-pink-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400">
                Chưa có note nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
