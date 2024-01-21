import { useContext, useEffect, useState } from "react";
import {
  type note,
  board,
  updateNoteChecked,
  getCurrentBoard,
  getDateNotesList,
} from "./../utils/indexdb";
import { GlobalContext, globalContextProps } from "../utils/context";
import moment from "moment";

export default function DisplayTodo() {
  const [notesList, setNotesList] = useState<note[]>([]);
  const [board, setBoard] = useState<board>();
  const { fetchNotes, setFetchNotes } = useContext(
    GlobalContext
  ) as globalContextProps;
  // const [fetch, setFetch] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = moment().format("MMM Do YYYY");
        const notesList: note[] = (await getDateNotesList(
          currentDate
        )) as note[];
        const currentBoard: board = (await getCurrentBoard()) as board;
        setBoard(currentBoard);
        // const notesList: note[] = await getAllNote();
        setNotesList(notesList);
        // Handle the notesList as needed
      } catch (error) {
        console.log(error);
      }
    };
    // fetchnotes on first render
    if (fetchNotes) {
      fetchData();
      setFetchNotes(!fetchNotes);
    }
  }, [notesList, board, fetchNotes]);
  console.log("display list", notesList);
  return (
    <>
      {board && <div className="fs-3">{board.date}</div>}
      <div className="border border-primary rounded-3 p-4 ">
        {notesList.length < 1 ? (
          <>no notes for today</>
        ) : (
          notesList.map((noteObj: note) => {
            return (
              <div key={noteObj.uid} className="d-block">
                <TodoCard noteObj={noteObj} />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

function TodoCard({ noteObj }: { noteObj: note }) {
  // set a state variable equal to the value of note checked prop
  const [checked, setChecked] = useState<boolean>(noteObj.checked);
  async function handleChecked() {
    try {
      const newNote = await updateNoteChecked(noteObj);
      setChecked(newNote.checked);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <input
        id={noteObj.uid}
        type="checkbox"
        checked={checked}
        onChange={handleChecked}
      />
      <label htmlFor={noteObj.uid}>{noteObj.note}</label>
    </div>
  );
}
