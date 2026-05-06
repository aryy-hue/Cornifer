type Note = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
};
type NoteCardProps = {
    note: Note;
    onDelete: (id: number) => void;
    onUpdate: (note: Note) => void;
};
export default function NoteCard({note, onDelete, onUpdate}: NoteCardProps){
    return(
         <div className="border rounded p-4">
      <h2 className="text-xl font-semibold">
        {note.title}
      </h2>

      <p className="mt-2">
        {note.content}
      </p>

      <button
        className="mt-4 bg-red-500 text-white px-3 py-2 rounded"
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
      <button
            className="mt-2 bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => onUpdate(note)}>
            Edit
        </button>
    </div>
    );
};