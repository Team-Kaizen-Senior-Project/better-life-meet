// composables/useHMS.js
import { ref, onUnmounted } from 'vue';
import {
  HMSReactiveStore,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectPeers,
  selectIsConnectedToRoom,
} from "@100mslive/hms-video-store";

export function useHMS() {
  const hmsManager = new HMSReactiveStore();
  hmsManager.triggerOnSubscribe();
  const hmsStore = hmsManager.getStore();
  const hmsActions = hmsManager.getActions();

  const peers = ref([]);
  const isConnected = ref(false);
  const isLocalAudioEnabled = ref(false);
  const isLocalVideoEnabled = ref(false);

  // Subscribe to peer updates
  hmsStore.subscribe((currentPeers) => {
    peers.value = currentPeers;
  }, selectPeers);

  // Subscribe to connection state changes
  hmsStore.subscribe((connectionStatus) => {
    isConnected.value = connectionStatus;
  }, selectIsConnectedToRoom);

  // Subscribe to local audio state changes
  hmsStore.subscribe((audioEnabled) => {
    isLocalAudioEnabled.value = audioEnabled;
  }, selectIsLocalAudioEnabled);

  // Subscribe to local video state changes
  hmsStore.subscribe((videoEnabled) => {
    isLocalVideoEnabled.value = videoEnabled;
  }, selectIsLocalVideoEnabled);

  async function joinRoom(userName, roomCode) {
    // Example: Fetch authToken using roomCode. Implement your method to fetch the token.
    const authToken = await fetchAuthToken(roomCode); // Implement fetchAuthToken

    hmsActions.join({
      userName,
      authToken,
    });
    
    console.log("Joining room with", userName, roomCode);
  }

  async function leaveRoom() {
    await hmsActions.leave();
  }

  function toggleLocalAudio() {
    const currentState = isLocalAudioEnabled.value;
    hmsActions.setLocalAudioEnabled(!currentState);
  }

  function toggleLocalVideo() {
    const currentState = isLocalVideoEnabled.value;
    hmsActions.setLocalVideoEnabled(!currentState);
  }

  onUnmounted(() => {
    leaveRoom();
  });

  // Implement fetchAuthToken based on your backend or service
  async function fetchAuthToken(roomCode) {
    // Fetch auth token logic here
    // Example:
    // const response = await fetch(`/api/getAuthToken?roomCode=${roomCode}`);
    // const data = await response.json();
    // return data.authToken;
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NWVmOWExMzFkNWZkNzQ5Y2QxZjIxZWIiLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2NWVmOWExZWJkYzU2OWYwNGQ5ZGE4NDQiLCJ1c2VyX2lkIjoiOTc2MjFhMTEtZWYyZS00OWFiLWIzYmEtODgxZDlhNmM2YzY1IiwiZXhwIjoxNzEwMzY1ODU1LCJqdGkiOiJhZDE1ZmU1MC03YTc0LTQxZTYtYmFlNi0zMDM2N2RkZWE5ZWMiLCJpYXQiOjE3MTAyNzk0NTUsImlzcyI6IjY1ZWY5YTEzMWQ1ZmQ3NDljZDFmMjFlOSIsIm5iZiI6MTcxMDI3OTQ1NSwic3ViIjoiYXBpIn0.I6PBR1UdaXUBkjPidEeJ2fUt4Pm3BqWwSk3Q-ZlM8F0"; // Replace this with actual token fetching logic
  }

  return {
    joinRoom,
    leaveRoom,
    toggleLocalAudio,
    toggleLocalVideo,
    peers,
    isConnected,
    isLocalAudioEnabled,
    isLocalVideoEnabled,
  };
}
