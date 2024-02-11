// import moment from "moment";
import Layout from "./components/layout";
import HomeTodo from "./pages/home";
import { createTodoDB } from "./utils/indexdb";
import { initWebSocket } from "./utils/websocket";

function App() {
  createTodoDB();
  initWebSocket();
  // const [send, setSend] = useState<boolean>(true);
  // const [conn, setConn] = useState<boolean>(false);
  // useEffect(() => {
  //   async function sendData() {
  //     try {
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   if (send) {
  //     sendData();
  //     setSend(!send);
  //   }
  // }, [send]);
  // const currentDate = moment().format("MMM Do YY");
  // const [sync, setSync] = useState<boolean>(true);
  // useEffect(() => {
  //   try {
  //     async function checkDevices() {
  //       try {
  //         const devicesList = (await getDevicesList()) as string[];
  //         await initWebSocket(devicesList);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     if (sync) {
  //       checkDevices();
  //       setSync(!sync);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [sync]);
  return (
    <>
      <Layout>
        <HomeTodo />
      </Layout>
    </>
  );
}

export default App;
