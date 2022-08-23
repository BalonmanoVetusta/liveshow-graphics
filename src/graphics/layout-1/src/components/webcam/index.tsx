import {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

enum MediaDeviceKind {
  videoinput = "videoinput",
  audioinput = "audioinput",
  audiooutput = "audiooutput",
}

export default function Webcam(): ReactElement | null {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamDevices, setStreamDevices] = useState<MediaDeviceInfo[]>([]);

  useLayoutEffect(() => {
    if (videoRef.current && navigator?.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          console.log({ stream });
          videoRef.current!.srcObject = stream;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [videoRef]);

  // Sample return streamDevices:
  //   [
  //     {
  //         "deviceId": "",
  //         "kind": "audioinput",
  //         "label": "",
  //         "groupId": "0ec5d3e4c3c5b34ffb2bfeeb37f3afbd2e6f1227e5d60674e8ebb30f642c2c75"
  //     },
  //     {
  //         "deviceId": "",
  //         "kind": "audiooutput",
  //         "label": "",
  //         "groupId": "3b0f5621f1f811aea9408cab4efc292816de15be88790c459927993f7e1ec2fc"
  //     },
  //     {
  //         "deviceId": "38347eb5fcca1cc494db55f259235865e9e3fb872f12f4a3af943a136802fe60",
  //         "kind": "videoinput",
  //         "label": "FaceTime HD Camera (Built-in) (05ac:8514)",
  //         "groupId": "5dec84223a012e14ae5b631e5c5f909319469adfb070f07dc73b4d5c9bfbcb3e"
  //     },
  //     {
  //         "deviceId": "1aa1982c8823508afa597d72f5743fdd019eab419f38c1c5fc8832bc88dfa831",
  //         "kind": "videoinput",
  //         "label": "Logi Capture",
  //         "groupId": "843423b677102f629e0c28683bcd3221bdff63bc91fc5eb28f96f812b4a92d2a"
  //     },
  //     {
  //         "deviceId": "4acbfb7db174266a2eb5eaac2fee9e1cbcda7d925c68946cccb9ad5fad86e3ed",
  //         "kind": "videoinput",
  //         "label": "OBS Virtual Camera (m-de:vice)",
  //         "groupId": "1cca099f4ef08b820cc015d086173911e48a7a6f6eba9121e6f8530035d35dad"
  //     }
  // ]

  useEffect(() => {
    const { navigator } = globalThis || window;

    if (!navigator?.mediaDevices?.enumerateDevices) return;

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => setStreamDevices(devices));
  }, []);

  return (
    <>
      <>{console.log({ streamDevices })}</>
      {streamDevices.length === 0 ? null : (
        <select name="devices" id="devices">
          <option value="null">Choose a device</option>
          {streamDevices
            .filter((device) => device.kind === MediaDeviceKind.videoinput)
            .map((device) => (
              <option>{`${device.kind}: ${device.label} id = ${device.deviceId}`}</option>
            ))}
        </select>
      )}
      <video autoPlay={true} ref={videoRef}></video>
    </>
  );
}
