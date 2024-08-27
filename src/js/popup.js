// document.getElementById('saveButton').addEventListener('click', () => {
//   const fileInput = document.getElementById('videoUpload');
//   const file = fileInput.files[0];

//   if (file) {
//     const request = indexedDB.open("videoDB", 1);

//     request.onupgradeneeded = function(event) {
//       const db = event.target.result;
//       if (!db.objectStoreNames.contains("videos")) {
//         db.createObjectStore("videos", { keyPath: "id" });
//       }
//     };

//     request.onsuccess = function(event) {
//       const db = event.target.result;
//       const transaction = db.transaction(["videos"], "readwrite");
//       const objectStore = transaction.objectStore("videos");

//       const videoData = {
//         id: "backgroundVideo",
//         file: file
//       };

//       const putRequest = objectStore.put(videoData);

//       putRequest.onsuccess = function() {
//         document.getElementById('status').textContent = "Video background saved!";
//       };

//       putRequest.onerror = function() {
//         document.getElementById('status').textContent = "Error saving video background.";
//       };
//     };

//     request.onerror = function() {
//       document.getElementById('status').textContent = "Error opening database.";
//     };
//   } else {
//     document.getElementById('status').textContent = "Please select a video file.";
//   }
// });
