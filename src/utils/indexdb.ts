import { openDB } from "idb";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export type Category = "learn" | "manage" | "build";

export interface note {
  note: string;
  category: Category;
  checked: boolean;
  uid: string;
}

export interface board {
  date: string;
  notes: string[];
}

// user db utils
export function createUserDB(): void {
  openDB("userDB", 1, {
    upgrade(db) {
      db.createObjectStore("user", { autoIncrement: true });
    },
  });
}

export async function addUser(user: string): Promise<void> {
  const userDB = await openDB("userDB", 1);
  userDB.add("user", user);
  // db1.add("store1", true, "delivered");
  userDB.close();
}

// board db utils
export function createBoardDB(): void {
  openDB("boardDB", 1, {
    upgrade(db) {
      db.createObjectStore("board", { keyPath: "date" });
      db.createObjectStore("note", { keyPath: "uid" });
    },
  });
}

// this function returns the currently active board object
export async function getCurrentBoard() {
  try {
    // open the connection to board db
    const boardDB = await openDB("boardDB", 1);
    // get tht current date
    const currentDate = moment().format("MMM Do YYYY");
    // fetch the board
    let currentBoard: board | undefined = await boardDB.get(
      "board",
      currentDate
    );
    // check if the query returned a board object
    // if not then create a new board object for the current date
    if (currentBoard === undefined) {
      // get the date of yesterday
      const yesterdayDate: string = moment()
        .subtract(1, "days")
        .format("MM Do YYYY");
      // fetch the board of yesterday
      const yesterdayBoard: board = await boardDB.get("board", yesterdayDate);
      // iterate over the list of note refs and pass them to fetch the required notes
      // and filter out the notes that are marked as checked

      boardDB.add("board", {
        date: currentDate,
        notes: [],
      });
      currentBoard = await boardDB.get("board", currentDate);
    }
    return currentBoard;
  } catch (error) {
    console.error(error);
  }
}

// return an array of notes for the current date board
export async function getNotesList() {
  try {
    const boardObj: board = (await getCurrentBoard()) as board;
    const boardDB = await openDB("boardDB");
    const noteObjArr: note[] = await Promise.all(
      boardObj.notes.map((noteRef: string) => boardDB.get("note", noteRef))
    );
    return noteObjArr;
  } catch (error) {
    console.log(error);
  }
}

export async function addNote(note: string, category: Category): Promise<void> {
  try {
    // open a connection to the board db
    const boardDB = await openDB("boardDB", 1);
    // create a note obj
    const newNote: note = {
      note: note,
      category: category,
      checked: false,
      uid: uuidv4(),
    };
    // store the note obj in the note objectstore and uid as the object key
    await boardDB.add("note", newNote);
    // get the board according to the current time or create one if it does not exist
    const board: board = (await getCurrentBoard()) as board;
    // push the uid of the new note in the notes list of the board
    board.notes.push(newNote.uid);
    // update the board with the new board object and the date as the object key
    await boardDB.put("board", board);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllNote(): Promise<note[]> {
  const boardDB = await openDB("boardDB", 1);
  // retrieve by key:
  // noteDB.get("note", "cat001").then(console.log);
  // retrieve all:
  const notesList: note[] = await boardDB.getAll("note");
  // count the total number of items in a store:
  // noteDB.count("note").then(console.log);
  // get all keys:
  // noteDB.getAllKeys("note").then(console.log);
  return notesList;
}

export async function updateNoteChecked(noteObj: note) {
  try {
    const boardDB = await openDB("boardDB", 1);
    const boardObj: board = (await getCurrentBoard()) as board;
    noteObj.checked = !noteObj.checked;
    const notesList: note[] = await boardDB.get("board", boardObj.date);
    console.log(notesList);
    // let transaction = db2.transaction(['store3'], 'readwrite');
    await boardDB.put("board", noteObj, boardObj.date);
  } catch (error) {
    console.error(error);
  }
}
