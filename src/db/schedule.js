const currentYear = new Date().getFullYear(),
    currentMonth = new Date().getMonth();

const schedule = [
    {
        start: new Date(currentYear, currentMonth, 1),
        end: new Date(currentYear, currentMonth, 3),
        title: 'Evening Dresses under $99',
        color: 'blue',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 7),
        end: new Date(currentYear, currentMonth, 10),
        title: 'SALE Summer Accessories',
        color: 'yellow',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 7),
        end: new Date(currentYear, currentMonth, 9),
        title: 'Last chance to buy',
        color: 'red',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 11),
        end: new Date(currentYear, currentMonth, 13),
        title: 'Biggest deals',
        color: 'turquoise',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 17),
        end: new Date(currentYear, currentMonth, 20),
        title: 'Back to school kids collection',
        color: 'blue',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 17),
        end: new Date(currentYear, currentMonth, 20),
        title: 'Last chance to buy',
        color: 'yellow',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 22),
        end: new Date(currentYear, currentMonth, 24),
        title: 'Nightwear under $99',
        color: 'peach',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 23),
        end: new Date(currentYear, currentMonth, 25),
        title: 'Men\'s collection under $99',
        color: 'turquoise',
        allDay: true,
    },
    {
        start: new Date(currentYear, currentMonth, 24),
        end: new Date(currentYear, currentMonth, 26),
        title: 'Last chance to buy',
        color: 'yellow',
        allDay: true,
    }
]

export default schedule