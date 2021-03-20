/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
const insertStreamButton = document.getElementById('insertStream');

callButton.disabled = true;
hangupButton.disabled = true;
startButton.addEventListener('click', start);
callButton.addEventListener('click', call);
hangupButton.addEventListener('click', hangup);
insertStreamButton.addEventListener('click', insertNewStream);

let startTime;
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

localVideo.addEventListener('loadedmetadata', function() {
  });

remoteVideo.addEventListener('loadedmetadata', function() {
  });

remoteVideo.addEventListener('resize', () => {
    // We'll use the first onsize callback as an indication that video has started
  // playing out.
  if (startTime) {
    const elapsedTime = window.performance.now() - startTime;
        startTime = null;
  }
});

let localStream;
let pc1;
let pc2;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function getName(pc) {
  return (pc === pc1) ? 'pc1' : 'pc2';
}

function getOtherPc(pc) {
  return (pc === pc1) ? pc2 : pc1;
}

async function start() {
    startButton.disabled = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
  } catch (e) {
    alert(`getUserMedia() error: ${e.name}`);
  }
}

async function insertNewStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
        localVideo.srcObject = stream;
    stream.getTracks().forEach(track => pc1.addTrack(track, stream));
    try {
      const offer = await pc1.createOffer(offerOptions);
      await onCreateOfferSuccess2(offer);
    } catch (e) {
      onCreateSessionDescriptionError(e);
    }
  } catch (e) {
    alert(`getUserMedia() error: ${e.name}`);
  }
}



function getSelectedSdpSemantics() {
  const sdpSemanticsSelect = document.querySelector('#sdpSemantics');
  const option = sdpSemanticsSelect.options[sdpSemanticsSelect.selectedIndex];
  return option.value === '' ? {} : {sdpSemantics: option.value};
}

async function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;
    startTime = window.performance.now();
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  if (videoTracks.length > 0) {
      }
  if (audioTracks.length > 0) {
      }
  const configuration = getSelectedSdpSemantics();
    pc1 = new RTCPeerConnection(configuration);
    pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));
  pc2 = new RTCPeerConnection(configuration);
    pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
  pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));
  pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
  pc2.addEventListener('track', gotRemoteStream);

  localStream.getVideoTracks().forEach(track => pc1.addTrack(track, localStream));

  try {
        const offer = await pc1.createOffer(offerOptions);
    await onCreateOfferSuccess(offer);
  } catch (e) {
    onCreateSessionDescriptionError(e);
  }
}

function onCreateSessionDescriptionError(error) {
  }

let dessssc=null;

async function onCreateOfferSuccess(desc) {
      try {
    await pc1.setLocalDescription(desc);
    onSetLocalSuccess(pc1);
  } catch (e) {
    onSetSessionDescriptionError();
  }

  dessssc = desc;

    try {
    await pc2.setRemoteDescription(desc);
    onSetRemoteSuccess(pc2);
  } catch (e) {
    onSetSessionDescriptionError();
  }

    // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  try {
    const answer = await pc2.createAnswer();
    await onCreateAnswerSuccess(answer);
  } catch (e) {
    onCreateSessionDescriptionError(e);
  }
}

async function onCreateOfferSuccess2(desc) {
      try {
    await pc1.setLocalDescription(desc);
    onSetLocalSuccess(pc1);
  } catch (e) {
    onSetSessionDescriptionError();
  }

  // console.log(dessssc.sdp)
  // console.log(desc.sdp)
    try {
    await pc2.setRemoteDescription(dessssc).then(r=>console.log('r: ',r)).catch(e=>console.log(e));
    onSetRemoteSuccess(pc2);

  console.log('PC2 getReceivers: ', pc2.getReceivers());
  } catch (e) {
    console.log(e)
    onSetSessionDescriptionError();
  }

    // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  try {
    const answer = await pc2.createAnswer();
    await onCreateAnswerSuccess(answer);
  } catch (e) {
    onCreateSessionDescriptionError(e);
  }
}

function onSetLocalSuccess(pc) {
  }

function onSetRemoteSuccess(pc) {
  }

function onSetSessionDescriptionError(error) {
  }

function gotRemoteStream(e) {
  console.log('PC2 onTrack');
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
      }
}

async function onCreateAnswerSuccess(desc) {
      try {
    await pc2.setLocalDescription(desc);
    onSetLocalSuccess(pc2);
  } catch (e) {
    onSetSessionDescriptionError(e);
  }
    try {
    await pc1.setRemoteDescription(desc);
    onSetRemoteSuccess(pc1);
  } catch (e) {
    onSetSessionDescriptionError(e);
  }
}

async function onIceCandidate(pc, event) {
  try {
    await (getOtherPc(pc).addIceCandidate(event.candidate));
    onAddIceCandidateSuccess(pc);
  } catch (e) {
    onAddIceCandidateError(pc, e);
  }
  }

function onAddIceCandidateSuccess(pc) {
  }

function onAddIceCandidateError(pc, error) {
  }

function onIceStateChange(pc, event) {
  if (pc) {
          }
}

function hangup() {
    pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}
