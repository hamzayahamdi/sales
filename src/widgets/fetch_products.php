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

    // Get parameters
    $store_id = $_GET['store_id'] ?? 'all';
    $dateRange = $_GET['dateRange'] ?? '4';

    // Define allowed categories
    $allowedCategories = [
        'Salon en L', 'Salon en U', 'Canapé 2 Places', 'Canapé 3 Places', 'Fauteuil', 
        'Chaise', 'Table de Salle à Manger', 'Table Basse', 'Meubles TV', "Table d'Appoint",
        'Buffet', 'Console', 'Bibliothèque', 'Lit', 'Table de Chevet', "Ensemble d'Extérieur",
        'Transat', 'Table Extérieur', 'Chaise Extérieur', 'Miroirs', 'Pouf', 'Tableaux',
        'Luminaire-Luxalight', 'Couettes', 'Matelas', 'Oreillers', 'Tapis'
    ];

    $allResults = [];

    // Fetch data for each category
    foreach ($allowedCategories as $category) {
        $sql = "
            WITH StockData AS (
                SELECT 
                    p.ref,
                    p.label as name,
                    c.label as category,
                    p.price_ttc as price,
                    COALESCE(
                        CASE 
                            WHEN :store_id = 'all' THEN SUM(ps.reel)
                            WHEN :store_id = '1' AND ps.fk_entrepot = 1 THEN ps.reel
                            WHEN :store_id = '2' AND ps.fk_entrepot = 18 THEN ps.reel
                            WHEN :store_id = '6' AND ps.fk_entrepot = 4 THEN ps.reel
                            WHEN :store_id = '5' AND ps.fk_entrepot = 3 THEN ps.reel
                        END, 0
                    ) as current_stock,
                    COALESCE((
                        SELECT SUM(fd.qty) 
                        FROM llx_facturedet fd 
                        JOIN llx_facture f ON fd.fk_facture = f.rowid
                        WHERE fd.fk_product = p.rowid 
                        AND f.datef >= DATE_SUB(NOW(), INTERVAL :dateRange WEEK)
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
                WHERE c.label = :category
                AND CASE 
                    WHEN :store_id = 'all' THEN ps.fk_entrepot IN (1,18,4,3,5)
                    WHEN :store_id = '1' THEN ps.fk_entrepot = 1
                    WHEN :store_id = '2' THEN ps.fk_entrepot = 18
                    WHEN :store_id = '6' THEN ps.fk_entrepot = 4
                    WHEN :store_id = '5' THEN ps.fk_entrepot = 3
                END
                GROUP BY p.rowid, p.ref, p.label, c.label
                HAVING current_stock > 0
            )
            SELECT *,
                CASE 
                    WHEN sales_4_weeks = 0 THEN 999999 
                    ELSE ROUND((current_stock / sales_4_weeks) * 28)
                END as days_in_stock
            FROM StockData
            ORDER BY days_in_stock DESC, current_stock DESC";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':store_id', $store_id, PDO::PARAM_STR);
        $stmt->bindParam(':dateRange', $dateRange, PDO::PARAM_INT);
        $stmt->bindParam(':category', $category, PDO::PARAM_STR);
        
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (!empty($results)) {
            $allResults = array_merge($allResults, $results);
        }
    }

    // Sort all results by days_in_stock
    usort($allResults, function($a, $b) {
        return $b['days_in_stock'] - $a['days_in_stock'];
    });

    // Return all results without limit
    echo json_encode($allResults);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?> 