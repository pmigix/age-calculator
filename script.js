const button = document.querySelector("button");
let elements = [
    {
        inputField: document.getElementById("day"),
        label: document.querySelector("label[for=day]"),
        messageField: document.querySelector(".message-day"),
        outputField: document.querySelector("#days")
    },
    {
        inputField: document.getElementById("month"),
        label: document.querySelector("label[for=month]"),
        messageField: document.querySelector(".message-month"),
        outputField: document.querySelector("#months")
    },
    {
        inputField: document.getElementById("year"),
        label: document.querySelector("label[for=year]"),
        messageField: document.querySelector(".message-year"),
        outputField: document.querySelector("#years")
    }
]
const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

elements.forEach(obj => {
    obj.inputField.addEventListener("focus", () => {
        obj.inputField.style.borderColor = "hsl(259, 100%, 65%)"; // Purple
    })
});

elements.forEach(obj => {
    obj.inputField.addEventListener("blur", () => {
        obj.inputField.style.borderColor = "hsl(0, 0%, 86%)"; // Light gray
    })
});

button.addEventListener("click", () => {
    const inputDay = elements[0].inputField.value;
    const inputMonth = elements[1].inputField.value;
    const inputYear = elements[2].inputField.value;

    outputMessage(elements[0].messageField, isValidDay(inputDay));
    outputMessage(elements[1].messageField, isValidMonth(inputMonth));
    outputMessage(elements[2].messageField, isValidYear(inputYear));

    if (isValidDay(inputDay) === "" && isValidMonth(inputMonth) === "" && isValidYear(inputYear) === "") {
        if (isValidDate(inputDay, inputMonth, inputYear)) {
            elements.forEach(obj => {
                removeHighlight(obj.label, obj.inputField);
            });
            calculateAge(inputDay, inputMonth, inputYear);
        }
        else {
            elements.forEach(obj => {
                setHighlight(obj.label, obj.inputField);
            });
            outputMessage(elements[0].messageField, "Must be a valid date");
        }
    }
});

function isLeapYear(year) {
    /* Leap years:
    - years divisible by 4
    - not divisible by 100 UNLESS divisible by 400
    */
    return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 100 == 0));
}

function isValidYear(year) {
    if (year === "") {
        setHighlight(elements[2].label, elements[2].inputField);
        return "This field is required";
    }
    if (year > currentYear) {
        setHighlight(elements[2].label, elements[2].inputField);
        return "Must be in the past";
    }
    removeHighlight(elements[2].label, elements[2].inputField);
    return "";
}

function isValidMonth(month) {
    if (month === "") {
        setHighlight(elements[1].label, elements[1].inputField);
        return "This field is required";
    }
    if (month < 1 || month > 12) {
        setHighlight(elements[1].label, elements[1].inputField);
        return "Must be a valid month";
    }
    removeHighlight(elements[1].label, elements[1].inputField);
    return "";
}

function isValidDay(day) {
    if (day === "") {
        setHighlight(elements[0].label, elements[0].inputField);
        return "This field is required";
    }
    if (day < 1 || day > 31) {
        setHighlight(elements[0].label, elements[0].inputField);
        return "Must be a valid day";
    }
    removeHighlight(elements[0].label, elements[0].inputField);
    return "";
}

function isValidDate(day, month, year) {
    const months30Days = [4,6,9,11];
    const months31Days = [1,3,5,7,8,10,12];
    
    if (year >= currentYear && (month > currentMonth+1 || (month == currentMonth+1 && day > currentDay))) {
        return false;
    }

    if ((month == 2 && isLeapYear(year) && day <= 29) || (month == 2 && day <= 28)) {
        return true;
    }
    if ((months30Days.includes(+month) && day <= 30) || (months31Days.includes(+month) && day <= 31)) {
        return true;
    }
    return false;
}

function calculateAge(day, month, year) {
    let fullDays = 0, fullMonths = 0, fullYears = 0;
    const daysInEachMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

    if (currentMonth+1 < month) {
        fullYears = (currentYear - year) - 1;
        fullMonths = 12 + (currentMonth+1 - month);
    } else if (currentMonth+1 == month) {
        fullYears = currentYear - year;
        fullMonths = 0;
    } else {
        fullYears = currentYear - year;
        fullMonths = currentMonth+1 - month;
    }

    if (currentDay <= day) {
        fullDays = daysInEachMonth[month-1] + (currentDay - day);
        if (fullDays === daysInEachMonth[month-1]) {
            fullYears++;
            fullMonths = 0;
            fullDays = 0;
        }
    } else {
        fullDays = currentDay - day;
    }

    let yearInterval = setInterval(yearCounter, 75);
    let monthInterval = setInterval(monthCounter, 75);
    let dayInterval = setInterval(dayCounter, 75);
    let years = 0, months = 0, days = 0;

    function yearCounter() {
        if (years == fullYears) {
            clearInterval(yearInterval);
        } else {
            years++;
            elements[2].outputField.textContent = years;
        }
    }
    function monthCounter() {
        if (months == fullMonths) {
            clearInterval(monthInterval);
        } else {
            months++;
            elements[1].outputField.textContent = months;
        }
    }
    function dayCounter() {
        if (days == fullDays) {
            clearInterval(dayInterval);
        } else {
            days++;
            elements[0].outputField.textContent = days;
        }
    }
}

function outputMessage(element, message) {
    element.textContent = message;
}

function setHighlight(label, field) {
    label.style.color = "hsl(0, 100%, 67%)"; // Light red
    field.style.borderColor = "hsl(0, 100%, 67%)";
}

function removeHighlight(label, field) {
    label.style.color = "hsl(0, 0%, 54%)"; // Smokey gray
    field.style.borderColor = "hsl(0, 0%, 86%)"; // Light gray
}