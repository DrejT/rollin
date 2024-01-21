import { useState } from "react";
import { CreateForm } from "../components/create";
import DisplayTodo from "../components/display";
import { GlobalContext, globalContextProps } from "../utils/context";

export default function HomeTodo() {
  const [active, setActive] = useState(false);
  const [fetchNotes, setFetchNotes] = useState(true);
  const contextValue: globalContextProps = {
    fetchNotes,
    setFetchNotes,
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
                  <button className="btn btn-primary p-2">
                    <i className="bi bi-plus"></i>category
                  </button>
                </div>
                <DisplayTodo />
              </div>
              <div className="d-flex justify-content-center">
                {active ? (
                  <CreateForm active setActive={setActive} />
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setActive(!active)}
                  >
                    <i className="bi bi-plus"></i>Note
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}
