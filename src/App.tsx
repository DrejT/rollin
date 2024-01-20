// import moment from "moment";
import Layout from "./components/layout";
import HomeTodo from "./pages/home";
import { createBoardDB } from "./utils/indexdb";

function App() {
  createBoardDB();
  // const currentDate = moment().format("MMM Do YY");

  return (
    <>
      <Layout>
        <HomeTodo />
      </Layout>
    </>
  );
}

export default App;
