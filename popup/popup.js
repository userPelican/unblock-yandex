const hostnameInput = document.getElementById('hostname')

const query = { active: true, currentWindow: true }

chrome.tabs.query(query, tabs => {
    hostnameInput.value = tabs[0].url
})