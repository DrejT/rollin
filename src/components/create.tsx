import { FormEvent, useState } from "react";
import { type Category, addNote } from "../utils/indexdb.ts";

interface activeProps {
  active: boolean;
  setActive: (value: boolean) => void;
}

export function CreateForm({ active, setActive }: activeProps) {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Category>("learn");
  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      if (!note) {
        throw new Error("enter a valid note");
      }
      await addNote(note, category);
      setActive(!active);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="mb-3">
        <label htmlFor="note" className="form-label fs-4 open-sans">
          create note
        </label>
        <div className="float-end p-0">
          <button onClick={() => setActive(!active)} className="btn btn-danger">
            <i className="bi bi-x"></i>
          </button>
        </div>

        <textarea
          className="form-control"
          name=""
          id="note"
          cols={30}
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3 form-check">
        <fieldset className="">
          <div className="fs-4">category:</div>
          <div>
            <input
              className="form-check-input"
              type="radio"
              id="learn"
              name="category"
              value="learn"
              checked={category === "learn"}
              onChange={(e) => setCategory(e.target.value as Category)}
            />
            <label htmlFor="learn">learn</label>
          </div>
          <div>
            <input
              className="form-check-input"
              type="radio"
              id="build"
              name="category"
              value="build"
              checked={category === "build"}
              onChange={(e) => setCategory(e.target.value as Category)}
            />
            <label htmlFor="build">build</label>
          </div>
          <div>
            <input
              className="form-check-input"
              type="radio"
              id="manage"
              name="category"
              value="manage"
              checked={category === "manage"}
              onChange={(e) => setCategory(e.target.value as Category)}
            />
            <label htmlFor="manage">manage</label>
          </div>
        </fieldset>
      </div>
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
}
