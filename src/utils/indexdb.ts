import { openDB } from "idb";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// export type Category = "learn" | "manage" | "build";
// export interface category {
//   category: string;
//   uidArr: string[];
// }

export interface note {
  note: string;
  category: string;
  checked: boolean;
  uid: string;
  date: string;
  count?: number;
}

export interface board {
  date: string;
  notes: string[];
  categories: string[];
}

const DEFAULT_CATEGORIES = ["learn", "manage", "build"];

// board db utils
export function createTodoDB(): void {
  openDB("todoDB", 1, {
    upgrade(db) {
      // create two objectstore named board and note
      db.createObjectStore("board", { keyPath: "date" });
      const noteStore = db.createObjectStore("note", { keyPath: "uid" });
      // create indexes on date and category
      noteStore.createIndex("category", "category");
      noteStore.createIndex("date", "date");
    },
  });
}

// this function returns the currently active board object
export async function getCurrentBoard() {
  try {
    // open the connection to board db
    const todoDB = await openDB("todoDB", 1);
    // get the current date
    const currentDate = moment().format("MMM Do YYYY");
    // fetch the board
    let currentBoard: board | undefined = await todoDB.get(
      "board",
      currentDate
    );
    // check if the query returned a board object
    // if not then create a new board object for the current date
    console.log("inside current board", currentBoard);
    if (currentBoard === undefined) {
      // get the date of yesterday
      const yesterdayDate: string = moment()
        .subtract(1, "days")
        .format("MMM Do YYYY");
      // fetch the board of yesterday
      const yesterdayBoard: board = await todoDB.get("board", yesterdayDate);
      let uncheckedRefList: string[] = [];
      let previousCategories: string[] = [];
      // if yesterday's board is available
      console.log(
        "current board was undefined so yestrdayboard",
        yesterdayBoard
      );
      if (yesterdayBoard !== undefined) {
        const yesterdayNotesList: note[] = (await getDateNotesList(
          yesterdayBoard.date
        )) as note[];
        // filter out all unique categories
        previousCategories = yesterdayNotesList?.filter((noteobj: note) => {
          if (previousCategories.includes(noteobj.category))
            return noteobj.category;
        }) as unknown as string[];
        // filter out the notes that were unchecked
        const uncheckedNoteList: note[] = yesterdayNotesList?.filter(
          (noteObj: note) => {
            if (noteObj.checked === false) {
              // update the date of the unchecked dates to today
              noteObj.date = currentDate;
              todoDB.put("note", noteObj);
              return true;
            }
          }
        ) as note[];
        // create a list of note refs to store in the todays board
        uncheckedRefList = Array.from(
          uncheckedNoteList,
          (noteObj) => noteObj.uid
        );
      }
      // create a board object
      const boardObj: board = {
        notes: uncheckedRefList,
        date: currentDate,
        categories:
          previousCategories.length > 0
            ? previousCategories
            : DEFAULT_CATEGORIES,
      };
      console.log("the final board is ", boardObj);
      await todoDB.add("board", boardObj);
      currentBoard = await todoDB.get("board", currentDate);
    }
    return currentBoard;
  } catch (error) {
    console.error(error);
  }
}

// return an array of notes for the current date board
export async function getNotesList() {
  try {
    const currentBoardObj: board = (await getCurrentBoard()) as board;
    // console.log(currentBoardObj);
    // get all the entires with the date of the current object board
    const notesList = await getDateNotesList(currentBoardObj.date);
    return notesList;
  } catch (error) {
    console.log(error);
  }
}

// called when a new note is added
export async function addNote(note: string, category: string): Promise<void> {
  try {
    // open a connection to the board db
    const todoDB = await openDB("todoDB", 1);
    // get the board according to the current time or create one if it does not exist
    const board: board = (await getCurrentBoard()) as board;
    // create a note obj
    const newNote: note = {
      note: note,
      category: category,
      checked: false,
      uid: uuidv4(),
      date: board.date,
    };
    // store the note obj in the note objectstore and uid as the object key
    await todoDB.add("note", newNote);
    // push the uid of the new note in the notes list of the board
    board.notes.push(newNote.uid);
    // update the board with the new board object and the date as the object key
    await todoDB.put("board", board);
  } catch (error) {
    console.log(error);
  }
}

// get notes for a given date
export async function getDateNotesList(
  date: string
): Promise<note[] | undefined> {
  try {
    // console.log(date);
    const todoDB = await openDB("todoDB");
    const transaction = todoDB.transaction("note", "readonly");
    const dateIndex = transaction.store.index("date");
    const notesList: note[] = (await dateIndex.getAll(date)) as note[];
    console.log(notesList, date);
    return notesList;
  } catch (error) {
    console.log(error);
  }
}

export async function getCategoriesList(
  currentDate: string
): Promise<string[] | undefined> {
  try {
    const todoDB = await openDB("todoDB", 1);
    const currentBoardObj: board = (await todoDB.get(
      "board",
      currentDate
    )) as board;
    const categories = currentBoardObj?.categories;
    // const currentBoardObj: board = (await getCurrentBoard()) as board;
    // const categories = currentBoardObj?.categories;
    return categories;
  } catch (error) {
    console.log(error);
  }
}

// updates the checks on a note
export async function updateNoteChecked(noteObj: note) {
  try {
    // update the noteobj checked field
    noteObj.checked = !noteObj.checked;
    // fetch the todoDB
    const todoDB = await openDB("todoDB", 1);
    // create a transaction
    const transaction = todoDB.transaction("note", "readwrite");
    transaction.store.put(noteObj);
    const updatedNote = transaction.store.get(noteObj.uid);
    // update the note obj

    // const updatedNoteUid = await todoDB.put("note", noteObj);
    // console.log(updatedNoteUid);
    return updatedNote;
  } catch (error) {
    console.error(error);
  }
}

// adds a new category to the current board
export async function addCategory(newCategory: string): Promise<void> {
  try {
    const currentBoardObj: board = (await getCurrentBoard()) as board;
    currentBoardObj.categories.push(newCategory);
    const todoDB = await openDB("todoDB", 1);
    await todoDB
      .put("board", currentBoardObj)
      .then(() => console.log(currentBoardObj));
  } catch (error) {
    console.log(error);
  }
}
