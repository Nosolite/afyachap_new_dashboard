export const formatDate = (dateString) => {
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    };

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
};

export const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const convertedDate = `${month}/${day}/${year}`;
    return convertedDate;
};

export function numberToMonth(number) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Check if the number is between 1 and 12
    if (number < 1 || number > 12) {
        return "Invalid month number";
    }

    // Array is 0-indexed, so subtract 1 from the number
    return months[number - 1];
};