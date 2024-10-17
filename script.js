const btn = document.getElementById("startButton");
const studyDurationInput = document.getElementById("studyDuration");
const breakDurationInput = document.getElementById("breakDuration");

function studyDurationFunction(e) {
  e.preventDefault();
  const studyDuration = parseInt(studyDurationInput.value);
  const breakDuration = parseInt(breakDurationInput.value);

  const data = {
    study: studyDuration,
    break: breakDuration,
  };

  if (studyDurationInput.value && breakDurationInput.value) {
    window.localStorage.setItem("data", JSON.stringify(data));
    updateUI();
  }

  startTimer(
    data.study,
    data.break,
    studyDurationInput.value,
    breakDurationInput.value
  );

  studyDurationInput.value = "";
  breakDurationInput.value = "";
}

function updateUI() {
  const existingData = JSON.parse(localStorage.getItem("data"));
  let retrievedData = [];

  if (existingData) {
    retrievedData.push(existingData);
  }

  const output = document.querySelector(".container");
  let div1 = output.querySelector(".session-history");

  if (!div1) {
    div1 = document.createElement("div");
    div1.className = "session-history";
    div1.innerHTML = "<h3> Session History </h3>";
    output.appendChild(div1);
  }

  retrievedData.forEach((item) => {
    let div = document.createElement("div");

    let currentDate = new Date();
    let date = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    let time = currentDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    div.textContent = `Date: ${date}, Time: ${time}, Study Duration: ${item.study} minutes, Break Duration: ${item.break} minutes`;
    output.appendChild(div);
  });
}

function startTimer(item1, item2, input1, input2) {
  const progressBar = document.getElementById("progressBar");
  const totalDuration = (item1 + item2) * 60;
  let progress = 0;

  if (input1 && input2) {
    btn.disabled = true;
  }

  const timerInterval = setInterval(function () {
    progress++;
    const percentage = (progress / totalDuration) * 100;
    progressBar.style.width = percentage + "%";

    if (progress >= totalDuration) {
      progressBar.style.width = "0%";
      alert("Session complete");
      btn.disabled = false;
      clearInterval(timerInterval);
    }
  }, 1000);
}

btn.addEventListener("click", studyDurationFunction);
