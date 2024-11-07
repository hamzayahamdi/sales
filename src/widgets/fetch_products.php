<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);  // Turn on display of errors for debugging
error_reporting(E_ALL);        // Report all errors
ini_set('log_errors', 1);      // Enable error logging
ini_set('error_log', '/path/to/php-error.log');  // Path to an error log file

$host = '206.189.4.199';
$dbname = 'hchhgjukna';
$username = 'hchhgjukna';
$password = 'BAmx7n8bnG';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['error' => 'Database connection failed.']);
    exit;
}

$type = urldecode($_GET['type'] ?? 'search'); // Default to 'search' if type is not set
$query = urldecode($_GET['query'] ?? ''); // Default to empty if query is not set
$dateRange = urldecode($_GET['dateRange'] ?? '4'); // Default to 4 weeks if dateRange is not set

$excludedCategories = [
    'OLD', 
    'ABDELAZIZ ALAIDI', 
    'AIT MAZIGHT', 
    'ANI REDOUANE', 
    'AZTOT NASER', 
    'BAMOU MOHAMED', 
    'BELFQIH JAWAD', 
    'DARIF MUSTAPHA', 
    'FIKRI MOHAMED', 
    'GAYAL', 
    'NASR RACHID', 
    'NIAMI ABDELKEBIR', 
    'OUHAJJOU ABDELLATIF', 
    'OUTDOORZ', 
    'SAOUD MOHAMED', 
    'TAOUDI SLAOUI',
    'NAQRAOUI AZEDINE',
    'SAID AKCHOUCH'
];

$excludedCategoriesList = implode(',', array_map(function($category) use ($conn) {
    return $conn->quote($category);
}, $excludedCategories));

$allowedCategories = [
    'Salon en L', 'Salon en U', 'Canapé 2 Places', 'Canapé 3 Places', 'Fauteuil', 
    'Chaise', 'Table de Salle à Manger', 'Table Basse', 'Meubles TV', "Table d'Appoint",
    'Buffet', 'Console', 'Bibliothèque', 'Lit', 'Table de Chevet', "Ensemble d'Extérieur",
    'Transat', 'Table Extérieur', 'Chaise Extérieur', 'Miroirs', 'Pouf', 'Tableaux',
    'Luminaire-Luxalight', 'Couettes', 'Matelas', 'Oreillers', 'Tapis'
];

$allowedCategoriesList = implode(',', array_map(function($category) use ($conn) {
    return $conn->quote($category);
}, $allowedCategories));

$sql_common = "SELECT 
    GROUP_CONCAT(DISTINCT c.label ORDER BY c.label SEPARATOR ', ') AS `Catégorie`,
    p.ref AS `Ref. produit`, 
    p.label AS `Libellé`, 
    p.price_ttc AS `Prix Promo`,
    SUM(CASE WHEN ps.fk_entrepot IN (1, 18, 4, 3) THEN ps.reel ELSE 0 END) AS `Total Stock`,
    COALESCE((
        SELECT SUM(fd.qty) 
        FROM llx_facturedet fd 
        LEFT JOIN llx_facture f ON fd.fk_facture = f.rowid
        WHERE fd.fk_product = p.rowid 
        AND CASE 
            WHEN :store_id = 'all' THEN f.entity IN (1, 2, 5, 6)
            WHEN :store_id = '1' THEN f.entity = 1
            WHEN :store_id = '2' THEN f.entity = 2
            WHEN :store_id = '6' THEN f.entity = 5
            WHEN :store_id = '5' THEN f.entity = 6
        END
        AND f.datef BETWEEN NOW() - INTERVAL :dateRange WEEK AND NOW()
    ), 0) AS `Total Sales`,
    SUM(CASE WHEN ps.fk_entrepot = 1 THEN ps.reel ELSE 0 END) AS `Stock Casa`,
    SUM(CASE WHEN ps.fk_entrepot = 18 THEN ps.reel ELSE 0 END) AS `Stock Rabat`,
    SUM(CASE WHEN ps.fk_entrepot = 4 THEN ps.reel ELSE 0 END) AS `Stock Marrakech`,
    SUM(CASE WHEN ps.fk_entrepot = 3 THEN ps.reel ELSE 0 END) AS `Stock Tanger`
