import { ChangeEvent, useState } from "react"
import logo from "./assets/logo.svg"
import { NewNoteCard } from "./components/NewNoteCard"
import { NoteCard } from "./components/NoteCard"

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState("")
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("nlw-expert-notes")

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem("nlw-expert-notes", JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(notesArray)
    localStorage.setItem("nlw-expert-notes", JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 xl:px-0">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          )
        })}
      </div>
    </div>
  )
}
