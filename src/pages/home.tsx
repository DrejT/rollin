import { useState } from "react";
import { CreateForm } from "../components/create";
import DisplayTodo from "../components/display";

export default function HomeTodo() {
  const [active, setActive] = useState(false);
  return (
    <>
      <div className="row">
        <div className="col">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="d-block" style={{ width: "500px" }}>
              <div className="m-4 d-block">
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
                    <i className="bi bi-plus"></i>Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
