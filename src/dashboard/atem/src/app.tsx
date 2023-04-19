import { ReactElement, useEffect } from "react";
import { useAtemDiscover } from "./hooks/use-atem-discover";

function App(): ReactElement {
  const { startListening, devices, stopListening, updateDevices } =
    useAtemDiscover();

  useEffect(() => {
    return () => {
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>ATEM</h1>
      <button
        onClick={(event) => {
          event.preventDefault();
          console.log("start listening");
          startListening();
        }}
      >
        Start Listening for Atems
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          console.log("Updating devices");
          updateDevices();
        }}
      >
        Update Devices
      </button>

      <ul>
        {devices.map((device) => (
          <li key={device.name}>
            {device.name} - {device.address}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
