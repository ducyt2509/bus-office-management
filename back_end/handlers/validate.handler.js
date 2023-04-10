
const validatePositiveIntegerNumber = (value) => {
    // Check if the value is a number
    if (isNaN(value)) {
        return false;
    }

    // Check if the value is an integer
    if (Math.floor(Math.abs(value)) !== value) {
        return false;
    }
    return true;
}

const validatePositiveNumber = (value) => {
    // Check if the value is a number
    if (isNaN(value)) {
        return false;
    }

    return true;
}

const validateStringInRange = (str, minLen, maxLen, regex) => {
    // Check if the string is not empty
    if (!str || str.trim().length === 0) {
        return false;
    }

    // Check if the string length is within the specified range
    if (str.length < minLen || str.length > maxLen) {
        return false;
    }

    // Check if the string matches the regular expression
    if (!str.match(regex)) {
        return false;
    }
    return true;
}

const validateString = (str, regex) => {
    // Check if the string is not empty
    if (typeof str !== 'string' || !str || str.trim().length === 0) {
        return false;
    }

    // Check if the string matches the regular expression
    if (!str.match(regex)) {
        return false;
    }
    return true;
}


const validateDate = (dateString) => {
    // Check if dateString is not empty
    if (!dateString || dateString.trim().length === 0) {
        return false;
    }
    // Check if dateString can be converted to a Date object
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return false;
    }

    // Check if the year is within a reasonable range
    const year = date.getFullYear();
    if (year < new Date().getFullYear() || year > 3000) {
        return false;
    }

    // Check if the month is within a reasonable range
    const month = date.getMonth() + 1;
    if (month < 1 || month > 12) {
        return false;
    }

    // Check if the day is within a reasonable range
    const day = date.getDate();
    if (day < 1 || day > 31) {
        return false;
    }

    return formatDate(date);
}
const formatDate = (date) => {
    const year = date.getFullYear();
    // add '0' if month or day is less than 10
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

module.exports = {
    validatePositiveIntegerNumber,
    validatePositiveNumber,
    validateString,
    validateDate,
    formatDate,
    validateStringInRange
};
