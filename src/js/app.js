let walletName = 'My Wallet';
let currencies = {
    sugarCube: 0, 
    crumbs: 0,
    pebble: 0
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
        transactions = []; // Clear all transactions
        
        document.getElementById('walletName').textContent = walletName;  // Reset the displayed wallet name
        updateDisplay();  // Update the displayed values for currencies
        updateTransactionList(); // Update the transaction list
        saveData();  // Save the cleared data
        alert('All wallet data has been cleared!');
    }
}


// Update amount based on the button clicked (add or remove)
function updateAmount(currency, action, amountNum) {
    //const amount = parseInt(document.getElementById(`${currency}Amount`).value);
    var amount = parseInt(amountNum)
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
    var transactionssort = (transactions && transactions.length) ? transactions.sort(({id: a}, {id: b}) => Number(a.replace('transaction-', '')) - Number(b.replace('transaction-', ''))) : [];
    const data = {
        walletName: walletName,
        currencies: currencies,
        transactions: transactionssort // Save the transactions data as well
    };
    localStorage.setItem('walletData', JSON.stringify(data));
}


// Load wallet data from localStorage
function loadData() {
    const savedData = localStorage.getItem('walletData');
    if (savedData) {
        const data = JSON.parse(savedData);
        walletName = data.walletName;
        currencies = data.currencies;
        transactions = data.transactions || []; // Load transactions if present
        document.getElementById('walletName').textContent = walletName;
        updateDisplay();
        updateTransactionList(); // Update the transaction list
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

function getData() {
    var data = localStorage.getItem('walletData');
    return JSON.parse(data);
}

// Transactions
let transactions = []; // This will hold all the transactions
let selectedTransaction = null; // This will store the currently selected transaction
let selectedTransactionElement = null;

// Modify the transaction structure
function addTransaction() {;
    const transactionId = `transaction-${Date.now()}`;
    const transaction = {
        id: transactionId,
        desc: "No Description.",
        otherAnt: "None",
        date: toISOLocal(new Date(Date.now())),
        amount1: { sugarCube: 0, crumbs: 0, pebble: 0, custom: "No Items." },  // First currency
        amount2: { sugarCube: 0, crumbs: 0, pebble: 0, custom: "No Items." },  // Second currency
    };
    transactions.push(transaction);
    updateTransactionList();
    saveData();
    // selectTransaction(transaction); // Automatically select this new transaction
}


function toISOLocal(adate) {
    var localdt = new Date(adate - adate.getTimezoneOffset()*60000);
    return localdt.toISOString().slice(0, -1).slice(0, 19);
}

// Update the transaction details UI to include amount1 and amount2
function updateTransactionDetails() {
    const detailsElement = document.getElementById('transactionDetails');
    if(selectedTransaction == null) return detailsElement.innerHTML = '';
    detailsElement.innerHTML = `
        <div class="flexWrap">
            <div>
                <p><strong>ID:</strong> ${selectedTransaction.id}</p>
                <p><strong>Description:</strong> <p class="nonediting">${selectedTransaction.desc}</p> <textarea id="transactionDescription" class="editing">${selectedTransaction.desc}</textarea></p>
                <p><strong>With:</strong> <p class="nonediting">${selectedTransaction.otherAnt}</p> <input type="text" id="transactionOtherAnt" value="${selectedTransaction.otherAnt}" class="editing"/></p>
                <p><strong>Date:</strong> <p class="nonediting">${new Date(selectedTransaction.date).toLocaleString()}</p><input id="dateset" class="editing" type="datetime-local" value=${selectedTransaction.date}></p>
            </div>
            <div>
                <p><strong>Amount (You):</strong></p>
                <p>Sugar Cubes: <p class="nonediting">${selectedTransaction.amount1.sugarCube}</p> <input type="number" id="transactionAmount1SugarCube" value="${selectedTransaction.amount1.sugarCube}" class="editing"/></p>
                <p>Crumbs: <p class="nonediting">${selectedTransaction.amount1.crumbs}</p> <input type="number" id="transactionAmount1Crumbs" value="${selectedTransaction.amount1.crumbs}" class="editing"/></p>
                <p>Pebbles: <p class="nonediting">${selectedTransaction.amount1.pebble}</p> <input type="number" id="transactionAmount1Pebble" value="${selectedTransaction.amount1.pebble}" class="editing"/></p>
                <p>Item(s): <p class="nonediting">${selectedTransaction.amount1.custom}</p> <input type="text" id="transactionAmount1Custom" value="${selectedTransaction.amount1.custom}" class="editing"/></p>
            </div>
            <div>
                <p><strong>Amount (Other):</strong></p>
                <p>Sugar Cubes: <p class="nonediting">${selectedTransaction.amount2.sugarCube}</p> <input type="number" id="transactionAmount2SugarCube" value="${selectedTransaction.amount2.sugarCube}" class="editing"/></p>
                <p>Crumbs: <p class="nonediting">${selectedTransaction.amount2.crumbs}</p> <input type="number" id="transactionAmount2Crumbs" value="${selectedTransaction.amount2.crumbs}" class="editing"/></p>
                <p>Pebbles: <p class="nonediting">${selectedTransaction.amount2.pebble}</p> <input type="number" id="transactionAmount2Pebble" value="${selectedTransaction.amount2.pebble}"class="editing" /></p>
                <p>Item(s): <p class="nonediting">${selectedTransaction.amount2.custom}</p> <input type="text" id="transactionAmount2Custom" value="${selectedTransaction.amount2.custom}" class="editing"/></p>
            </div>
        </div>
        <button id="saveTransactionButton" class="editing" onclick="saveTransactionDetails()">Save Changes</button>
    `;
}

// Toggle the edit button and show the save button
function toggleEditTransaction() {
    const transactionDetails = document.getElementById('transactionDetails');
    const toggleButton = document.getElementById('toggleEditButton');
    
    const isEditing = transactionDetails.classList.contains("edit");
    
    toggleButton.textContent = isEditing ? 'Edit' : 'Cancel Edit';
    transactionDetails.classList = isEditing ? '' : 'edit';
}

// Save the updated transaction details
function saveTransactionDetails() {
    if (!selectedTransaction) return;

    const updatedAmount1 = {
        sugarCube: parseInt(document.getElementById('transactionAmount1SugarCube').value) || 0,
        crumbs: parseInt(document.getElementById('transactionAmount1Crumbs').value) || 0,
        pebble: parseInt(document.getElementById('transactionAmount1Pebble').value) || 0,
        custom: document.getElementById('transactionAmount1Custom').value || "No Items."
    };
    

    const updatedAmount2 = {
        sugarCube: parseInt(document.getElementById('transactionAmount2SugarCube').value) || 0,
        crumbs: parseInt(document.getElementById('transactionAmount2Crumbs').value) || 0,
        pebble: parseInt(document.getElementById('transactionAmount2Pebble').value) || 0,
        custom: document.getElementById('transactionAmount2Custom').value || "No Items."
    };

    selectedTransaction.amount1 = updatedAmount1;
    selectedTransaction.amount2 = updatedAmount2;
    selectedTransaction.date = document.getElementById('dateset').value
    selectedTransaction.desc = document.getElementById('transactionDescription').value;
    selectedTransaction.otherAnt = document.getElementById('transactionOtherAnt').value;
    selectedTransaction.id = `transaction-${new Date(document.getElementById('dateset').value).valueOf()}`
    
    saveData(); // Save the updated data
    toggleEditTransaction()
    updateTransactionList();
    updateTransactionDetails();
    alert('Transaction details updated successfully!');
}


// Update the transaction list with the latest data
function updateTransactionList() {
    const transactionListElement = document.getElementById('transactionList');
    transactionListElement.innerHTML = '';
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = transaction.desc;
        li.onclick = () => selectTransaction(transaction, li);
        transactionListElement.prepend(li);
        if(selectedTransaction != null && selectedTransaction == transaction) selectTransaction(transaction, li);
    });
}

