import { useContext, useEffect, useState } from "react";
import {
  type note,
  board,
  updateNoteChecked,
  getCurrentBoard,
  getDateNotesList,
} from "./../utils/indexdb";
import { DATE_FORMAT } from "../utils/constants";
import { GlobalContext, globalContextProps } from "../utils/context";
import moment from "moment";

export default function DisplayTodo() {
  const [notesList, setNotesList] = useState<note[]>([]);
  const [board, setBoard] = useState<board>();
  const { fetchNotes, setFetchNotes, fetchBoard, setFetchBoard } = useContext(
    GlobalContext
  ) as globalContextProps;
  // const [fetch, setFetch] = useState<boolean>(true);
  useEffect(() => {
    async function getNotes() {
      try {
        const currentDate = moment().format(DATE_FORMAT);
        const notesList: note[] = (await getDateNotesList(
          currentDate
        )) as note[];

        // const notesList: note[] = await getAllNote();
        setNotesList(notesList);
        // Handle the notesList as needed
      } catch (error) {
        console.log(error);
      }
    }

    async function getBoard() {
      try {
        const board = (await getCurrentBoard()) as board;
        setBoard(board);
        // console.log(board);
      } catch (error) {
        console.log(error);
      }
    }

    // if the board is not present fetch the board
    // and then fetch the notes
    if (fetchBoard) {
      getBoard();
      setFetchBoard(!fetchBoard);
      // console.log(board, fetchBoard, fetchNotes, notesList);
    }
    if (fetchNotes && !fetchBoard) {
      getNotes();
      setFetchNotes(!fetchNotes);
    }
    // fetchnotes on first render
    // if (fetchNotes) {
    // }
  }, [notesList, board, fetchNotes, fetchBoard]);
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
                  className="accordion-button fs-5"
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
          <div key={noteObj.id} className="">
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
        id={noteObj.id}
        type="checkbox"
        checked={checked}
        onChange={handleChecked}
      />
      <label htmlFor={noteObj.id} className="">
        {noteObj.note}
      </label>
    </div>
  );
}
