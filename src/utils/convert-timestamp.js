export function convertTimestampTo24HourFormat(timestamp) {
    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format the hours and minutes with leading zeros if needed
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Create the 24-hour time string
    const timeString = `${formattedHours}:${formattedMinutes}`;

    return timeString;
}

export function compareFirebaseDaysEqual(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1.seconds * 1000 + timestamp1.nanoseconds / 1000000);
    const date2 = new Date(timestamp2.seconds * 1000 + timestamp2.nanoseconds / 1000000);

    return (
        date1.getUTCDate() + date1.getUTCMonth() + date1.getUTCFullYear() !== date2.getUTCDate() + date2.getUTCMonth() + date2.getUTCFullYear()
    );
}

export function formatTimestampDateOrDay(timestamp) {
    const now = new Date();
    const timestampDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const timeDifference = now.getTime() - timestampDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
        return "Today";
    } else if (daysDifference === 1) {
        return "Yesterday";
    } else if (daysDifference <= 7) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[timestampDate.getUTCDay()];
    } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return timestampDate.toLocaleDateString(undefined, options);
    }
}

export const convertTime = (input) => {
    if (input < 60) {
        return `${input} minutes`;
    } else {
        const hours = Math.floor(input / 60);
        const minutes = input % 60;
        return `${hours} hours ${minutes} minutes`;
    }
};