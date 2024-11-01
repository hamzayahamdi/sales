// components
import Spring from '@components/Spring';
import BasicTable from '@components/BasicTable';
import TopSellingCollapse from '@components/TopSellingCollapse';

// hooks
import {useWindowSize} from 'react-use';
import {useState, useEffect} from 'react';

const TopSelling = ({ storeId = 'all', dateRange }) => {
    const {width} = useWindowSize();
    const [activeCollapse, setActiveCollapse] = useState('');
    const [topProducts, setTopProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productsStock, setProductsStock] = useState({});

    const fetchAllProducts = async (productName) => {
        try {
            const encodedQuery = encodeURIComponent(productName);
            const response = await fetch(`https://phpstack-937973-4763176.cloudwaysapps.com/data1.php?type=search&query=${encodedQuery}`);
            const data = await response.json();
            
            if (data.error === 'No data found.') {
                return [];
            }
            
            if (data.error) {
                console.error('API Error:', data.error);
                return [];
            }
            
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Failed to fetch products data:', error);
            return [];
        }
    };

    const getStockFieldName = (storeId) => {
        switch(storeId) {
            case '1':
                return 'Stock Casa';
            case '2':
                return 'Stock Rabat';
            case '5':
                return 'Stock Tanger';
            case '6':
                return 'Stock Marrakech';
            case 'all':
                return 'Total Stock';
            default:
                return 'Total Stock';
        }
    };

    const decodeHtmlEntities = (text) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value
            .replace(/&#039;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
    };

    const fetchTopProducts = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            const formattedDateRange = Array.isArray(dateRange) 
                ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`
                : dateRange;
                
            formData.append('date_range', formattedDateRange);
            formData.append('store_id', storeId);

            const response = await fetch('https://sales.sketchdesign.ma/fetch_sales_new.php', {
                method: 'POST',
                body: formData
            });

            const salesData = await response.json();
            
            if (salesData.best_selling_products) {
                const productsWithDetails = await Promise.all(
                    salesData.best_selling_products.map(async (product, index) => {
                        const productDetails = await fetchAllProducts(product.label);
                        const matchingProduct = productDetails?.[0];
                        
                        const stockFieldName = getStockFieldName(storeId);
                        
                        return {
                            id: `${product.id || index}`,
                            name: decodeHtmlEntities(product.label),
                            ref: matchingProduct ? matchingProduct['Ref. produit'] : '-',
                            qty_sold: product.qty_sold,
                            total: parseInt(product.total_ttc.replace(/\s/g, '').replace(',', '.')) || 0,
                            stock: matchingProduct ? parseInt(matchingProduct[stockFieldName]) || 0 : 0
                        };
                    })
                );

                setTopProducts(productsWithDetails);
                
                const newStockData = {};
                productsWithDetails.forEach(product => {
                    if (product.ref !== '-') {
                        newStockData[product.ref] = product.stock;
                    }
                });
                setProductsStock(newStockData);
            }
        } catch (error) {
            console.error('Failed to fetch top products:', error);
            setTopProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopProducts();
    }, [storeId, dateRange]);

    useEffect(() => {
        const handleResize = () => setActiveCollapse('');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getStockColumnTitle = (storeId) => {
        switch(storeId) {
            case '1':
                return 'STOCK CASA';
            case '2':
                return 'STOCK RABAT';
            case '5':
                return 'STOCK TANGER';
            case '6':
                return 'STOCK MARRAKECH';
            case 'all':
                return 'STOCK TOTAL';
            default:
                return 'STOCK';
        }
    };

    const getColumns = () => {
        const baseColumns = [
            {
                title: 'PRODUIT',
                dataIndex: 'name',
                key: 'name',
                width: '40%',
                render: (text, record) => (
                    <div className="flex flex-col py-1">
                        <span className="font-medium break-words">{text}</span>
                        <span className="text-xs text-gray-500">Réf: {record.ref}</span>
                    </div>
                )
            },
            {
                title: 'QTÉ VENDU',
                dataIndex: 'qty_sold',
                key: 'qty_sold',
                width: '15%',
                render: (value) => (
                    <span className="font-medium">{value} pcs</span>
                )
            }
        ];

        if (storeId !== '10' && storeId !== 10) {
            baseColumns.push({
                title: getStockColumnTitle(storeId),
                dataIndex: 'stock',
                key: 'stock',
                width: '20%',
                render: (_, record) => (
                    <span className="font-medium">
                        {record.stock} pcs
                    </span>
                )
            });
        }

        baseColumns.push({
            title: 'TOTAL TTC',
            dataIndex: 'total',
            key: 'total',
            width: '25%',
            render: (value) => (
                <span className="font-medium">
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        });

        return baseColumns;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Bestsellers</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[400px] p-4 xs:p-5 bg-[#1F2937] shadow-lg rounded-xl">
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Bestsellers</h2>
            {width < 768 ? (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {topProducts.map((product, index) => (
                        <div key={`${product.id}-${index}`}>
                            <TopSellingCollapse 
                                product={product}
                                active={activeCollapse}
                                setActive={setActiveCollapse}
                                index={index}
                                showStock={storeId !== '10' && storeId !== 10}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <BasicTable 
                        dataSource={topProducts}
                        columns={getColumns()}
                        rowKey={record => `${record.id}-${record.name}`}
                        showSorterTooltip={false}
                        pagination={false}
                        size="small"
                        className="bestsellers-table h-full dark"
                        scroll={{ y: 260 }}
                    />
                </div>
            )}
        </div>
    );
};

export default TopSelling;