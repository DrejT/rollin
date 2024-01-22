import { useState } from "react";
import { CreateModalForm } from "../components/create";
import DisplayTodo from "../components/display";
import { GlobalContext, globalContextProps } from "../utils/context";

export default function HomeTodo() {
  const [fetchNotes, setFetchNotes] = useState(true);
  const [fetchCategories, setfetchCategories] = useState<boolean>(true);
  const contextValue: globalContextProps = {
    fetchNotes,
    setFetchNotes,
    fetchCategories,
    setfetchCategories,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      <div className="row">
        <div className="col">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="d-block" style={{ width: "500px" }}>
              <div className="m-4 d-block">
                <div className="d-flex float-end py-0">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-primary dropdown-toggle m-0"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-plus"></i>
                      add
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-blockquote-right"></i>category
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#createModalForm"
                        >
                          <i className="bi bi-plus"></i>note
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <DisplayTodo />
              </div>
              <div className="d-flex justify-content-center">
                <CreateModalForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}
