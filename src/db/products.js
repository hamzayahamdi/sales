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

const products = [
    {
        id: '432846',
        name: faker.commerce.productName(),
        img: img1,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.recent(),
        sold: 206
    },
    {
        id: '192846',
        name: faker.commerce.productName(),
        img: img2,
        price: faker.commerce.price(),
        status: 'unavailable',
        category: faker.commerce.department(),
        lastModified: faker.date.recent(),
        sold: 33
    },
    {
        id: '128945',
        name: faker.commerce.productName(),
        img: img3,
        price: faker.commerce.price(),
        status: 'low',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 12
    },
    {
        id: '126790',
        name: faker.commerce.productName(),
        img: img4,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 56
    },
    {
        id: '871256',
        name: faker.commerce.productName(),
        img: img5,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 78
    },
    {
        id: '197746',
        name: faker.commerce.productName(),
        img: img6,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 9
    },
    {
        id: '199546',
        name: faker.commerce.productName(),
        img: img7,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 0
    },
    {
        id: '659546',
        name: faker.commerce.productName(),
        img: img8,
        price: faker.commerce.price(),
        status: 'low',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 0
    },
    {
        id: '199600',
        name: faker.commerce.productName(),
        img: img9,
        price: faker.commerce.price(),
        status: 'unavailable',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 19
    },
    {
        id: '558870',
        name: faker.commerce.productName(),
        img: img10,
        price: faker.commerce.price(),
        status: 'low',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 95
    },
    {
        id: '533570',
        name: faker.commerce.productName(),
        img: img11,
        price: faker.commerce.price(),
        status: 'low',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 0
    },
    {
        id: '608870',
        name: faker.commerce.productName(),
        img: img12,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 36
    },
    {
        id: '552404',
        name: faker.commerce.productName(),
        img: img13,
        price: faker.commerce.price(),
        status: 'low',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 18
    },
    {
        id: '890741',
        name: faker.commerce.productName(),
        img: img14,
        price: faker.commerce.price(),
        status: 'unavailable',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 63
    },
    {
        id: '789321',
        name: faker.commerce.productName(),
        img: img15,
        price: faker.commerce.price(),
        status: 'unavailable',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 8
    },
    {
        id: '696955',
        name: faker.commerce.productName(),
        img: img16,
        price: faker.commerce.price(),
        status: 'unavailable',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 5
    },
    {
        id: '564198',
        name: faker.commerce.productName(),
        img: img17,
        price: faker.commerce.price(),
        status: 'low',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 72
    },
    {
        id: '965841',
        name: faker.commerce.productName(),
        img: img18,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 0
    },
    {
        id: '900111',
        name: faker.commerce.productName(),
        img: img19,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 24
    },
    {
        id: '100877',
        name: faker.commerce.productName(),
        img: img20,
        price: faker.commerce.price(),
        status: 'available',
        category: faker.commerce.department(),
        lastModified: faker.date.past(),
        sold: 0
    }
]

export default products