import { FormEvent, useContext, useEffect, useState } from "react";
import {
  addCategory,
  addNote,
  getCategoriesList,
  note,
} from "../utils/indexdb.ts";
import { GlobalContext, globalContextProps } from "../utils/context.ts";
import { DATE_FORMAT } from "../utils/constants.ts";
import moment from "moment";
import { triggerCreateNewNoteEvent } from "../utils/websocket.ts";

export function CreateNoteForm() {
  const { fetchNotes, setFetchNotes, fetchCategories, setFetchCategories } =
    useContext(GlobalContext) as globalContextProps;
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  useEffect(() => {
    async function fetchCategoriesList() {
      try {
        const currentDate = moment().format(DATE_FORMAT);
        const categories: string[] = (await getCategoriesList(
          currentDate
        )) as string[];
        setCategoriesList(categories);
      } catch (error) {
        console.log(error);
      }
    }
    if (fetchCategories) {
      fetchCategoriesList();
      // console.log("now fetching", fetchCategories);
      setFetchCategories(!fetchCategories);
    }
  }, [categoriesList, fetchCategories]);

  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      if (note.length < 3) {
        throw new Error("enter a valid note");
      }
      if (category.length < 3) {
        throw new Error("select a category");
      }
      const newNote = (await addNote(note, category)) as note;
      await triggerCreateNewNoteEvent(newNote);
      // fetch a freash list of notes
      setFetchNotes(!fetchNotes);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log(categoriesList);
  return (
    <div>
      <form action="" className="form" onSubmit={handleSubmit}>
        <div className="form-floating p-2">
          <textarea
            onChange={(e) => setNote(e.target.value)}
            className="form-control"
            name="newNote"
            id="note"
          />
          <label className="" htmlFor="note">
            note
          </label>
        </div>
        {/* categories select option */}
        <div className="form-floating p-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            id="category"
            name="select-category"
            aria-label="select a category"
          >
            <option value={""}>--select a category--</option>
            {categoriesList?.map((category: string, i) => (
              <option key={i} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label htmlFor="select-category">category</label>
        </div>

        <div className="p-2">
          <button type="submit" className="btn btn-success">
            create
          </button>
        </div>
      </form>
    </div>
  );
}

export function CreateCategoryForm() {
  const [newCategory, setNewCategory] = useState<string>("");
  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      if (newCategory.length < 3) {
        throw new Error("please enter a valid category name");
      }
      await addCategory(newCategory);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-floating p-2">
          <input
            type="text"
            className="form-control"
            name="new-category"
            id="category"
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <label htmlFor="new-category">category</label>
        </div>
        <div className="p-2">
          <button className="btn btn-success" type="submit">
            create
          </button>
        </div>
      </form>
    </div>
  );
}
