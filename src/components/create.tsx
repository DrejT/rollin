import { FormEvent, useContext, useEffect, useState } from "react";
import { addNote, getCategoriesList } from "../utils/indexdb.ts";
import { GlobalContext, globalContextProps } from "../utils/context.ts";
import moment from "moment";

export function CreateModalForm() {
  const { fetchNotes, setFetchNotes, fetchCategories, setfetchCategories } =
    useContext(GlobalContext) as globalContextProps;
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  useEffect(() => {
    async function fetchCategoriesList() {
      try {
        const currentDate = moment().format("MMM Do YYYY");
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
      console.log("now fetching", fetchCategories);
      setfetchCategories(!fetchCategories);
    }
  }, [categoriesList, fetchCategories]);

  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      if (!note) {
        throw new Error("enter a valid note");
      }
      if (!category) {
        throw new Error("select a category");
      }
      await addNote(note, category);
      // fetch a freash list of notes
      setFetchNotes(!fetchNotes);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(categoriesList);
  return (
    <>
      <div
        className="modal fade"
        id="createModalForm"
        tabIndex={-1}
        aria-labelledby="formLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="formLabel">
                Add Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* enter the note */}
            <div className="modal-body">
              <form action="" className="form" onSubmit={handleSubmit}>
                <div className="form-floating p-2">
                  <textarea
                    onChange={(e) => setNote(e.target.value)}
                    className="form-control"
                    name="newNote"
                    id="note"
                  />
                  <label htmlFor="note">new note</label>
                </div>
                {/* categories select option */}
                <div className="form-floating p-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                    id="category"
                    aria-label="select a category"
                  >
                    {categoriesList?.map((category: string, i) => (
                      <option key={i} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="category">under category</label>
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-success"
                  >
                    create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
