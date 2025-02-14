let walletName = 'My Wallet';
let currencies = {
    sugarCube: 0,  // Changed from dollar
    crumbs: 0,     // Changed from dime
    pebble: 0      // Changed from quarter
};

// Update display of each currency
function updateDisplay() {
    // Check if the currencies object has been initialized properly
    document.getElementById('sugarCubeDisplay').textContent = `You have: ${currencies.sugarCube} Sugar Cubes`;
    document.getElementById('crumbsDisplay').textContent = `You have: ${currencies.crumbs} Crumbs`;
    document.getElementById('pebbleDisplay').textContent = `You have: ${currencies.pebble} Pebbles`;
}

// Change wallet name
function changeWalletName() {
    walletName = document.getElementById('walletNameInput').value;
    document.getElementById('walletName').textContent = walletName;
}

// Clear wallet data with a confirmation prompt
function clearData() {
  const confirmClear = confirm('Are you sure you want to clear all wallet data? This action cannot be undone.');
  
  if (confirmClear) {
      walletName = 'My Wallet';  // Reset wallet name to default
      currencies = {            // Reset all currency values
          sugarCube: 0,
          crumbs: 0,
          pebble: 0
      };
      
      document.getElementById('walletName').textContent = walletName;  // Reset the displayed wallet name
      updateDisplay();  // Update the displayed values for currencies
      saveData();  // Save the cleared data
      alert('All wallet data has been cleared!');
  }
}

// Update amount based on the button clicked (add or remove)
function updateAmount(currency, action) {
    const amount = parseInt(document.getElementById(`${currency}Amount`).value);
    if (isNaN(amount) || amount <= 0) return;

    if (action === 'add') {
        currencies[currency] += amount;
    } else if (action === 'remove' && currencies[currency] >= amount) {
        currencies[currency] -= amount;
    }

    updateDisplay();
    saveData(); // Save after each change
}

// Save data using the current saveData function and display an alert
function saveWalletData() {
  saveData(); // Use the existing saveData function to save wallet data
  alert('Saved data');
}

// Export wallet data as a JSON file
function exportData() {
    const data = {
        walletName: walletName,
        currencies: currencies
    };
    const dataStr = JSON.stringify(data, null, 2);
    
    // Create a Blob from the data and generate a download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${walletName}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Display JSON string in the textarea
    document.getElementById('dataInput').value = dataStr;
    
    alert('Data exported as a JSON file!');
}

// Import wallet data from pasted text or uploaded JSON file
function importData() {
    const dataStr = document.getElementById('dataInput').value;
    if (dataStr.trim()) {
        try {
            const data = JSON.parse(dataStr);
            walletName = data.walletName;
            currencies = data.currencies;
            document.getElementById('walletName').textContent = walletName;
            updateDisplay();
            saveData(); // Save after importing
            alert('Data imported successfully!');
        } catch (e) {
            alert('Invalid data format');
        }
    }
}

// Handle file upload and import JSON
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function() {
            try {
                const data = JSON.parse(reader.result);
                walletName = data.walletName;
                currencies = data.currencies;
                document.getElementById('walletName').textContent = walletName;
                updateDisplay();
                saveData(); // Save after importing
                alert('Data imported from file successfully!');
            } catch (e) {
                alert('Invalid file format');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file');
    }
}

// Save wallet data to localStorage
function saveData() {
    const data = {
        walletName: walletName,
        currencies: currencies
    };
    localStorage.setItem('walletData', JSON.stringify(data));
}

// Load wallet data from localStorage
function loadData() {
    const savedData = localStorage.getItem('walletData');
    if (savedData) {
        const data = JSON.parse(savedData);
        walletName = data.walletName;
        currencies = data.currencies;  // Make sure we set the currencies from saved data
        document.getElementById('walletName').textContent = walletName;
        updateDisplay();  // Call updateDisplay to set the values correctly
    }
}

// Light/Dark Mode Toggle
function toggleMode() {
    const body = document.body;
    const mode = body.classList.contains('dark-mode') ? 'light' : 'dark';
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(`${mode}-mode`);
    localStorage.setItem('mode', mode); // Store mode in localStorage
}

// Check saved mode in localStorage and apply
function checkMode() {
    const savedMode = localStorage.getItem('mode') || 'light';
    document.body.classList.add(`${savedMode}-mode`);
}

// Initialize display on page load
window.onload = function() {
    loadData(); // Load wallet data from localStorage
    checkMode(); // Check and apply saved mode
    updateDisplay();
};