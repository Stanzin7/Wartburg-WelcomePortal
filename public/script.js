let currentScreenId = "screen1"; // Starting screen ID
let jsonData;

async function init() {
  try {
    // Fetch the JSON data from the API
    // Replace the fetch URL with the local proxy endpoint
    const response = await fetch("/api/proxy");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Parse the officeConfig string to JSON
    jsonData = JSON.parse(data.officeConfig);
    console.log("JSON data:", jsonData);

    renderCurrentScreen();
  } catch (e) {
    console.error("Error loading JSON data:", e);
  }
}

// Render the current screen based on JSON data
function renderCurrentScreen() {
  const screenData = jsonData.screens[currentScreenId];
  const container = document.getElementById("dynamicScreenContainer");
  container.innerHTML = "";

  // Append content based on screen data
  if (screenData.header) {
    const header = document.createElement("h2");
    header.textContent = screenData.header.replace("{FirstName}", "User"); // Replace with dynamic data if needed
    container.appendChild(header);
  }

  if (screenData.question) {
    const question = document.createElement("p");
    question.textContent = screenData.question;
    container.appendChild(question);
  }

  if (screenData.answers) {
    Object.keys(screenData.answers).forEach((answerText) => {
      const button = document.createElement("button");
      button.textContent = answerText;
      button.addEventListener("click", () => {
        currentScreenId = screenData.answers[answerText];
        renderCurrentScreen();
      });
      container.appendChild(button);
    });
  }
}

window.onload = init;