function selectTransaction(transaction, element = null) {
    selectedTransaction = transaction;
    selectedTransactionElement = element;
    if(element) {
        if(element.classList.contains('selected')){
            element.classList.remove('selected')
            selectedTransaction = null;
            selectedTransactionElement = null;
        } else {
            document.querySelectorAll('[class^="selected"]').forEach((elemAs) => {
                elemAs.classList.remove('selected')
            })
            element.classList = "selected";
            selectedTransaction = transaction;
            selectedTransactionElement = element;
        }
    }
    updateTransactionDetails()
}

function removeTransaction() {
    if (!selectedTransaction) return alert('No transaction selected for removing');

    const transactionIndex = transactions.indexOf(selectedTransaction);
    if (transactionIndex > -1) {
        transactions.splice(transactionIndex, 1);
    }
    updateTransactionList();
    clearTransactionDetails(); // Clear the details display
    saveData(); // Save the data after removal
}

function clearTransactionDetails() {
    document.getElementById('transactionDetails').innerHTML = '';
    selectedTransaction = null;
}

function exchangeCurrency() {
    let walletData = getData(); // Retrieve the wallet data
    let sourceCurrency = document.getElementById('sourceCurrency').value;
    let targetCurrency = document.getElementById('targetCurrency').value;
    let sourceAmount = parseInt(document.getElementById('sourceAmount').value);

    // Validate the source amount (ensure it's a positive whole number)
    if (isNaN(sourceAmount) || sourceAmount <= 0 || sourceAmount % 1 !== 0) {
        alert('Please enter a valid whole number amount');
        return;
    }

    // Check if user has enough of the source currency
    if (walletData.currencies[sourceCurrency] < sourceAmount) {
        alert(`Not enough ${sourceCurrency} in your wallet!`);
        return;
    }

    const exchangeRates = {
        "sugarCube": {
            "crumbs": 10,
            "pebble": 100
        },
        "crumbs": {
            "sugarCube": 0.1,
            "pebble": 10
        },
        "pebble": {
            "sugarCube": 0.01,
            "crumbs": 0.1
        }
    };
    
    // Check if exchange is valid
    if (sourceCurrency === targetCurrency) {
        alert('You cannot exchange the same currency!');
        return;
    }
    
    // Get the exchange rate from the table
    const exchangeRate = exchangeRates[sourceCurrency]?.[targetCurrency];
    
    // Perform exchange if the exchange rate exists
    if (exchangeRate !== undefined) {
        // Calculate the total amount you could exchange
        let totalNewAmount = sourceAmount * exchangeRate;

        // Find the maximum possible whole number amount that can be exchanged
        let maxExchangeableAmount = Math.floor(sourceAmount * exchangeRate);
        
        // The leftover amount is the difference
        let leftoverAmount = totalNewAmount - maxExchangeableAmount;
        
        // Exchange the maximum whole number amount
        if (maxExchangeableAmount > 0) {
            updateAmount(sourceCurrency, 'remove', sourceAmount - Math.floor(leftoverAmount / exchangeRate));
            updateAmount(targetCurrency, 'add', maxExchangeableAmount);
        }

        // Update the wallet with the remaining leftover amount
        if (leftoverAmount > 0) {
            alert(`Could not exchange ${Math.floor(leftoverAmount*100)} of ${sourceCurrency}, as it couldn't be converted into a whole number.`);
        }

        saveData();
        alert(`Exchanged ${sourceAmount - Math.floor(leftoverAmount / exchangeRate)} ${sourceCurrency} to ${maxExchangeableAmount} ${targetCurrency}.`);
    } else {
        alert('Invalid exchange between selected currencies!');
    }
}

// Initialize display on page load
window.onload = function() {
    loadData(); // Load wallet data from localStorage
    checkMode(); // Check and apply saved mode
    updateDisplay();
};