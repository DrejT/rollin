import { useEffect, useState } from "react";
import { getDevicesList, getUser, user } from "../utils/indexdb";
import { triggerAddNewDeviceEvent } from "../utils/websocket";

export default function Setting() {
  return (
    <div>
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#settings-modal"
      >
        <i className="bi bi-gear-fill"></i>
      </button>
      <SettingModal />
    </div>
  );
}

function SettingModal() {
  return (
    <div
      className="modal fade"
      aria-labelledby="settings-label"
      aria-hidden="true"
      id="settings-modal"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="settings-label">
              Settings
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Options />
          </div>
          <div className="modal-footer">
            {/* <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function Options() {
  const [newDeviceID, setNewDeviceID] = useState<string>("");
  const [getUid, setGetUid] = useState<boolean>(true);
  const [uid, setUid] = useState<string>("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log("insdide submit", newDeviceID);
      if (newDeviceID.length < 16) {
        throw new Error("uid invlaid");
      }
      await triggerAddNewDeviceEvent(newDeviceID);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    async function fetchUid() {
      try {
        const user: user = (await getUser()) as user;
        setUid(user.uid);
      } catch (error) {
        console.log(error);
      }
    }
    if (getUid) {
      fetchUid();
    }
  }, [getUid]);
  return (
    <div>
      <div>your device id: {uid}</div>
      Add a new Device
      <form onSubmit={handleSubmit}>
        <div className="input-group flex-nowrap ">
          <span className="input-group-text" id="addon-wrapping">
            <i className="bi bi-pc-display"></i>
          </span>
          <input
            id="deviceId"
            name="device-id"
            type="text"
            className="form-control"
            placeholder="ndi-sin-dsm"
            onChange={(e) => setNewDeviceID(e.target.value)}
            aria-label="device-name"
            aria-describedby="addon-wrapping"
          />
          <button
            className="btn btn-outline-success bg-success-subtle rounded"
            type="submit"
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
        <div className="mt-2">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Devices
            </button>
            <ul className="dropdown-menu">
              <IterateDevices />
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}

function IterateDevices() {
  const [fetchDevices, setFetchDevices] = useState<boolean>(true);
  const [devicesList, setDevicesList] = useState<string[]>([]);
  useEffect(() => {
    try {
      async function getDevices() {
        try {
          const devicesList = (await getDevicesList()) as string[];
          setDevicesList(devicesList);
        } catch (error) {
          console.log(error);
        }
      }
      if (fetchDevices) {
        getDevices();
        setFetchDevices(!fetchDevices);
      }
    } catch (error) {
      console.log(error);
    }
  }, [devicesList, fetchDevices]);
  return (
    <>
      {devicesList &&
        devicesList?.map((deviceID, i) => {
          return (
            <div key={i}>
              <li>
                <a className="dropdown-item" href="#">
                  {deviceID}
                </a>
              </li>
            </div>
          );
        })}
    </>
  );
}
