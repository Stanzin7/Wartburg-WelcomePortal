// Screen class for generating HTML for each screen
class Screen {
  constructor(header, question, answers = {}, datapoint = null) {
    this.header = header;
    this.question = question;
    this.answers = answers;
    this.datapoint = datapoint; //Database mapping
  }

  addAnswer(answerText, nextScreenId) {
    this.answers[answerText] = nextScreenId;
  }

  toHTML(screenId) {
    let html = `<div class="screen-container" data-screen-id="${screenId}">
                      <h2>Edit Screen: ${screenId}</h2>
                      <div>
                          <label for="header-${screenId}">Header:</label>
                          <input type="text" id="header-${screenId}" name="header" value="${
      this.header || ""
    }" />
                      </div>
                      <div>
                          <label for="question-${screenId}">Question:</label>
                          <input type="text" id="question-${screenId}" name="question" value="${
      this.question || ""
    }" />
                      </div>
                      <div id="answersContainer-${screenId}">`;

    Object.keys(this.answers).forEach((answerText, index) => {
      html += `<div class="answer-group">
                        <label for="answerText${index}-${screenId}">Answer Text ${
        index + 1
      }:</label>
                        <input type="text" id="answerText${index}-${screenId}" name="answerText${index}" value="${answerText}" />
                        <label for="nextScreenId${index}-${screenId}">Next Screen ID ${
        index + 1
      }:</label>
                        <input type="text" id="nextScreenId${index}-${screenId}" name="nextScreenId${index}" value="${
        this.answers[answerText]
      }" />
                     </div>`;
    });

    html += `</div><button type="button" class="btn add-answer-btn" onclick="addAnswerField('${screenId}')">Add Answer</button>
                 </div>`;

    return html;
  }
}
// populateOfficeList function for fetching the list of offices from the API
function populateOfficeList() {
  fetch("http://pcontent.wartburg.edu/WrtApi/api/ArcOfficeConfig/GetAllOffices")
    .then((response) => response.json())
    .then((offices) => {
      const officeList = document.getElementById("officeList");
      officeList.innerHTML = "";
      offices.forEach((office) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = office.officeName;
        a.onclick = () => showForm(office.officeName);
        li.appendChild(a);
        officeList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching office list:", error);
    });
}
document.addEventListener("DOMContentLoaded", populateOfficeList);

// Functions for dynamic form generation and interaction
let screenCount = 1;

function fetchJsonForDepartment(department) {
  return Promise.resolve({
    screens: {
      screen1: new Screen("Sample Header 1", "Sample Question 1", {
        Yes: "screen2",
      }),
    },
  });
}

function addNewOffice() {
  var officeName = prompt("Please enter the new office name:");
  if (officeName) {
    var menu = document.querySelector(".menu ul");
    var newOfficeLi = document.createElement("li");
    newOfficeLi.innerHTML = `<a href="#" onclick="showForm('${officeName}')">${officeName}</a>`;
    menu.appendChild(newOfficeLi);
  }
}

function showForm(department) {
  fetchJsonForDepartment(department).then((jsonData) => {
    var contentDiv = document.getElementById("content");
    var formHtml = `<div id="form-container">
      <h1>${department} Department</h1>
      <form id="jsonForm-${department}">`;

    Object.keys(jsonData.screens).forEach((screenId) => {
      let screen = jsonData.screens[screenId];
      formHtml += screen.toHTML(screenId);
    });

    formHtml += `</div>
      <div class="button-row">
        <button type="button" class="btn submit-btn" onclick="saveChanges('${department}')">Submit</button>
        <button type="button" class="btn add-new-screen-btn" onclick="addNewScreen('${department}')">Add New Screen</button>
      </div>
    </form>`;

    contentDiv.innerHTML = formHtml;
  });
}

function addAnswerField(screenId) {
  let answersContainer = document.getElementById(
    `answersContainer-${screenId}`
  );
  let newAnswerIndex =
    answersContainer.querySelectorAll(".answer-group").length + 1;

  let newAnswerHtml = `<div class="answer-group">
    <label for="answerText${newAnswerIndex}-${screenId}">Answer Text ${newAnswerIndex}:</label>
    <input type="text" id="answerText${newAnswerIndex}-${screenId}" name="answerText${newAnswerIndex}" />
    <label for="nextScreenId${newAnswerIndex}-${screenId}">Next Screen ID ${newAnswerIndex}:</label>
    <input type="text" id="nextScreenId${newAnswerIndex}-${screenId}" name="nextScreenId${newAnswerIndex}" />
  </div>`;

  answersContainer.insertAdjacentHTML("beforeend", newAnswerHtml);
}

function addNewScreen(department) {
  screenCount++;
  let newScreenId = `screen${screenCount}`;
  let screen = new Screen("", "");
  let formContainer = document.getElementById(`jsonForm-${department}`);
  if (!formContainer) {
    console.error("Form container not found for department:", department);
    return;
  }

  formContainer.insertAdjacentHTML("beforeend", screen.toHTML(newScreenId));
}

// Functions for saving changes to a JSON file
function saveChanges(department) {
  const jsonData = getFormDataAsJson(department);
  const jsonString = JSON.stringify(jsonData);
  console.log(jsonString);

  // Create a Blob from the jsonData
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${department}-config.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  alert("Changes have been saved as a file.");
}
function getFormDataAsJson(department) {
  const form = document.getElementById(`jsonForm-${department}`);
  const screens = form.querySelectorAll(".screen-container");
  let jsonData = { officeName: department, officeConfig: { screens: {} } };

  screens.forEach((screen) => {
    const screenId = screen.getAttribute("data-screen-id");
    const header = screen.querySelector(`#header-${screenId}`).value;
    const question = screen.querySelector(`#question-${screenId}`).value;
    const answersContainers = screen.querySelectorAll(".answer-group");
    let answers = {};

    answersContainers.forEach((container) => {
      const answerInputs = container.querySelectorAll("input");
      const answerText = answerInputs[0].value.trim();
      const nextScreenId = answerInputs[1].value.trim();

      answers[answerText] = answerText ? nextScreenId : null;

      if (!nextScreenId) {
        answers[answerText] = null;
      }
    });

    jsonData.officeConfig.screens[screenId] = {
      header,
      question,
      answers: Object.keys(answers).length ? answers : null,
    };
  });

  return jsonData;
}
