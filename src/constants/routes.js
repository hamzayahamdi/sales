const ROUTES = {
    main: [
        {
            name: 'Dashboard',
            icon: 'objects-column',
            notifications: 2,
            links: [
                {
                    path: '/',
                    name: 'Dashboard A'
                },
                {
                    path: '/dashboard-b',
                    name: 'Dashboard B'
                },
                {
                    path: '/dashboard-c',
                    name: 'Dashboard C'
                },
                {
                    path: '/dashboard-d',
                    name: 'Dashboard D'
                }
            ]
        },
        {
            name: 'Products',
            icon: 'bag-shopping',
            links: [
                {
                    path: '/products',
                    name: 'Product List'
                },
                {
                    path: '/product',
                    name: 'Product Page'
                },
                {
                    path: '/create-product',
                    name: 'Create Product'
                }
            ]
        },
        {
            name: 'Orders',
            icon: 'square-list',
            links: [
                {
                    path: '/orders',
                    name: 'Orders Table'
                },
                {
                    path: '/order-details',
                    name: 'Order Details'
                },
                {
                    path: '/invoice',
                    name: 'Invoice'
                }
            ]
        },
        {
            path: '/sales',
            name: 'Sales',
            icon: 'badge-percent'
        },
        {
            path: '/reviews',
            name: 'Reviews',
            icon: 'message-quote'
        },
        {
            name: 'Pages',
            icon: 'layer-group',
            links: [
                {
                    path: '/sign-in',
                    name: 'Sign In'
                },
                {
                    path: '/sign-up',
                    name: 'Sign Up'
                },
                {
                    path: '/404',
                    name: 'Page 404'
                }
            ]
        }
    ],
    secondary: [
        {
            path: '/settings',
            name: 'Settings',
            icon: 'gear'
        },
        {
            path: '/sign-in',
            name: 'Logout',
            icon: 'arrow-right-from-bracket'
        }
    ]
}

export default ROUTES