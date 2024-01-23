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
  return (
    <>
      {board && <div className="fs-2 fw-bold">{board.date}</div>}
      <div className="">
        {notesList.length < 1 ? (
          <>no notes for today</>
        ) : (
          <IterateCategories
            categorieslist={board?.categories as string[]}
            notesList={notesList}
          />
        )}
      </div>
    </>
  );
}

interface iterateCategoriesProps {
  categorieslist: string[];
  notesList: note[];
}

function IterateCategories({
  categorieslist,
  notesList,
}: iterateCategoriesProps) {
  return (
    <>
      <div className="accordion" id="board">
        {categorieslist?.map((category: string, i: number) => {
          return (
            <div key={i} id={category} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#category${i}`}
                  aria-controls={`category${i}`}
                >
                  {category}
                </button>
              </h2>
              <div
                id={`category${i}`}
                className={`accordion-collapse collapse ${
                  i === 0 ? "show" : ""
                }`}
                data-bs-parent="#board"
              >
                <div className="accordion-body">
                  <IterateNotes notesList={notesList} category={category} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

interface iterateNotesProps {
  notesList: note[];
  category: string;
}

function IterateNotes({ notesList, category }: iterateNotesProps) {
  return (
    <>
      {notesList.map((noteObj: note) => {
        return (
          <div key={noteObj.uid} className="">
            {noteObj.category === category ? (
              <TodoCard noteObj={noteObj} />
            ) : null}
          </div>
        );
      })}
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
    <div className="">
      <input
        className="m-2"
        style={{ width: "16px", height: "16px" }}
        id={noteObj.uid}
        type="checkbox"
        checked={checked}
        onChange={handleChecked}
      />
      <label htmlFor={noteObj.uid} className="">
        {noteObj.note}
      </label>
    </div>
  );
}
