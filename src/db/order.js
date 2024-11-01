import {faker} from '@faker-js/faker';
import img1 from '@assets/products/1.webp';
import img2 from '@assets/products/2.webp';
import img3 from '@assets/products/3.webp';
import img4 from '@assets/products/4.webp';
import img5 from '@assets/products/5.webp';
import img6 from '@assets/products/6.webp';
import img7 from '@assets/products/7.webp';

const order = [
    {
        id: 'BT0075',
        name: faker.commerce.productName(),
        img: img1,
        price: faker.commerce.price(),
        qty: 1
    },
    {
        id: 'BT0076',
        name: faker.commerce.productName(),
        img: img2,
        price: faker.commerce.price(),
        qty: 2
    },
    {
        id: 'BT0077',
        name: faker.commerce.productName(),
        img: img3,
        price: faker.commerce.price(),
        qty: 4
    },
    {
        id: 'BR0078',
        name: faker.commerce.productName(),
        img: img4,
        price: faker.commerce.price(),
        qty: 1
    },
    {
        id: 'BH0079',
        name: faker.commerce.productName(),
        img: img5,
        price: faker.commerce.price(),
        qty: 2
    },
    {
        id: 'SM0080',
        name: faker.commerce.productName(),
        img: img6,
        price: faker.commerce.price(),
        qty: 4
    },
    {
        id: 'LK0081',
        name: faker.commerce.productName(),
        img: img7,
        price: faker.commerce.price(),
        qty: 4
    }
]

export default order