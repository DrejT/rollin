import { useEffect, useState } from "react";
import {
  type note,
  board,
  updateNoteChecked,
  getNotesList,
} from "./../utils/indexdb";

export default function DisplayTodo() {
  const [notesList, setNotesList] = useState<note[]>([]);
  const [board, setBoard] = useState<board>();
  const [fetch, setFetch] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesList = (await getNotesList()) as note[];
        setBoard(board);
        // const notesList: note[] = await getAllNote();
        setNotesList(notesList);
        // Handle the notesList as needed
      } catch (error) {
        console.log(error);
      }
    };
    if (fetch) {
      fetchData();
      setFetch(!fetch);
    }
  }, [notesList, board]);
  return (
    <>
      {board && (
        <>
          <div className="fs-3">{board.date}</div>
          <div className="border border-primary rounded-3 p-4 ">
            {notesList.map((noteObj: note) => (
              <div key={noteObj.uid} className="d-block">
                <TodoCard noteObj={noteObj} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function TodoCard({ noteObj }: { noteObj: note }) {
  async function handleChecked() {
    try {
      const newNote = await updateNoteChecked(noteObj);
      console.log(newNote);
      noteObj.checked = !noteObj.checked;
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <input
        id={noteObj.uid}
        type="checkbox"
        checked={noteObj.checked}
        onChange={handleChecked}
      />
      <label htmlFor={noteObj.uid}>{noteObj.note}</label>
    </div>
  );
}
