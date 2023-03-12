const AUDIO_TYPE_ID = {
  INPUT: "FairlightAudioMixerInputSourceFaderGain",
  MASTER: "FairlightAudioMixerMasterOutFaderGain",
};

const AUDITO_SOURCE_ID = {
  MONO: "18446744073709486336",
  STEREO_LEFT: "18446744073709551360",
  STEREO_RIGHT: "18446744073709551361",
};

const AUDIO_INPUT = {
  CAM1: "Camera1",
  CAM2: "Camera2",
  CAM3: "Camera3",
  CAM4: "Camera4",
  CAM5: "Camera5",
  CAM6: "Camera6",
  CAM7: "Camera7",
  CAM8: "Camera8",
  MIC1: "ExternalMic",
  MIC2: "ExternalMic2",
  MASTER: "Master",
};

const AUDIO_STATUS = {
  ON: "On",
  OFF: "Off",
  AFV: "AudioFollowVideo",
};

function commandVolumeForInput(
  input,
  gain = 0,
  sourceId = AUDITO_SOURCE_ID.MONO
) {
  console.log(
    `<Op id="FairlightAudioMixerInputSourceFaderGain" input="${input}" sourceId="${sourceId}" gain="${gain}"/>`
  );
}

function commandForInputType(input, gain = 0, type = "MONOSTEREO") {
  if (type === "MONO") {
    commandVolumeForInput(input, gain, AUDITO_SOURCE_ID.MONO);
  }

  if (type === "STEREO") {
    commandVolumeForInput(input, gain, AUDITO_SOURCE_ID.STEREO_LEFT);
    commandVolumeForInput(input, gain, AUDITO_SOURCE_ID.STEREO_RIGHT);
  }

  if (type === "MONOSTEREO") {
    commandVolumeForInput(input, gain, AUDITO_SOURCE_ID.MONO);
    commandVolumeForInput(input, gain, AUDITO_SOURCE_ID.STEREO_LEFT);
    commandVolumeForInput(input, gain, AUDITO_SOURCE_ID.STEREO_RIGHT);
  }
}

function commandVolumeForMaster(gain = 0) {
  console.log(
    `<Op id="FairlightAudioMixerMasterOutFaderGain" gain="${gain}"/>`
  );
}

function commandForInputStatus(
  input,
  status = AUDIO_STATUS.OFF,
  sourceId = AUDITO_SOURCE_ID.MONO
) {
  console.log(
    `<Op id="FairlightAudioMixerInputSourceMixType" input="${input}" sourceId="${sourceId}" mixType="${status}" />`
  );
}

function generateProgresiveFade(
  input = "ExternalMic", // AUDIO_INPUT
  startVolume = 0,
  endVolume = -120.41,
  fps = 25,
  duration = 1000, // in milliseconds
  type = "MONOSTEREO", // "MONOSTEREO", "STEREO", "MONO"
  idx = 0
) {
  if (Array.isArray(input)) {
    return input.map((i) =>
      generateProgresiveFade(i, startVolume, endVolume, fps, duration, type)
    );
  }

  const nameOfInput =
    Object.keys(AUDIO_INPUT).find((v) => AUDIO_INPUT[v] === input) || input;
  const totalFps = Math.ceil((duration / 1000) * fps);
  const framesPerStep = Math.ceil(totalFps / fps);
  const steps = totalFps / framesPerStep;
  let totalVolume = endVolume - startVolume;
  const volumePerStep = totalVolume / steps;

  // Declare a Macro
  console.log(
    `<Macro index="${idx}" name="Fade ${nameOfInput} ${
      startVolume > endVolume ? "-" : "+"
    }" description="Fade ${input} from ${startVolume} to ${endVolume} in ${duration}ms">`
  );

  // Start Volume set & on
  if (endVolume > -120) {
    if (id === AUDIO_TYPE_ID.MASTER) {
      commandVolumeForMaster(startVolume);
    } else {
      commandForInputType(eachInput, startVolume, type);
      commandForInputStatus(eachInput, AUDIO_STATUS.ON, sourceId);
    }
  }

  // Fade
  let currentVolume = startVolume;
  for (let i = 1; i < steps; i++) {
    currentVolume += volumePerStep;
    // Master: `<Op id="FairlightAudioMixerMasterOutFaderGain" gain="${currentVolume}"/>`
    if (input === AUDIO_INPUT.MASTER) {
      commandVolumeForMaster(currentVolume);
    } else {
      commandForInputType(input, currentVolume, type);
    }

    console.log(`<Op id="MacroSleep" frames="${framesPerStep}"/>`);
  }

  if (input === AUDIO_INPUT.MASTER) {
    commandVolumeForMaster(endVolume);
  } else {
    commandForInputType(input, endVolume, type);
  }

  // Turn Off if endVolume is -120
  if (endVolume <= -120) {
    if (input !== AUDIO_INPUT.MASTER) {
      commandForInputStatus(input, AUDIO_STATUS.OFF, sourceId);
    }
  }

  console.log(`</Macro>`);
}

const idx = 0;
// const startVolume = 0;
const startVolume = -120.41;
const input = AUDIO_INPUT.CAM1; // Camera1, Camera2, Camera3, Camera4, ExternalMic & ExternalMic2
// const endVolume = -120.41;
const endVolume = 0;
const fps = 25;
const duration = 1000; // in milliseconds
const type = "MONOSTEREO"; // "MONOSTEREO", "STEREO", "MONO"

generateProgresiveFade(
  input, // AUDIO_INPUT
  startVolume,
  endVolume,
  fps,
  duration, // in milliseconds
  type, // "MONOSTEREO", "STEREO", "MONO"
  idx
);

// // On
// commandForInputStatus(
//   input,
//   status = AUDIO_STATUS.ON,
//   sourceId = AUDITO_SOURCE_ID.MONO
// )
// commandForInputStatus(
//   input,
//   status = AUDIO_STATUS.ON,
//   sourceId = AUDITO_SOURCE_ID.STEREO_LEFT
// )
// commandForInputStatus(
//   input,
//   status = AUDIO_STATUS.ON,
//   sourceId = AUDITO_SOURCE_ID.STEREO_RIGHT
// )

// // Off
// commandForInputStatus(
//   input,
//   status = AUDIO_STATUS.OFF,
//   sourceId = AUDITO_SOURCE_ID.MONO
// )
// commandForInputStatus(
//   input,
//   status = AUDIO_STATUS.OFF,
//   sourceId = AUDITO_SOURCE_ID.STEREO_LEFT
// )
// commandForInputStatus(
//   input,
//   status = AUDIO_STATUS.OFF,
//   sourceId = AUDITO_SOURCE_ID.STEREO_RIGHT
// )
