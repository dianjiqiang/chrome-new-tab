window.onload = function() {
  const request = indexedDB.open("videoDB", 1);

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos", { keyPath: "id" });
    }
  };

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(["videos"], "readonly");
    const objectStore = transaction.objectStore("videos");
    const getRequest = objectStore.get("backgroundVideo");

    getRequest.onsuccess = function(event) {
      const videoData = event.target.result;

      if (videoData) {
        const videoElement = document.getElementById('backgroundVideo');
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
          videoElement.src = e.target.result;
        };

        fileReader.readAsDataURL(videoData.file);
      } else {
        console.log("No video background set.");
      }
    };

    getRequest.onerror = function() {
      console.log("Error retrieving video background.");
    };
  };

  request.onerror = function() {
    console.log("Error opening database.");
  };
};

document.getElementById('search-input').addEventListener('input', function() {
  const query = this.value;
  
  if (query.length > 0) {
    fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        const suggestions = data[1];
        const suggestionsContainer = document.getElementById('suggestions');
        suggestionsContainer.innerHTML = '';

        suggestions.forEach(suggestion => {
          const div = document.createElement('div');
          div.textContent = suggestion;
          div.addEventListener('click', () => {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`;
          });
          suggestionsContainer.appendChild(div);
        });
      })
      .catch(error => console.error('Error fetching suggestions:', error));
  } else {
    document.getElementById('suggestions').innerHTML = '';
  }
});
