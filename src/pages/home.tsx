import React, { SetStateAction, useState, useContext } from "react";
import { CreateCategoryForm, CreateNoteForm } from "../components/create";
import DisplayTodo from "../components/display";
import { GlobalContext, globalContextProps } from "../utils/context";

export default function HomeTodo() {
  const [fetchNotes, setFetchNotes] = useState(true);
  const [fetchCategories, setfetchCategories] = useState<boolean>(true);
  const [createNav, setCreateNav] = useState<string>("note");
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
                      data-bs-auto-close="outside"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-plus"></i>
                      add
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <CreateNavbar
                        createNav={createNav}
                        setCreateNav={setCreateNav}
                      />
                      <CreateNavbarComponent createNav={createNav} />
                    </ul>
                  </div>
                </div>
                <DisplayTodo />
              </div>
              <div className="d-flex justify-content-center"></div>
            </div>
          </div>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}

interface createNavbarProps {
  createNav: string;
  setCreateNav: React.Dispatch<SetStateAction<string>>;
}

function CreateNavbar({ createNav, setCreateNav }: createNavbarProps) {
  const { fetchCategories, setfetchCategories } = useContext(
    GlobalContext
  ) as globalContextProps;
  return (
    <div className="" style={{ width: "250px" }}>
      <ul className="nav nav-tabs justify-content-start">
        <div className="d-flex">
          <li className="nav-item">
            <a
              id="note"
              onClick={(e) => setCreateNav(e.currentTarget.id)}
              className={`nav-link ${createNav === "note" ? "active" : ""}`}
              aria-current="page"
              href="#"
            >
              note
            </a>
          </li>
          <li className="nav-item">
            <a
              id="category"
              onClick={(e) => {
                setCreateNav(e.currentTarget.id);
                // change state of an unrendered component before to fetch items on it
                setfetchCategories(!fetchCategories);
              }}
              className={`nav-link ${createNav === "category" ? "active" : ""}`}
              href="#"
            >
              category
            </a>
          </li>
        </div>
      </ul>
    </div>
  );
}

interface createNavbarComponentProps {
  createNav: string;
}

function CreateNavbarComponent({ createNav }: createNavbarComponentProps) {
  switch (createNav) {
    case "note":
      return <CreateNoteForm />;
      break;
    case "category":
      return <CreateCategoryForm />;
      break;
    default:
      return <></>;
  }
}
