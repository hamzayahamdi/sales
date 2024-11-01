import {faker} from '@faker-js/faker';
import img1 from '@assets/products/1.webp';
import img2 from '@assets/products/2.webp';
import img3 from '@assets/products/3.webp';

const news = [
    {
        title: 'New Order #AN230965',
        date: faker.date.recent(),
        type: 'order',
        customer: faker.person.fullName(),
        amount: faker.commerce.price(),
    },
    {
        title: 'New Review to Product',
        date: faker.date.past(),
        type: 'review',
        preview: faker.lorem.paragraph(),
        media: [
            {
                src: img1,
                alt: 'review image'
            },
            {
                src: img2,
                alt: 'review image'
            },
            {
                src: img3,
                alt: 'review image'
            }
        ]
    },
    {
        title: 'New Order #AN230965',
        date: faker.date.recent(),
        type: 'order',
        customer: faker.person.fullName(),
        amount: faker.commerce.price(),
    },
    {
        title: 'New Order #AN230965',
        date: faker.date.recent(),
        type: 'order',
        customer: faker.person.fullName(),
        amount: faker.commerce.price(),
    }
]

export default news