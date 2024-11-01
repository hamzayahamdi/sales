/**
 *
 * @param num - number to be formatted
 * @param fractionDigits - number of digits after the decimal point
 * @param prefix - prefix to be added to the formatted number
 * @returns {*|string}
 */
export const numFormatter = (num, fractionDigits = 0, prefix = '') => {
    const options = {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    };

    if (num >= 1000 && num < 1000000) {
        const roundedNum = Math.round(num / 1000);
        const formattedNum = roundedNum.toLocaleString(undefined, options);
        return `${prefix}${formattedNum}K`;
    } else if (num >= 1000000) {
        const roundedNum = Math.round(num / 1000000);
        const formattedNum = roundedNum.toLocaleString(undefined, options);
        return `${prefix}${formattedNum}M`;
    } else if (num < 900) {
        return `${prefix}${num}`;
    }
};

export const commaFormatter = (num, fractionDigits = 0) => {
    return num.toFixed(fractionDigits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// grid y-axis or x-axis points generator for recharts
/**
 *
 * @param id - container id
 * @param gutter - grid gutter
 * @param axis - 'x' or 'y'
 * @returns {*[]} - array of grid points
 */
export const generateGridPoints = (id, gutter = 20, axis = 'y') => {
    // const gridWidth = document.getElementById(id).offsetWidth;
    const gridWidth = 1000;
    // const gridHeight = document.getElementById(id).offsetHeight;
    const gridHeight = 400;

    let points = [];
    for (let i = 0; i < (axis === 'y' ? gridWidth : gridHeight); i += gutter) {
        points.push(i);
    }
    return points;
}

export const addZero = (num) => num < 10 ? `0${num}` : num;

export const getFullWeekdayName = shortWeekday => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortWeekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(shortWeekday);

    if (shortWeekdayIndex !== -1) {
        return weekdays[shortWeekdayIndex];
    } else {
        return 'Invalid weekday abbreviation';
    }
}