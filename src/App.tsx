// import moment from "moment";
import Layout from "./components/layout";
import HomeTodo from "./pages/home";
import { createTodoDB } from "./utils/indexdb";

function App() {
  createTodoDB();
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
