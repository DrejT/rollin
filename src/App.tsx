import moment from "moment";
import Layout from "./components/layout";
import HomeTodo from "./pages/home";
import { createBoardDB } from "./utils/indexdb";

function App() {
  // createUserDB();
  // createNoteDB();
  createBoardDB();
  const currentDate = moment().format("MMM Do YY");
  console.log(typeof currentDate);
  return (
    <>
      <Layout>
        <HomeTodo />
      </Layout>
    </>
  );
}

export default App;
