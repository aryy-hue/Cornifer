"use client";

import NoteCard from "@/components/NoteCard";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5195/notesHub")
      .withAutomaticReconnect()
      .build();
      
    connection.on("NoteCreated", async () => {
      console.log("Realtime update received");
  
      await fetchNotes();
    });
    
    connection.start()
      .then(()=> {
        console.log("Connected to SignalR");
      })
      .catch((err)=> {
        console.error(err)
      });
  }, []);

  async function fetchNotes() {
    const res = await fetch("http://localhost:5195/api/notes");
    const data = await res.json();

    setNotes(data);
  }

  async function createNote() {
    await fetch("http://localhost:5195/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    await fetchNotes();

    setTitle("");
    setContent("");
  }

  async function updateNote(note: Note) {
    const newTitle = prompt("New Title", note.title);
    if(!newTitle) return;
    await fetch(`http://localhost:5195/api/notes/${note.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...note,
        title: newTitle,
      }),
    });
    await fetchNotes();
    
  }
  async function deleteNote(id: number) {
    await fetch(`http://localhost:5195/api/notes/${id}`, {
      method: "DELETE",
    });

    await fetchNotes();
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Notes
      </h1>

      <div className="flex flex-col gap-4 mb-8">
        <input
          className="border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="border p-3 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />

        <button
          className="bg-black text-white px-4 py-3 rounded"
          onClick={createNote}
        >
          Create Note
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onUpdate={updateNote}
          />
        ))}
      </div>
    </main>
  );
}