const layouts = {
    dashboard_a: {
        xl: [
            {i: 'statistics', x: 0, y: 0, w: 4, h: 1},
            {i: 'sales_analytics', x: 0, y: 1, w: 2, h: 2},
            {i: 'sales_by_category', x: 2, y: 1, w: 2, h: 2},
            {i: 'top_selling', x: 0, y: 3, w: 3, h: 2},
            {i: 'trending_product', x: 3, y: 3, w: 1, h: 2},
        ],
        lg: [
            {i: 'statistics', x: 0, y: 0, w: 3, h: 2},
            {i: 'sales_analytics', x: 0, y: 2, w: 1, h: 2},
            {i: 'sales_by_category', x: 1, y: 2, w: 2, h: 2},
            {i: 'top_selling', x: 0, y: 6, w: 2, h: 2},
            {i: 'trending_product', x: 2, y: 6, w: 1, h: 2},
        ],
        md: [
            {i: 'statistics', x: 0, y: 0, w: 2, h: 2},
            {i: 'sales_analytics', x: 0, y: 2, w: 2, h: 2},
            {i: 'sales_by_category', x: 0, y: 4, w: 2, h: 2},
            {i: 'top_selling', x: 0, y: 6, w: 2, h: 2},
            {i: 'trending_product', x: 0, y: 8, w: 2, h: 2},
        ]
    },
    dashboard_b: {
        xl: [
            {i: 'stats', x: 0, y: 0, w: 1.5, h: 1},
            {i: 'best_sellers', x: 1.5, y: 0, w: 1.5, h: 2},
            {i: 'sales_analytics', x: 0, y: 1, w: 1.5, h: 2},
            {i: 'progress', x: 1.5, y: 2, w: 1.5, h: 1},
            {i: 'reviews', x: 0, y: 3, w: 1, h: 2},
            {i: 'orders', x: 1, y: 3, w: 1, h: 2},
            {i: 'visits', x: 2, y: 3, w: 1, h: 2},
        ],
        lg: [
            {i: 'stats', x: 0, y: 0, w: 3, h: 1},
            {i: 'best_sellers', x: 1.5, y: 0, w: 1.5, h: 2},
            {i: 'sales_analytics', x: 0, y: 1, w: 1.5, h: 2},
            {i: 'progress', x: 1.5, y: 3, w: 1.5, h: 1},
            {i: 'reviews', x: 0, y: 3, w: 1.5, h: 2},
            {i: 'orders', x: 1.5, y: 4, w: 1.5, h: 3},
            {i: 'visits', x: 0, y: 5, w: 1.5, h: 2},
        ],
        md: [
            {i: 'stats', x: 0, y: 0, w: 2, h: 1},
            {i: 'best_sellers', x: 0, y: 1, w: 2, h: 2},
            {i: 'sales_analytics', x: 0, y: 4, w: 2, h: 2},
            {i: 'progress', x: 0, y: 3, w: 2, h: 1},
            {i: 'reviews', x: 0, y: 6, w: 2, h: 2},
            {i: 'orders', x: 0, y: 8, w: 2, h: 2},
            {i: 'visits', x: 0, y: 10, w: 2, h: 2},
        ]
    },
    dashboard_c: {
        xl: [
            {i: 'stats_overview_a', x: 0, y: 0, w: 1.5, h: 1},
            {i: 'stats_overview_b', x: 1.5, y: 0, w: 1.5, h: 1},
            {i: 'profit', x: 0, y: 1, w: 1, h: 2},
            {i: 'audience', x: 1, y: 1, w: 2, h: 2},
            {i: 'feedback', x: 0, y: 3, w: 1, h: 2},
            {i: 'visits', x: 1, y: 3, w: 1, h: 2},
            {i: 'transactions', x: 2, y: 3, w: 1, h: 2},
        ],
        lg: [
            {i: 'stats_overview_a', x: 0, y: 0, w: 2, h: 1},
            {i: 'stats_overview_b', x: 0, y: 1, w: 2, h: 1},
            {i: 'profit', x: 2, y: 0, w: 1, h: 2},
            {i: 'audience', x: 1, y: 2, w: 2, h: 2},
            {i: 'feedback', x: 0, y: 2, w: 1, h: 2},
            {i: 'visits', x: 0, y: 4, w: 2, h: 2},
            {i: 'transactions', x: 2, y: 4, w: 1, h: 2},
        ],
        md: [
            {i: 'stats_overview_a', x: 0, y: 0, w: 2, h: 1},
            {i: 'stats_overview_b', x: 0, y: 1, w: 2, h: 1},
            {i: 'profit', x: 0, y: 2, w: 1, h: 2},
            {i: 'audience', x: 0, y: 4, w: 2, h: 2},
            {i: 'feedback', x: 1, y: 2, w: 1, h: 2},
            {i: 'visits', x: 0, y: 6, w: 1, h: 2},
            {i: 'transactions', x: 1, y: 6, w: 1, h: 2},
        ]
    },
    dashboard_d: {
        xl: [
            {i: 'sales_analytics', x: 0, y: 0, w: 1, h: 2},
            {i: 'news_timeline', x: 1, y: 0, w: 1, h: 2},
            {i: 'top_selling', x: 2, y: 0, w: 1, h: 3},
            {i: 'orders', x: 0, y: 2, w: 2, h: 3},
            {i: 'latest_offer', x: 2, y: 3, w: 1, h: 2},
        ],
        lg: [
            {i: 'sales_analytics', x: 0, y: 0, w: 1, h: 2},
            {i: 'news_timeline', x: 1, y: 0, w: 1, h: 2},
            {i: 'top_selling', x: 2, y: 0, w: 1, h: 3},
            {i: 'orders', x: 0, y: 2, w: 2, h: 3},
            {i: 'latest_offer', x: 2, y: 3, w: 1, h: 2},
        ],
        md: [
            {i: 'sales_analytics', x: 0, y: 0, w: 1, h: 2},
            {i: 'news_timeline', x: 1, y: 0, w: 1, h: 2},
            {i: 'top_selling', x: 0, y: 2, w: 1, h: 2},
            {i: 'orders', x: 0, y: 4, w: 2, h: 3},
            {i: 'latest_offer', x: 1, y: 2, w: 1, h: 2},
        ]
    },
    order_details: {
        xl: [
            {i: 'products', x: 0, y: 0, w: 2, h: 3},
            {i: 'summary', x: 2, y: 0, w: 1, h: 2},
            {i: 'comment', x: 0, y: 3, w: 1, h: 1},
            {i: 'shipping', x: 1, y: 3, w: 1, h: 1},
            {i: 'banner', x: 0, y: 4, w: 1, h: 1},
            {i: 'payment', x: 1, y: 4, w: 1, h: 1},
            {i: 'tracking', x: 2, y: 2, w: 1, h: 3},
        ],
        lg: [
            {i: 'products', x: 0, y: 0, w: 2, h: 3},
            {i: 'summary', x: 2, y: 0, w: 1, h: 2},
            {i: 'comment', x: 0, y: 3, w: 1, h: 1},
            {i: 'shipping', x: 1, y: 3, w: 1, h: 1},
            {i: 'banner', x: 0, y: 4, w: 1, h: 1},
            {i: 'payment', x: 1, y: 4, w: 1, h: 1},
            {i: 'tracking', x: 2, y: 2, w: 1, h: 3},
        ],
        md: [
            {i: 'products', x: 0, y: 0, w: 2, h: 3},
            {i: 'summary', x: 1, y: 3, w: 1, h: 2},
            {i: 'comment', x: 0, y: 3, w: 1, h: 1},
            {i: 'shipping', x: 0, y: 5, w: 2, h: 1},
            {i: 'banner', x: 0, y: 4, w: 1, h: 1},
            {i: 'payment', x: 0, y: 6, w: 2, h: 1},
            {i: 'tracking', x: 0, y: 7, w: 2, h: 3},
        ]
    },
    invoice: {
        xl: [
            {i: 'info', x: 0, y: 0, w: 1, h: 1},
            {i: 'receiver', x: 1, y: 0, w: 1, h: 1},
            {i: 'client', x: 2, y: 0, w: 1, h: 2},
            {i: 'details', x: 0, y: 1, w: 2, h: 3.611},
            {i: 'method', x: 2, y: 2, w: 1, h: 1},
            {i: 'send', x: 2, y: 3, w: 1, h: 1.611},
        ],
        lg: [
            {i: 'info', x: 0, y: 0, w: 1.5, h: 1},
            {i: 'receiver', x: 1.5, y: 0, w: 1.5, h: 1},
            {i: 'client', x: 1.5, y: 4.611, w: 1.5, h: 2},
            {i: 'details', x: 0, y: 1, w: 3, h: 3.611},
            {i: 'method', x: 0, y: 6.611, w: 3, h: 1},
            {i: 'send', x: 0, y: 4.611, w: 1.5, h: 2},
        ],
        md: [
            {i: 'info', x: 0, y: 0, w: 2, h: 1},
            {i: 'receiver', x: 0, y: 1, w: 2, h: 1},
            {i: 'client', x: 0, y: 2, w: 2, h: 2},
            {i: 'details', x: 0, y: 4, w: 2, h: 3.611},
            {i: 'method', x: 0, y: 7.611, w: 2, h: 1},
            {i: 'send', x: 0, y: 8.611, w: 2, h: 1.611},
        ]
    },
    settings: {
        xl: [
            {i: 'profile_card', x: 0, y: 0, w: 1, h: 2},
            {i: 'login_history', x: 0, y: 2, w: 1, h: 3},
            {i: 'edit_profile', x: 1, y: 0, w: 2, h: 5},
        ],
        lg: [
            {i: 'profile_card', x: 0, y: 0, w: 1.5, h: 2},
            {i: 'login_history', x: 1.5, y: 0, w: 1.5, h: 2},
            {i: 'edit_profile', x: 0, y: 2, w: 3, h: 5},
        ],
        md: [
            {i: 'profile_card', x: 0, y: 0, w: 1, h: 2},
            {i: 'login_history', x: 1, y: 0, w: 1, h: 2},
            {i: 'edit_profile', x: 0, y: 2, w: 2, h: 5},
        ]
    }
}

export default layouts