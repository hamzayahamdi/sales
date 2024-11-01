import {faker} from '@faker-js/faker';
import img1 from '@assets/products/1.webp';
import img2 from '@assets/products/2.webp';
import img3 from '@assets/products/3.webp';
import img4 from '@assets/products/4.webp';
import img5 from '@assets/products/5.webp';
import img6 from '@assets/products/6.webp';
import img7 from '@assets/products/7.webp';
import img8 from '@assets/products/8.webp';
import img9 from '@assets/products/9.webp';
import img10 from '@assets/products/10.webp';
import img11 from '@assets/products/11.webp';
import img12 from '@assets/products/12.webp';
import img13 from '@assets/products/13.webp';
import img14 from '@assets/products/14.webp';
import img15 from '@assets/products/15.webp';
import img16 from '@assets/products/16.webp';
import img17 from '@assets/products/17.webp';
import img18 from '@assets/products/18.webp';
import img19 from '@assets/products/19.webp';
import img20 from '@assets/products/20.webp';

const reviews_table = [
    {
        id: 'review-1',
        status: 'pending',
        product: {
            category: 'lingerie',
            name: 'Gioia Super Push-up Bra',
            img: img2,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-2',
        status: 'approved',
        product: {
            category: 'lingerie',
            name: 'Medium Control Slip',
            img: img8,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 4.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-3',
        status: 'trash',
        product: {
            category: 'sportswear',
            name: 'Non Wired Sports Bra',
            img: img5,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 3,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-4',
        status: 'approved',
        product: {
            category: 'accessories',
            name: 'Square Sunglasses',
            img: img7,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 4.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-5',
        status: 'approved',
        product: {
            category: 'accessories',
            name: 'Cross-body Bag',
            img: img10,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 4.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-6',
        status: 'pending',
        product: {
            category: 'accessories',
            name: 'Leather Cross Body Bag',
            img: img3,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 4.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-7',
        status: 'approved',
        product: {
            category: 'shoes',
            name: 'Leather Flat Sandals',
            img: img1,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 4.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-8',
        status: 'approved',
        product: {
            category: 'accessories',
            name: 'Hair clip with Pearls',
            img: img4,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 3.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-9',
        status: 'approved',
        product: {
            category: 'accessories',
            name: 'Watch with Leather Strap',
            img: img6,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-10',
        status: 'approved',
        product: {
            category: 'sportswear',
            name: 'Non Wired Sports Top',
            img: img9,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 4.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-11',
        status: 'approved',
        product: {
            category: 'shoes',
            name: 'Birkenstock Arizona',
            img: img11,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-12',
        status: 'trash',
        product: {
            category: 'shoes',
            name: 'Crocs Jibbitz Crocband',
            img: img12,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 2.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-13',
        status: 'approved',
        product: {
            category: 'shoes',
            name: 'ASICS Gel-Sonoma 7',
            img: img13,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-14',
        status: 'pending',
        product: {
            category: 'accessories',
            name: 'Guess Abey Small Hobo',
            img: img14,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 3.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-15',
        status: 'trash',
        product: {
            category: 'accessories',
            name: 'Puma Core Pop Boxy X-Body',
            img: img15,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-16',
        status: 'approved',
        product: {
            category: 'accessories',
            name: 'Traum Blue Ring Earrings',
            img: img16,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 1,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-17',
        status: 'approved',
        product: {
            category: 'dresses',
            name: 'Dressa Turquoise Flower Dress',
            img: img17,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-18',
        status: 'pending',
        product: {
            category: 'dresses',
            name: 'Dressa Mint Mid-length Dress',
            img: img18,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-19',
        status: 'approved',
        product: {
            category: 'jeans',
            name: 'Levi\'s XL Balloon Medium Indigo',
            img: img19,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    },
    {
        id: 'review-20',
        status: 'approved',
        product: {
            category: 'jeans',
            name: 'Trendyol Clear Blue Mom Jeans',
            img: img20,
        },
        user: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
        rating: 3.5,
        review: faker.lorem.paragraph(),
        date: faker.date.past(),
    }
]

export default reviews_table