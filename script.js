const calendarGrid = document.getElementById("calendarGrid");
const selectedDateText = document.getElementById("selectedDate");
const monthTitle = document.getElementById("monthTitle");
const eventModal = document.getElementById("eventModal");
const eventInput = document.getElementById("eventText");
const saveEventBtn = document.getElementById("saveEvent");
const deleteEventBtn = document.getElementById("deleteEvent");
const closeModalBtn = document.getElementById("closeModal");

let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function updateCalendar(date = new Date()) {
  calendarGrid.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthName = date.toLocaleString("default", { month: "long" });
  monthTitle.textContent = `${monthName} ${year}`;

  daysOfWeek.forEach((day) => {
    const header = document.createElement("div");
    header.className = "weekday";
    header.textContent = day;
    calendarGrid.appendChild(header);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarGrid.appendChild(blank);
  }

  for (let i = 1; i <= totalDays; i++) {
    const day = document.createElement("div");
    day.className = "day";
    day.innerHTML = `<span>${i}</span>`;

    const fullDate = `${year}-${month + 1}-${i}`;
    if (events[fullDate]) {
      day.classList.add("event");
    }

    const isToday =
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isToday) {
      day.classList.add("today");
    }

    day.addEventListener("click", () => {
      document
        .querySelectorAll(".day")
        .forEach((d) => d.classList.remove("selected"));
      day.classList.add("selected");
      selectedDate = fullDate;
      selectedDateText.textContent = `${monthName} ${i}, ${year}`;
      eventInput.value = events[fullDate] || "";
      eventModal.style.display = "flex";
    });

    calendarGrid.appendChild(day);
  }
}

saveEventBtn.addEventListener("click", () => {
  if (selectedDate) {
    const trimmedInput = eventInput.value.trim();
    if (trimmedInput !== "") {
      events[selectedDate] = trimmedInput;
    } else {
      delete events[selectedDate];
    }
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }
  eventModal.style.display = "none";
  updateCalendar(currentDate);
});
deleteEventBtn.addEventListener("click", () => {
  if (selectedDate && events[selectedDate]) {
    delete events[selectedDate];
    localStorage.setItem("calendarEvents", JSON.stringify(events));
    eventInput.value = "";
    selectedDateText.textContent = "Select a date";
    updateCalendar(currentDate);
  }
  eventModal.style.display = "none";
});

closeModalBtn.addEventListener("click", () => {
  eventModal.style.display = "none";
});

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar(currentDate);
});
document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar(currentDate);
});

updateCalendar(currentDate);
