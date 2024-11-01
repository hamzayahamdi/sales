import {faker} from '@faker-js/faker';

const orders_table = [
    {
        id: 'YU34692',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Paypal',
        date: faker.date.past(),
        status: 'new',
    },
    {
        id: 'YU34655',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Credit Card',
        date: faker.date.past(),
        status: 'cancelled',
    },
    {
        id: 'YU34175',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Paypal',
        date: faker.date.past(),
        status: 'processing',
    },
    {
        id: 'YU18175',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Amazon Pay',
        date: faker.date.recent(),
        status: 'completed',
    },
    {
        id: 'YU03175',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Payoneer',
        date: faker.date.recent(),
        status: 'processing',
    },
    {
        id: 'YU80163',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Google Pay',
        date: faker.date.recent(),
        status: 'new',
    },
    {
        id: 'YU81563',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Apple Pay',
        date: faker.date.recent(),
        status: 'processing',
    },
    {
        id: 'YU11562',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Apple Pay',
        date: faker.date.recent(),
        status: 'processing',
    },
    {
        id: 'YU60063',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Credit Card',
        date: faker.date.recent(),
        status: 'new',
    },
    {
        id: 'YU60064',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Paypal',
        date: faker.date.past(),
        status: 'cancelled',
    },
    {
        id: 'YU32963',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Google Pay',
        date: faker.date.recent(),
        status: 'new',
    },
    {
        id: 'YU94463',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Google Pay',
        date: faker.date.recent(),
        status: 'completed',
    },
    {
        id: 'YB95363',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Amazon Pay',
        date: faker.date.recent(),
        status: 'completed',
    },
    {
        id: 'BBG5363',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Credit Card',
        date: faker.date.past(),
        status: 'completed',
    },
    {
        id: 'BBG4001',
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        amount: faker.commerce.price(),
        method: 'Credit Card',
        date: faker.date.past(),
        status: 'completed',
    }
]

export default orders_table