FROM llx_product p
LEFT JOIN llx_product_stock ps ON p.rowid = ps.fk_product
LEFT JOIN llx_categorie_product cp ON p.rowid = cp.fk_product
LEFT JOIN llx_categorie c ON cp.fk_categorie = c.rowid
WHERE c.label IN ($allowedCategoriesList)
AND c.label NOT IN ($excludedCategoriesList)";

try {
    if ($type === 'category') {
        if (empty($query)) {
            $sql = $sql_common . " GROUP BY p.rowid ORDER BY `Total Stock` DESC";
        } else {
            $sql = $sql_common . " AND c.label = :query  GROUP BY p.rowid ORDER BY `Total Stock` DESC";
        }
        $stmt = $conn->prepare($sql);
        if (!empty($query)) {
            $stmt->bindParam(':query', $query, PDO::PARAM_STR);
        }
        $stmt->bindParam(':dateRange', $dateRange, PDO::PARAM_INT);
        $stmt->bindParam(':store_id', $_GET['store_id'] ?? 'all', PDO::PARAM_STR);
    } elseif ($type === 'search' && !empty($query)) {
        $keywords = explode(' ', $query);
        $conditions = [];
        $params = [];
        foreach ($keywords as $keyword) {
            $keyword = trim($keyword); // Trim spaces
            $paramName = ':keyword' . count($params); // Ensure unique param name
            $conditions[] = "(p.ref LIKE $paramName OR p.label LIKE $paramName)";
            $params[$paramName] = '%' . $keyword . '%';
        }

        $sql = $sql_common . " AND (" . implode(' AND ', $conditions) . ") GROUP BY p.rowid ORDER BY `Total Stock` DESC";
        $stmt = $conn->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value, PDO::PARAM_STR);
        }
        $stmt->bindParam(':dateRange', $dateRange, PDO::PARAM_INT);
        $stmt->bindParam(':store_id', $_GET['store_id'] ?? 'all', PDO::PARAM_STR);
    } elseif ($type === 'factory') {
        $sql = $sql_common . " AND SUBSTRING_INDEX(SUBSTRING_INDEX(p.ref, '.', 2), '.', -1) = :query GROUP BY p.rowid ORDER BY `Catégorie`, `Total Stock` ASC";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':query', $query, PDO::PARAM_STR);
        $stmt->bindParam(':dateRange', $dateRange, PDO::PARAM_INT);
        $stmt->bindParam(':store_id', $_GET['store_id'] ?? 'all', PDO::PARAM_STR);
    } else {
        echo json_encode(['error' => 'Invalid request type or missing query.']);
        exit;
    }

    error_log('Executing SQL: ' . $sql);
    error_log('With Parameters: ' . json_encode(['query' => $query, 'dateRange' => $dateRange]));

    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($results === false) {
        echo json_encode(['error' => 'No data found.']);
        exit;
    }

    foreach ($results as &$item) {
        $stockFrimoda = $item['Stock Frimoda'];
        $totalSales = $item['Total Sales'];
        $prixPromo = (float) $item['Prix Promo'];
        $totalTtcSold = $totalSales * $prixPromo;

        if ($totalSales == 0) {
            $item['Ratio SKE'] = $stockFrimoda == 0 ? 'Produit en pause' : 'Produit à ralentir';
            $item['Ratio Total'] = $item['Total Stock'] == 0 ? 'Produit en pause' : 'Produit à ralentir';
        } else {
            $item['Ratio SKE'] = round($stockFrimoda / $totalSales, 2);
            $item['Ratio Total'] = round(($item['Total Stock'] / $totalSales) * 29, 2);
        }

        $item['TotalSalesValue'] = $totalTtcSold; // Calculate total sales value
    }

    usort($results, function($a, $b) {
        if ($a['TotalSalesValue'] === $b['TotalSalesValue']) {
            if ($a['Ratio SKE'] === 'Produit en pause' || $a['Ratio SKE'] === 'Produit à ralentir') return 1;
            if ($b['Ratio SKE'] === 'Produit en pause' || $b['Ratio SKE'] === 'Produit à ralentir') return -1;
            return $a['Ratio SKE'] <=> $b['Ratio SKE'];
        }
        return $b['TotalSalesValue'] <=> $a['TotalSalesValue'];
    });

    echo json_encode($results);
} catch (Exception $e) {
    error_log('Query execution failed: ' . $e->getMessage());
    error_log('SQL: ' . $sql);
    error_log('Parameters: ' . json_encode(['query' => $query, 'dateRange' => $dateRange]));
    echo json_encode(['error' => 'Query execution failed.']);
}
?>
