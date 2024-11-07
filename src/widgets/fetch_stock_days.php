<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = '206.189.4.199';
$dbname = 'hchhgjukna';
$username = 'hchhgjukna';
$password = 'BAmx7n8bnG';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get parameters with defaults
    $store_id = isset($_GET['store_id']) ? $_GET['store_id'] : 'all';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    // Define allowed categories
    $allowedCategories = [
        'Salon en L', 'Salon en U', 'Canapé 2 Places', 'Canapé 3 Places', 'Fauteuil', 
        'Chaise', 'Table de Salle à Manger', 'Table Basse', 'Meubles TV', "Table d'Appoint",
        'Buffet', 'Console', 'Bibliothèque', 'Lit', 'Table de Chevet', "Ensemble d'Extérieur",
        'Transat', 'Table Extérieur', 'Chaise Extérieur', 'Miroirs', 'Pouf', 'Tableaux',
        'Luminaire-Luxalight', 'Couettes', 'Matelas', 'Oreillers', 'Tapis'
    ];

    $allowedCategoriesStr = implode("','", array_map(function($cat) {
        return addslashes($cat);
    }, $allowedCategories));

    // Modified SQL query to handle 'all' stores correctly
    $sql = "
        SELECT 
            p.ref,
            p.label as name,
            c.label as category,
            p.price_ttc as price,
            SUM(CASE 
                WHEN :store_id = 'all' THEN ps.reel
                WHEN :store_id = '1' AND ps.fk_entrepot = 1 THEN ps.reel
                WHEN :store_id = '2' AND ps.fk_entrepot = 18 THEN ps.reel
                WHEN :store_id = '6' AND ps.fk_entrepot = 4 THEN ps.reel
                WHEN :store_id = '5' AND ps.fk_entrepot = 3 THEN ps.reel
                ELSE 0
            END) as current_stock,
            COALESCE((
                SELECT SUM(fd.qty) 
                FROM llx_facturedet fd 
                JOIN llx_facture f ON fd.fk_facture = f.rowid
                WHERE fd.fk_product = p.rowid 
                AND f.datef >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
                AND f.datef <= NOW()
                AND CASE 
                    WHEN :store_id = 'all' THEN f.entity IN (1,2,5,6)
                    WHEN :store_id = '1' THEN f.entity = 1
                    WHEN :store_id = '2' THEN f.entity = 2
                    WHEN :store_id = '6' THEN f.entity = 5
                    WHEN :store_id = '5' THEN f.entity = 6
                END
            ), 0) as sales_4_weeks
        FROM llx_product p
        JOIN llx_product_stock ps ON p.rowid = ps.fk_product
        JOIN llx_categorie_product cp ON p.rowid = cp.fk_product
        JOIN llx_categorie c ON cp.fk_categorie = c.rowid
        WHERE c.label IN ('$allowedCategoriesStr')
        AND CASE 
            WHEN :store_id = 'all' THEN ps.fk_entrepot IN (1,18,4,3,5)
            WHEN :store_id = '1' THEN ps.fk_entrepot = 1
            WHEN :store_id = '2' THEN ps.fk_entrepot = 18
            WHEN :store_id = '6' THEN ps.fk_entrepot = 4
            WHEN :store_id = '5' THEN ps.fk_entrepot = 3
        END
        AND (:search = '' OR 
            LOWER(p.ref) LIKE LOWER(:search_pattern) OR 
            LOWER(p.label) LIKE LOWER(:search_pattern) OR 
            LOWER(c.label) LIKE LOWER(:search_pattern)
        )
        GROUP BY p.rowid
        HAVING SUM(CASE 
            WHEN :store_id = 'all' THEN ps.reel
            WHEN :store_id = '1' AND ps.fk_entrepot = 1 THEN ps.reel
            WHEN :store_id = '2' AND ps.fk_entrepot = 18 THEN ps.reel
            WHEN :store_id = '6' AND ps.fk_entrepot = 4 THEN ps.reel
            WHEN :store_id = '5' AND ps.fk_entrepot = 3 THEN ps.reel
            ELSE 0
        END) > 0";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':store_id', $store_id, PDO::PARAM_STR);
    $searchPattern = "%{$search}%";
    $stmt->bindParam(':search', $search, PDO::PARAM_STR);
    $stmt->bindParam(':search_pattern', $searchPattern, PDO::PARAM_STR);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($results)) {
        echo json_encode([]);
        exit;
    }

    // Calculate days in stock
    $formattedResults = array_values(array_unique(array_map(function($item) {
        $daysInStock = $item['sales_4_weeks'] > 0 
            ? round(($item['current_stock'] / $item['sales_4_weeks']) * 28) 
            : 999999;

        return [
            'ref' => $item['ref'],
            'name' => $item['name'],
            'category' => $item['category'],
            'price' => floatval($item['price']),
            'current_stock' => (int)$item['current_stock'],
            'sales_4_weeks' => (int)$item['sales_4_weeks'],
            'days_in_stock' => $daysInStock
        ];
    }, $results), SORT_REGULAR));

    // Sort by price and days in stock
    usort($formattedResults, function($a, $b) {
        if ($a['price'] !== $b['price']) {
            return $b['price'] - $a['price'];
        }
        return $b['days_in_stock'] - $a['days_in_stock'];
    });

    echo json_encode($formattedResults);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => 'General error: ' . $e->getMessage()]);
}
?> 