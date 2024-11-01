import {faker} from '@faker-js/faker';
import img1 from '@assets/products/1.webp';
import img2 from '@assets/products/2.webp';
import img3 from '@assets/products/3.webp';
import img4 from '@assets/products/4.webp';
import img5 from '@assets/products/5.webp';
import img6 from '@assets/products/6.webp';

const reviews = [
    {
        id: 'review-1',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        text: faker.lorem.sentence(),
        rating: faker.number.float({min: 1, max: 5, precision: 0.5}),
        date: faker.date.recent(),
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
        id: 'review-2',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        text: faker.lorem.paragraph({min: 1, max: 3}),
        rating: faker.number.float({min: 1, max: 5, precision: 0.5}),
        date: faker.date.past(),
    },
    {
        id: 'review-3',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        text: faker.lorem.sentence(),
        rating: faker.number.float({min: 1, max: 5, precision: 0.5}),
        date: faker.date.recent(),
        media: [
            {
                src: img4,
                alt: 'review image'
            },
            {
                src: img5,
                alt: 'review image'
            },
            {
                src: img6,
                alt: 'review image'
            }
        ]
    },
    {
        id: 'review-4',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        text: faker.lorem.paragraph({min: 1, max: 3}),
        rating: faker.number.float({min: 1, max: 5, precision: 0.5}),
        date: faker.date.past(),
    }
]

export default reviews