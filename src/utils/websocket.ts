import { PORT } from "./constants";
import {
  addMessageNote,
  addNewDevice,
  getDevicesList,
  getUser,
  note,
  pushToBuffer,
  user,
} from "./indexdb";

const API_URL = `ws://localhost:${PORT}`;
const socket = new WebSocket(API_URL);

function sendJSON(socket: WebSocket, obj: Object) {
  try {
    socket.send(JSON.stringify(obj));
  } catch (error) {
    console.log(error);
  }
}

interface createNoteMessage {
  newNote: note;
  uid: string;
  type: string;
}

interface newDeviceMessage {
  uid: string;
  newDeviceId: string;
  type: string;
}
// start a conn to wss and send deviceslist data to check if the
// friend device is online

export function initWebSocket() {
  try {
    // Connection opened
    socket.addEventListener("open", async (event) => {
      if (socket.readyState === 1) {
        await initSync();
      }
    });

    // Listen for messages
    socket.addEventListener("message", async (event) => {
      console.log(event);
      // object object is not valid json
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "createNote":
          console.log("recieved data", data);
          await handleNewNoteMessage(data);
          break;
        case "addDevice":
          console.log("recieved data", data);
          await handleNewDeviceMessage(data);
          break;
        case "syncDevices":
          console.log("recieved data", data);
          await handleNewConsumerMessage(data);
          break;
        default:
          break;
      }
    });

    socket.addEventListener("close", () => {
      console.log("closing conn");
    });

    socket.addEventListener("error", async function (error) {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}

export async function triggerCreateNewNoteEvent(newNote: note) {
  try {
    const data = {
      newNote: newNote,
      uid: newNote.uid,
      type: "createNote",
    };
    if (socket.readyState !== 1) {
      // socket not open
      // append note to array
      await pushToBuffer(newNote);
    } else {
      sendJSON(socket, data);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function triggerAddNewDeviceEvent(newDeviceId: string) {
  try {
    if (socket.readyState !== 1) {
      throw new Error(
        "please make sure you have an active internet connection"
      );
    }
    const user = (await getUser()) as user;
    const data = {
      uid: user.uid,
      newDeviceId: newDeviceId,
      type: "addDevice",
    };
    sendJSON(socket, data);
  } catch (error) {
    console.log(error);
  }
}

async function handleNewNoteMessage(obj: createNoteMessage) {
  try {
    const user = (await getUser()) as user;
    if (user.uid !== obj.uid) {
      await addMessageNote(obj.newNote);
    }
  } catch (error) {
    console.log(error);
  }
}

// function to handle the data when the host adds
async function handleNewDeviceMessage(obj: newDeviceMessage) {
  try {
    await addNewDevice(obj.newDeviceId);
  } catch (error) {
    console.log(error);
  }
}

async function handleNewConsumerMessage(obj: newDeviceMessage) {
  try {
    await addNewDevice(obj.uid);
  } catch (error) {
    console.log(error);
  }
}

export async function initSync() {
  try {
    const user = (await getUser()) as user;
    sendJSON(socket, {
      devicesList: user.devices,
      type: "syncDevices",
      uid: user.uid,
    });
  } catch (error) {
    console.log(error);
  }
}
