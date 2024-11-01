<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection details
$host = '206.189.4.199';
$db = 'hchhgjukna';
$user = 'hchhgjukna';
$pass = 'BAmx7n8bnG';

// Start a session to manage the Dolibarr authentication
session_start();

// Database connection options
$dsn = "mysql:host=$host;dbname=$db;charset=utf8";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

// Connect to the database
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    error_log('Database connection successful');
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['error' => 'Database connection failed. Please check the logs for more details.']);
    exit;
}

// Function to generate PDF link
function generate_pdf_link($invoice_ref, $store_id) {
    return "https://erp.sketch-design.ma/htdocs/document.php?modulepart=facture&attachment=0&file=" . urlencode($invoice_ref) . "%2F" . urlencode($invoice_ref) . ".pdf&entity=" . $store_id;
}

// Get and format the date inputs
$date_range = $_POST['date_range'] ?? '';
if (empty($date_range)) {
    echo json_encode(['error' => 'Date range is required.']);
    exit;
}

list($start_date_input, $end_date_input) = explode(' - ', $date_range);
$start_date = DateTime::createFromFormat('d/m/Y', $start_date_input);
$end_date = DateTime::createFromFormat('d/m/Y', $end_date_input);

if ($start_date === false || $end_date === false) {
    echo json_encode(['error' => 'Invalid date format. Please use dd/mm/yyyy format.']);
    exit;
}

$start_date = $start_date->format('Y-m-d');
$end_date = $end_date->format('Y-m-d');
$search_term = isset($_POST['search_term']) ? '%' . $_POST['search_term'] . '%' : '';
$store_id = $_POST['store_id'] ?? null;

if ($store_id === null) {
    echo json_encode(['error' => 'Store ID is required.']);
    exit;
}

// Log received parameters
error_log("Received parameters: start_date = $start_date, end_date = $end_date, search_term = $search_term, store_id = $store_id");

// Function to fetch revenue by store
function fetchRevenueByStore($pdo, $start_date, $end_date) {
    $entities = [1, 2, 5, 6, 10]; // List of store entity IDs
    $revenue_by_store = [];
    $total_revenue = 0;

    $revenue_sql = "
        SELECT
            e.label AS store,
            SUM(f.total_ttc) AS revenue
        FROM
            llx_facture AS f
        INNER JOIN llx_entity AS e ON f.entity = e.rowid
        WHERE
            f.entity IN (" . implode(',', $entities) . ")
            AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
        GROUP BY
            e.label
        ORDER BY
            revenue DESC
    ";

    $revenue_stmt = $pdo->prepare($revenue_sql);
    $revenue_stmt->execute([
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $revenue_by_store = $revenue_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate total revenue
    foreach ($revenue_by_store as $store) {
        $total_revenue += $store['revenue'];
    }

    // Calculate percentages
    foreach ($revenue_by_store as &$store) {
        $store['percentage'] = ($total_revenue > 0) ? ($store['revenue'] / $total_revenue) * 100 : 0;
    }

    return $revenue_by_store;
}

// Fetch revenue by store for consistency across all tabs
$revenue_by_store = fetchRevenueByStore($pdo, $start_date, $end_date);

// Helper function to fetch and sum up data for all stores
function fetchAndSumData($pdo, $start_date, $end_date, $search_term) {
    $entities = [1, 2, 5, 6, 10]; // List of store entity IDs
    $total_invoice_ttc = 0;
    $total_encaisse = 0;
    $total_unpaid = 0;
    $total_payments = [];
    $sales = [];
    $commercial_ranking = [];
    $best_selling_products = [];
    $revenue_by_category = [];
    $payments = [];

    foreach ($entities as $entity) {
        $result = fetchDataForStore($pdo, $entity, $start_date, $end_date, $search_term);
        $total_invoice_ttc += $result['total_invoice_ttc'];
        $total_encaisse += $result['total_encaisse'];
        $total_unpaid += $result['total_unpaid'];
        
        // Aggregate payments
        foreach ($result['total_payments'] as $payment) {
            $mode = $payment['payment_mode'];
            $amount = $payment['total_amount'];
            if (!isset($total_payments[$mode])) {
                $total_payments[$mode] = 0;
            }
            $total_payments[$mode] += $amount;
        }
        
        $sales = array_merge($sales, $result['sales']);
        $commercial_ranking = array_merge($commercial_ranking, $result['commercial_ranking']);
        $payments = array_merge($payments, $result['payments']);
        
        // Aggregate best-selling products
        foreach ($result['best_selling_products'] as $product) {
            $label = $product['product_label'];
            if (!isset($best_selling_products[$label])) {
                $best_selling_products[$label] = $product;
            } else {
                $best_selling_products[$label]['qty_sold'] += $product['qty_sold'];
                $best_selling_products[$label]['total_ttc'] += $product['total_ttc'];
            }
        }
        
        // Aggregate revenue by category
        foreach ($result['revenue_by_category'] as $category) {
            $label = $category['category'];
            if (!isset($revenue_by_category[$label])) {
                $revenue_by_category[$label] = $category;
            } else {
                $revenue_by_category[$label]['total_revenue'] += $category['total_revenue'];
            }
        }
    }

    // Sort the aggregated revenue by category from highest to lowest
    usort($revenue_by_category, function($a, $b) {
        return $b['total_revenue'] - $a['total_revenue'];
    });

    // Convert associative arrays back to indexed arrays
    $total_payments = array_map(function($mode, $amount) {
        return ['payment_mode' => $mode, 'total_amount' => $amount];
    }, array_keys($total_payments), $total_payments);

    $best_selling_products = array_values($best_selling_products);
    $revenue_by_category = array_values($revenue_by_category);

    // Return aggregated results
    return [
        'total_invoice_ttc' => $total_invoice_ttc,
        'total_encaisse' => $total_encaisse,
        'total_unpaid' => $total_unpaid,
        'total_payments' => $total_payments,
        'sales' => $sales,
        'commercial_ranking' => $commercial_ranking,
        'best_selling_products' => $best_selling_products,
        'revenue_by_category' => $revenue_by_category,
        'payments' => $payments
    ];
}

// Fetch data for a single store
function fetchDataForStore($pdo, $store_id, $start_date, $end_date, $search_term) {
    $total_invoice_ttc_sql = "
        SELECT SUM(f.total_ttc) AS total_invoice_ttc
        FROM llx_facture AS f
        WHERE f.entity = :entity
          AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
    ";

    $total_invoice_ttc_stmt = $pdo->prepare($total_invoice_ttc_sql);
    $total_invoice_ttc_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $total_invoice_ttc = $total_invoice_ttc_stmt->fetchColumn() ?: 0;

    $total_payments_sql = "
        SELECT
            cp.code AS payment_mode,
            SUM(p.amount) AS total_amount
        FROM llx_paiement AS p
        INNER JOIN llx_c_paiement AS cp ON p.fk_paiement = cp.id
        WHERE p.entity = :entity
          AND p.datep BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 1 DAY)
        GROUP BY payment_mode
        ORDER BY payment_mode ASC
    ";

    $total_payments_stmt = $pdo->prepare($total_payments_sql);
    $total_payments_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $total_payments = $total_payments_stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    $total_encaisse_sql = "
        SELECT SUM(amount) AS total_encaisse
        FROM llx_paiement
        WHERE entity = :entity
          AND datep BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 1 DAY)
    ";

    $total_encaisse_stmt = $pdo->prepare($total_encaisse_sql);
    $total_encaisse_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $total_encaisse = $total_encaisse_stmt->fetchColumn() ?: 0;

    $total_unpaid_sql = "
        SELECT SUM(unpaid) AS total_unpaid
        FROM (
            SELECT f.total_ttc - COALESCE(SUM(pf.amount), 0) AS unpaid
            FROM llx_facture AS f
            LEFT JOIN llx_paiement_facture AS pf ON f.rowid = pf.fk_facture
            WHERE f.entity = :entity
              AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
            GROUP BY f.rowid
        ) AS subquery
    ";

    $total_unpaid_stmt = $pdo->prepare($total_unpaid_sql);
    $total_unpaid_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $total_unpaid = $total_unpaid_stmt->fetchColumn() ?: 0;

    $search_condition = '';
    $search_params = [];

    if (!empty($search_term)) {
        $search_condition = ' AND (
            p.ref LIKE :search_term OR 
            p.label LIKE :search_term OR 
            cl.nom LIKE :search_term OR 
            f.ref LIKE :search_term OR 
            cm.name LIKE :search_term
        )';
        $search_params = ['search_term' => $search_term];
    }

    $sales_sql = "
        SELECT
            f.rowid AS invoice_id,
            f.ref AS invoice_ref,
            f.datef AS invoice_date,
            f.total_ttc AS total_invoice_amount,
            COALESCE(p.amount_paid, 0) AS amount_paid,
            COALESCE(cn.credit_note_amount, 0) AS credit_note_amount,
            (COALESCE(p.amount_paid, 0) + COALESCE(cn.credit_note_amount, 0)) AS amount_paid_with_credits,
            (f.total_ttc - (COALESCE(p.amount_paid, 0) + COALESCE(cn.credit_note_amount, 0))) AS amount_unpaid,
            p.ref AS product_ref,
            p.label AS product_label,
            fd.qty AS qty_sold,
            fd.total_ttc AS product_price_ttc,
            e.label AS store_name,
            e.rowid AS entity_id,
            fd.description AS invoice_description,
            cm.name AS commercial_name,
            f.note_private AS private_note,
            cl.nom AS client_name,
            cl.phone AS client_phone,
            cl.idprof5 AS client_ice,
            CONCAT_WS(', ', p.payment_details, cn.credit_note_details) AS payment_details,
            f.type AS invoice_type
        FROM
            llx_facture AS f
        LEFT JOIN llx_facturedet AS fd ON f.rowid = fd.fk_facture
        LEFT JOIN llx_product AS p ON fd.fk_product = p.rowid
        LEFT JOIN llx_entity AS e ON f.entity = e.rowid
        LEFT JOIN (
            SELECT 
                pf.fk_facture, 
                SUM(pf.amount) AS amount_paid, 
                GROUP_CONCAT(
                    CASE 
                        WHEN cp.code = 'CB' THEN CONCAT('Carte bancaire', ': ', FORMAT(pf.amount, 2, 'de_DE'), ' (', DATE_FORMAT(p.datep, '%d-%m-%Y'), ')')
                        WHEN cp.code = 'VIR' THEN CONCAT('Virement', ': ', FORMAT(pf.amount, 2, 'de_DE'), ' (', DATE_FORMAT(p.datep, '%d-%m-%Y'), ')')
                        WHEN cp.code = 'LIQ' THEN CONCAT('Espèce', ': ', FORMAT(pf.amount, 2, 'de_DE'), ' (', DATE_FORMAT(p.datep, '%d-%m-%Y'), ')')
                        WHEN cp.code = 'CHQ' THEN CONCAT('Chèque', ': ', FORMAT(pf.amount, 2, 'de_DE'), ' (', DATE_FORMAT(p.datep, '%d-%m-%Y'), ')')
                        ELSE CONCAT(cp.code, ': ', FORMAT(pf.amount, 2, 'de_DE'), ' (', DATE_FORMAT(p.datep, '%d-%m-%Y'), ')')
                    END 
                    ORDER BY pf.rowid SEPARATOR ', '
                ) AS payment_details
            FROM 
                llx_paiement_facture AS pf
            LEFT JOIN 
                llx_paiement AS p ON pf.fk_paiement = p.rowid
            LEFT JOIN 
                llx_c_paiement AS cp ON p.fk_paiement = cp.id
            GROUP BY 
                pf.fk_facture
        ) AS p ON p.fk_facture = f.rowid
        LEFT JOIN (
            SELECT 
                re.fk_facture, 
                SUM(re.amount_ttc) AS credit_note_amount,
                GROUP_CONCAT(CONCAT('Avoir ', f.ref, ': ', FORMAT(re.amount_ttc, 0, 'de_DE')) ORDER BY re.rowid SEPARATOR ', ') AS credit_note_details
            FROM 
                llx_societe_remise_except AS re
            JOIN 
                llx_facture AS f ON re.fk_facture_source = f.rowid
            GROUP BY 
                re.fk_facture
        ) AS cn ON cn.fk_facture = f.rowid
        LEFT JOIN llx_facture_extrafields AS ef ON f.rowid = ef.fk_object
        LEFT JOIN llx_societe AS cl ON f.fk_soc = cl.rowid
        LEFT JOIN (
            SELECT 1 AS entity, 1 AS id, 'RAMDANI Siham' AS name UNION ALL
            SELECT 1, 2, 'TOUIMSNA Reda' UNION ALL
            SELECT 1, 3, 'MRABET Reda' UNION ALL
            SELECT 1, 4, 'BENABDELKHALEK Karim' UNION ALL
            SELECT 1, 5, 'Zakia' UNION ALL
            SELECT 1, 6, 'Islam' UNION ALL
            SELECT 1, 7, 'Fadoua' UNION ALL
            SELECT 1, 8, 'Rajaa' UNION ALL
            SELECT 1, 9, 'Hajar Rhiti' UNION ALL
            SELECT 1, 10, 'Nouhaila' UNION ALL
            SELECT 1, 11, 'Karima' UNION ALL
            SELECT 1, 12, 'Laila' UNION ALL
            SELECT 1, 13, 'Oussama El Kamili' UNION ALL
            SELECT 1, 14, 'Elmehdi babya' UNION ALL
            SELECT 1, 15, 'Zakaria Fadil' UNION ALL
            SELECT 1, 16, 'Bouchra' UNION ALL
            SELECT 2, 1, 'Mustapha EL ADLI' UNION ALL
            SELECT 2, 2, 'Samira DARROUS' UNION ALL
            SELECT 2, 3, 'Imane ZAOUINE' UNION ALL
            SELECT 2, 4, 'Otmane EKHALAF' UNION ALL
            SELECT 2, 5, 'Omaima ETTABAA' UNION ALL
            SELECT 2, 6, 'Mohamed BAZI' UNION ALL
            SELECT 2, 7, 'Hanane BAOUSSI' UNION ALL
            SELECT 2, 8, 'Jamila LAMBARKI' UNION ALL
            SELECT 2, 9, 'Chahrazad fenniri' UNION ALL
            SELECT 2, 10, 'Othmane moussaoui' UNION ALL
            SELECT 2, 11, 'Salma el hachimi' UNION ALL
            SELECT 2, 12, 'Zineb cherradi' UNION ALL
            SELECT 2, 13, 'Ibrahim rouguiague' UNION ALL
            SELECT 5, 1, 'Fadwa' UNION ALL
            SELECT 5, 2, 'Ouiam' UNION ALL
            SELECT 5, 3, 'Hamid' UNION ALL
            SELECT 5, 4, 'Nadi' UNION ALL
            SELECT 5, 5, 'Issam' UNION ALL
            SELECT 5, 6, 'Merieme' UNION ALL
            SELECT 5, 7, 'Aya' UNION ALL
            SELECT 6, 1, 'Laila BOUCHEMAMA' UNION ALL
            SELECT 6, 2, 'Siham CHATIBI' UNION ALL
            SELECT 6, 3, 'Khadija MIKALI' UNION ALL
            SELECT 6, 4, 'Ghita DIB' UNION ALL
            SELECT 6, 5, 'Hanane ELOURI' UNION ALL
            SELECT 6, 6, 'Hicham' UNION ALL
             SELECT 6, 7, 'Mohammed bazi' UNION ALL
            SELECT 6, 8, 'Ibrahim rouguiague ' UNION ALL           
            SELECT 10, 1, 'Mustapha EL ADLI' UNION ALL
            SELECT 10, 2, 'Samira DARROUS' UNION ALL
            SELECT 10, 3, 'Imane ZAOUINE' UNION ALL
            SELECT 10, 4, 'Otmane EKHALAF' UNION ALL
            SELECT 10, 5, 'Omaima ETTABAA' UNION ALL
            SELECT 10, 6, 'Mohamed BAZI' UNION ALL
            SELECT 10, 7, 'Hanane BAOUSSI' UNION ALL
            SELECT 10, 8, 'Jamila LAMBARKI' UNION ALL
            SELECT 10, 9, 'Naida Mousstaqim' UNION ALL
            SELECT 10, 10, 'Chahrazad fenniri' UNION ALL
            SELECT 10, 11, 'Othmane moussaoui' UNION ALL
            SELECT 10, 12, 'Salma el hachimi' UNION ALL
            SELECT 10, 13, 'Zineb cherradi' UNION ALL
            SELECT 10, 14, 'Ibrahim rouguiague' UNION ALL
            SELECT 10, 15, 'Niima' 
        ) AS cm ON cm.entity = f.entity AND cm.id = ef.commercial
        WHERE
            f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
            $search_condition
        AND f.entity = :entity
        GROUP BY f.rowid, fd.rowid
        ORDER BY f.datef DESC
    ";

    $sales_params = array_merge(['start_date' => $start_date, 'end_date' => $end_date, 'entity' => $store_id], $search_params);
    $sales_stmt = $pdo->prepare($sales_sql);
    $sales_stmt->execute($sales_params);
    $sales = $sales_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Commercial ranking
    $commercial_ranking_sql = "
        SELECT
            cm.name AS commercial_name,
            SUM(f.total_ttc) AS revenue,
            f.entity AS entity,
            e.label AS store_name
        FROM
            llx_facture AS f
        LEFT JOIN llx_facture_extrafields AS ef ON f.rowid = ef.fk_object
        LEFT JOIN (
            SELECT 1 AS entity, 1 AS id, 'RAMDANI Siham' AS name UNION ALL
            SELECT 1, 2, 'TOUIMSNA Reda' UNION ALL
            SELECT 1, 3, 'MRABET Reda' UNION ALL
            SELECT 1, 4, 'BENABDELKHALEK Karim' UNION ALL
            SELECT 1, 5, 'Zakia' UNION ALL
            SELECT 1, 6, 'Islam' UNION ALL
            SELECT 1, 7, 'Fadoua' UNION ALL
            SELECT 1, 8, 'Rajaa' UNION ALL
            SELECT 1, 9, 'Hajar Rhiti' UNION ALL
            SELECT 1, 10, 'Nouhaila' UNION ALL
            SELECT 1, 11, 'Karima' UNION ALL
            SELECT 1, 12, 'Laila' UNION ALL
            SELECT 1, 13, 'Oussama El Kamili' UNION ALL
            SELECT 1, 14, 'Elmehdi babya' UNION ALL
            SELECT 1, 15, 'Zakaria Fadil' UNION ALL
            SELECT 1, 16, 'Bouchra' UNION ALL
            SELECT 1, 17, 'Chaimae Bentaleb ' UNION ALL
            SELECT 2, 1, 'Mustapha EL ADLI' UNION ALL
            SELECT 2, 2, 'Samira DARROUS' UNION ALL
            SELECT 2, 3, 'Imane ZAOUINE' UNION ALL
            SELECT 2, 4, 'Otmane EKHALAF' UNION ALL
            SELECT 2, 5, 'Omaima ETTABAA' UNION ALL
            SELECT 2, 6, 'Mohamed BAZI' UNION ALL
            SELECT 2, 7, 'Hanane BAOUSSI' UNION ALL
            SELECT 2, 8, 'Jamila LAMBARKI' UNION ALL
            SELECT 2, 9, 'Chahrazad fenniri' UNION ALL
            SELECT 2, 10, 'Othmane moussaoui' UNION ALL
            SELECT 2, 11, 'Salma el hachimi' UNION ALL
            SELECT 2, 12, 'Zineb cherradi' UNION ALL
            SELECT 2, 13, 'Ibrahim rouguiague' UNION ALL
            SELECT 5, 1, 'Fadwa' UNION ALL
            SELECT 5, 2, 'Ouiam' UNION ALL
            SELECT 5, 3, 'Hamid' UNION ALL
            SELECT 5, 4, 'Nadi' UNION ALL
            SELECT 5, 5, 'Issam' UNION ALL
            SELECT 5, 6, 'Merieme' UNION ALL
            SELECT 5, 7, 'Aya' UNION ALL
            SELECT 6, 1, 'Laila BOUCHEMAMA' UNION ALL
            SELECT 6, 2, 'Siham CHATIBI' UNION ALL
            SELECT 6, 3, 'Khadija MIKALI' UNION ALL
            SELECT 6, 4, 'Ghita DIB' UNION ALL
            SELECT 6, 5, 'Hanane ELOURI' UNION ALL
            SELECT 6, 6, 'Hicham' UNION ALL
            SELECT 6, 7, 'Mohammed bazi' UNION ALL
            SELECT 6, 8, 'Ibrahim rouguiague ' UNION ALL            
            SELECT 10, 1, 'Mustapha EL ADLI' UNION ALL
            SELECT 10, 2, 'Samira DARROUS' UNION ALL
            SELECT 10, 3, 'Imane ZAOUINE' UNION ALL
            SELECT 10, 4, 'Otmane EKHALAF' UNION ALL
            SELECT 10, 5, 'Omaima ETTABAA' UNION ALL
            SELECT 10, 6, 'Mohamed BAZI' UNION ALL
            SELECT 10, 7, 'Hanane BAOUSSI' UNION ALL
            SELECT 10, 8, 'Jamila LAMBARKI' UNION ALL
            SELECT 10, 9, 'Naida Mousstaqim' UNION ALL
            SELECT 10, 10, 'Chahrazad fenniri' UNION ALL
            SELECT 10, 11, 'Othmane moussaoui' UNION ALL
            SELECT 10, 12, 'Salma el hachimi' UNION ALL
            SELECT 10, 13, 'Zineb cherradi' UNION ALL
            SELECT 10, 14, 'Ibrahim rouguiague' UNION ALL
            SELECT 10, 15, 'Niima' 
        ) AS cm ON cm.entity = f.entity AND cm.id = ef.commercial
        LEFT JOIN llx_entity AS e ON f.entity = e.rowid
        WHERE
            f.entity = :entity
            AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
        GROUP BY cm.name, f.entity
        ORDER BY revenue DESC
        LIMIT 9000
    ";

    $commercial_ranking_stmt = $pdo->prepare($commercial_ranking_sql);
    $commercial_ranking_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $commercial_ranking = $commercial_ranking_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate the number of invoices per commercial
    $invoice_count_sql = "
        SELECT
            cm.name AS commercial_name,
            COUNT(f.rowid) AS invoice_count
        FROM
            llx_facture AS f
        LEFT JOIN llx_facture_extrafields AS ef ON f.rowid = ef.fk_object
        LEFT JOIN (
                     SELECT 1 AS entity, 1 AS id, 'RAMDANI Siham' AS name UNION ALL
                SELECT 1, 2, 'TOUIMSNA Reda' UNION ALL
                SELECT 1, 3, 'MRABET Reda' UNION ALL
                SELECT 1, 4, 'BENABDELKHALEK Karim' UNION ALL
                SELECT 1, 5, 'Zakia' UNION ALL
                SELECT 1, 6, 'Islam' UNION ALL
                SELECT 1, 7, 'Fadoua' UNION ALL
                SELECT 1, 8, 'Rajaa' UNION ALL
                SELECT 1, 9, 'Hajar Rhiti' UNION ALL
                SELECT 1, 10, 'Nouhaila' UNION ALL
                SELECT 1, 11, 'Karima' UNION ALL
                SELECT 1, 12, 'Laila' UNION ALL
                SELECT 1, 13, 'Oussama El Kamili' UNION ALL
                SELECT 1, 14, 'Elmehdi babya' UNION ALL
                SELECT 1, 15, 'Zakaria Fadil' UNION ALL
                SELECT 1, 16, 'Bouchra' UNION ALL
                SELECT 1, 17, 'Chaimae Bentaleb ' UNION ALL
                SELECT 2, 1, 'Mustapha EL ADLI' UNION ALL
                SELECT 2, 2, 'Samira DARROUS' UNION ALL
                SELECT 2, 3, 'Imane ZAOUINE' UNION ALL
                SELECT 2, 4, 'Otmane EKHALAF' UNION ALL
                SELECT 2, 5, 'Omaima ETTABAA' UNION ALL
                SELECT 2, 6, 'Mohamed BAZI' UNION ALL
                SELECT 2, 7, 'Hanane BAOUSSI' UNION ALL
                SELECT 2, 8, 'Jamila LAMBARKI' UNION ALL
                SELECT 2, 9, 'Chahrazad fenniri' UNION ALL
                SELECT 2, 10, 'Othmane moussaoui' UNION ALL
                SELECT 2, 11, 'Salma el hachimi' UNION ALL
                SELECT 2, 12, 'Zineb cherradi' UNION ALL
                SELECT 2, 13, 'Ibrahim rouguiague' UNION ALL
                SELECT 5, 1, 'Fadwa' UNION ALL
                SELECT 5, 2, 'Ouiam' UNION ALL
                SELECT 5, 3, 'Hamid' UNION ALL
                SELECT 5, 4, 'Nadi' UNION ALL
                SELECT 5, 5, 'Issam' UNION ALL
                SELECT 5, 6, 'Merieme' UNION ALL
                SELECT 5, 7, 'Aya' UNION ALL
                SELECT 6, 1, 'Laila BOUCHEMAMA' UNION ALL
                SELECT 6, 2, 'Siham CHATIBI' UNION ALL
                SELECT 6, 3, 'Khadija MIKALI' UNION ALL
                SELECT 6, 4, 'Ghita DIB' UNION ALL
                SELECT 6, 5, 'Hanane ELOURI' UNION ALL
                SELECT 6, 6, 'Hicham' UNION ALL
                SELECT 10, 1, 'Mustapha EL ADLI' UNION ALL
                SELECT 10, 2, 'Samira DARROUS' UNION ALL
                SELECT 10, 3, 'Imane ZAOUINE' UNION ALL
                SELECT 10, 4, 'Otmane EKHALAF' UNION ALL
                SELECT 10, 5, 'Omaima ETTABAA' UNION ALL
                SELECT 10, 6, 'Mohamed BAZI' UNION ALL
                SELECT 10, 7, 'Hanane BAOUSSI' UNION ALL
                SELECT 10, 8, 'Jamila LAMBARKI' UNION ALL
                SELECT 10, 9, 'Naida Mousstaqim' UNION ALL
                SELECT 10, 10, 'Chahrazad fenniri' UNION ALL
                SELECT 10, 11, 'Othmane moussaoui' UNION ALL
                SELECT 10, 12, 'Salma el hachimi' UNION ALL
                SELECT 10, 13, 'Zineb cherradi' UNION ALL
                SELECT 10, 14, 'Ibrahim rouguiague' UNION ALL
                SELECT 10, 15, 'Niima' 
        ) AS cm ON cm.entity = f.entity AND cm.id = ef.commercial
        WHERE
            f.entity = :entity
            AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
        GROUP BY cm.name
    ";

    $invoice_count_stmt = $pdo->prepare($invoice_count_sql);
    $invoice_count_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $invoice_counts = $invoice_count_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert the invoice counts to an associative array for easy lookup
    $invoice_counts_by_commercial = [];
    foreach ($invoice_counts as $invoice_count) {
        $invoice_counts_by_commercial[$invoice_count['commercial_name']] = $invoice_count['invoice_count'];
    }

    // Add average basket to each commercial
    foreach ($commercial_ranking as &$commercial) {
        $commercial_name = $commercial['commercial_name'];
        $invoice_count = isset($invoice_counts_by_commercial[$commercial_name]) ? $invoice_counts_by_commercial[$commercial_name] : 1;
        $commercial['average_basket'] = $commercial['revenue'] / $invoice_count;
        $commercial['invoice_count'] = $invoice_count;
    }
    unset($commercial); // Break reference

    // Best selling products
    $best_selling_products_sql = "
        SELECT
            p.ref AS product_ref,
            p.label AS product_label,
            SUM(fd.qty) AS qty_sold,
            SUM(fd.total_ttc) AS total_ttc,
            SUM(CASE WHEN ps.fk_entrepot = 1 THEN ps.reel ELSE 0 END) AS stock_casa,
            SUM(CASE WHEN ps.fk_entrepot = 18 THEN ps.reel ELSE 0 END) AS stock_rabat,
            SUM(CASE WHEN ps.fk_entrepot = 4 THEN ps.reel ELSE 0 END) AS stock_marrakech,
            SUM(CASE WHEN ps.fk_entrepot = 3 THEN ps.reel ELSE 0 END) AS stock_tanger,
            SUM(CASE WHEN ps.fk_entrepot IN (1, 18, 4, 3) THEN ps.reel ELSE 0 END) AS total_stock
        FROM
            llx_facturedet AS fd
            LEFT JOIN llx_product AS p ON fd.fk_product = p.rowid
            LEFT JOIN llx_facture AS f ON fd.fk_facture = f.rowid
            LEFT JOIN llx_product_stock ps ON p.rowid = ps.fk_product
        WHERE
            " . ($store_id != 'all' ? "f.entity = :entity" : "f.entity IN (1, 2, 5, 6, 10)") . "
            AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
        GROUP BY 
            p.ref, p.label
        ORDER BY 
            total_ttc DESC
        LIMIT 10
    ";

    $best_selling_products_stmt = $pdo->prepare($best_selling_products_sql);
    $best_selling_products_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $best_selling_products = $best_selling_products_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Revenue by category
    $excluded_categories = [
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

    $excluded_categories_list = "'" . implode("','", $excluded_categories) . "'";

 /*   $revenue_by_category_sql = "
        SELECT
            final_cat.label AS category,
            SUM(fd.total_ttc) AS total_revenue
        FROM
            llx_facturedet AS fd
        LEFT JOIN llx_product AS p ON fd.fk_product = p.rowid
        LEFT JOIN llx_categorie_product AS cp ON p.rowid = cp.fk_product
        LEFT JOIN llx_categorie AS cat ON cp.fk_categorie = cat.rowid
        LEFT JOIN llx_facture AS f ON fd.fk_facture = f.rowid
        LEFT JOIN (
            SELECT
                cp.fk_product,
                MIN(cat.label) AS label
            FROM
                llx_categorie_product AS cp
            LEFT JOIN llx_categorie AS cat ON cp.fk_categorie = cat.rowid
            WHERE
                cat.label NOT IN ($excluded_categories_list)
            GROUP BY
                cp.fk_product
        ) AS final_cat ON p.rowid = final_cat.fk_product
        WHERE
            f.entity = :entity
            AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
            AND final_cat.label IS NOT NULL
        GROUP BY
            final_cat.label
        ORDER BY
            total_revenue DESC
    "; */



$revenue_by_category_sql = "
    SELECT
        cat.label AS category,
        SUM(fd.total_ttc) AS total_revenue
    FROM
        llx_facture f
        INNER JOIN llx_facturedet fd ON f.rowid = fd.fk_facture
        INNER JOIN llx_product p ON fd.fk_product = p.rowid
        INNER JOIN llx_categorie_product cp ON p.rowid = cp.fk_product
        INNER JOIN llx_categorie cat ON cp.fk_categorie = cat.rowid
    WHERE
        " . ($store_id != 'all' ? "f.entity = :entity" : "f.entity IN (1, 2, 5, 6, 10)") . "
        AND f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
        AND cat.label NOT IN ($excluded_categories_list)
        AND fd.total_ttc > 0  -- Ensure we only count positive values
    GROUP BY
        cat.label
    HAVING
        SUM(fd.total_ttc) > 0
    ORDER BY
        total_revenue DESC
";


    $revenue_by_category_stmt = $pdo->prepare($revenue_by_category_sql);
    $revenue_by_category_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $revenue_by_category = $revenue_by_category_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Payments data
    $payments_sql = "
        SELECT
            p.rowid AS payment_id,
            p.datep AS payment_date,
            p.ref AS payment_ref,
            f.ref AS invoice_ref,
            f.datef AS invoice_date,
            p.amount AS amount,
            CASE
                WHEN cp.code = 'CB' THEN 'Carte bancaire'
                WHEN cp.code = 'VIR' THEN 'Virement'
                WHEN cp.code = 'LIQ' THEN 'Espèce'
                WHEN cp.code = 'CHQ' THEN 'Chèque'
                ELSE COALESCE(cp.libelle, 'Autre')
            END AS payment_method
        FROM
            llx_paiement AS p
        LEFT JOIN llx_paiement_facture AS pf ON p.rowid = pf.fk_paiement
        LEFT JOIN llx_facture AS f ON pf.fk_facture = f.rowid
        LEFT JOIN llx_c_paiement AS cp ON p.fk_paiement = cp.id
        WHERE
            p.entity = :entity
            AND p.datep BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 1 DAY)
        ORDER BY p.datep DESC
    ";

    $payments_stmt = $pdo->prepare($payments_sql);
    $payments_stmt->execute([
        'entity' => $store_id,
        'start_date' => $start_date,
        'end_date' => $end_date
    ]);
    $payments = $payments_stmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        'total_invoice_ttc' => $total_invoice_ttc,
        'total_encaisse' => $total_encaisse,
        'total_unpaid' => $total_unpaid,
        'total_payments' => $total_payments,
        'sales' => $sales,
        'commercial_ranking' => $commercial_ranking,
        'best_selling_products' => $best_selling_products,
        'revenue_by_category' => $revenue_by_category,
        'payments' => $payments
    ];
}

// Add this near the top of the file, after getting the date range
if (isset($_POST['fetch_daily']) && $_POST['fetch_daily'] === 'true') {
    // Parse the start and end dates
    $start_date_obj = DateTime::createFromFormat('d/m/Y', $start_date_input);
    $end_date_obj = DateTime::createFromFormat('d/m/Y', $end_date_input);
    
    if ($start_date_obj && $end_date_obj) {
        $daily_data = array();
        
        // SQL to fetch daily totals in one query
        $daily_sql = "
            SELECT 
                DATE_FORMAT(f.datef, '%d/%m') as date,
                SUM(f.total_ttc) as daily_total
            FROM 
                llx_facture AS f
            WHERE 
                f.datef BETWEEN :start_date AND DATE_ADD(:end_date, INTERVAL 0 DAY)
                " . ($store_id != 'all' ? "AND f.entity = :entity" : "AND f.entity IN (1, 2, 5, 6, 10)") . "
            GROUP BY 
                DATE(f.datef)
            ORDER BY 
                f.datef ASC
        ";

        try {
            $daily_stmt = $pdo->prepare($daily_sql);
            $params = [
                'start_date' => $start_date_obj->format('Y-m-d'),
                'end_date' => $end_date_obj->format('Y-m-d')
            ];
            
            // Only add entity parameter if not fetching all stores
            if ($store_id != 'all') {
                $params['entity'] = $store_id;
            }
            
            $daily_stmt->execute($params);

            // Fetch all daily totals
            $daily_results = $daily_stmt->fetchAll(PDO::FETCH_ASSOC);

            // Create an array with all dates in the range (including zeros)
            $current_date = clone $start_date_obj;
            while ($current_date <= $end_date_obj) {
                $date_key = $current_date->format('d/m');
                $daily_data[$date_key] = '0';
                $current_date->modify('+1 day');
            }

            // Fill in the actual values
            foreach ($daily_results as $row) {
                $daily_data[$row['date']] = number_format($row['daily_total'], 0, ',', ' ');
            }

            // Add daily_data to the response
            $response['daily_data'] = $daily_data;
            
            // Send only the daily data if that's what was requested
            if (isset($_POST['daily_only']) && $_POST['daily_only'] === 'true') {
                header('Content-Type: application/json');
                echo json_encode(['daily_data' => $daily_data]);
                exit;
            }
        } catch (PDOException $e) {
            error_log('Error fetching daily data: ' . $e->getMessage());
            if (isset($_POST['daily_only']) && $_POST['daily_only'] === 'true') {
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Failed to fetch daily data']);
                exit;
            }
        }
    }
}

// Fetch data based on the selected store or all stores
if ($store_id == 'all') {
    $result = fetchAndSumData($pdo, $start_date, $end_date, $search_term);
} else {
    $result = fetchDataForStore($pdo, $store_id, $start_date, $end_date, $search_term);
}

// Add the revenue by store to the result to ensure it's always available for the response
$result['revenue_by_store'] = $revenue_by_store;

// Process sales data to combine quantities and sum total values without repeating lines
$sales_combined = [];
foreach ($result['sales'] as $sale) {
    $key = $sale['product_ref'] . '_' . $sale['invoice_ref'];
    if (!isset($sales_combined[$key])) {
        $sales_combined[$key] = $sale;
    } else {
        $sales_combined[$key]['qty_sold'] += $sale['qty_sold'];
        $sales_combined[$key]['product_price_ttc'] += $sale['product_price_ttc'];
    }
}

// Process commercial ranking to add "Magasin" column and combine Rabat/Outlet commercials
$commercials_combined = [];
foreach ($result['commercial_ranking'] as $commercial) {
    if ($commercial['entity'] == 2 || $commercial['entity'] == 10) {
        $key = $commercial['commercial_name'] . '_Rabat/Outlet';
        $magasin = 'Rabat/Outlet';
    } else {
        $key = $commercial['commercial_name'] . '_' . $commercial['entity'];
        $magasin = $commercial['store_name'];
    }
    
    if (!isset($commercials_combined[$key])) {
        $commercials_combined[$key] = $commercial;
        $commercials_combined[$key]['magasin'] = $magasin;
    } else {
        $commercials_combined[$key]['revenue'] += $commercial['revenue'];
    }
}

// Sort the best-selling products by total_ttc in descending order
usort($result['best_selling_products'], function($a, $b) {
    return $b['total_ttc'] - $a['total_ttc'];
});

// Sort the commercial ranking by revenue in descending order
usort($commercials_combined, function($a, $b) {
    return $b['revenue'] - $a['revenue'];
});

// Ensure $result['revenue_by_category'] and $result['revenue_by_store'] are arrays
$result['revenue_by_category'] = $result['revenue_by_category'] ?? [];
$result['revenue_by_store'] = $result['revenue_by_store'] ?? [];

// Calculate percentages for categories and stores
$total_category_revenue = array_sum(array_column(array_filter($result['revenue_by_category'], function($category) {
    return $category['total_revenue'] > 0;
}), 'total_revenue'));

foreach ($result['revenue_by_category'] as &$category) {
    if ($category['total_revenue'] > 0) {
        $category['percentage'] = ($total_category_revenue > 0) ? ($category['total_revenue'] / $total_category_revenue) * 100 : 0;
    } else {
        $category['percentage'] = 0;
    }
}
unset($category); // Break reference

$total_revenue = array_sum(array_column($result['revenue_by_store'], 'revenue'));

foreach ($result['revenue_by_store'] as &$store) {
    $store['percentage'] = ($total_revenue > 0) ? ($store['revenue'] / $total_revenue) * 100 : 0;
}
unset($store); // Break reference

// Prepare the response
$response = [
    'total_invoice_ttc' => number_format($result['total_invoice_ttc'], 0, ',', ' '),
    'total_encaisse' => number_format($result['total_encaisse'], 0, ',', ' '),
    'total_unpaid' => number_format($result['total_unpaid'], 0, ',', ' '),
    'total_payments' => array_map(function($payment) {
        return [
            'mode' => htmlspecialchars($payment['payment_mode'] ?? ''),
            'amount' => number_format($payment['total_amount'], 2, ',', ' ')
        ];
    }, $result['total_payments']),
    'sales' => array_values(array_map(function($sale) {
        return [
            'invoice_id' => htmlspecialchars($sale['invoice_id'] ?? ''),
            'invoice_ref' => htmlspecialchars($sale['invoice_ref'] ?? ''),
            'invoice_date' => (new DateTime($sale['invoice_date']))->format('d-m-Y'),
            'product_ref' => htmlspecialchars($sale['product_ref'] ?? ''),
            'product_label' => htmlspecialchars(html_entity_decode($sale['product_label'] ?? '')),
            'invoice_description' => htmlspecialchars($sale['invoice_description'] ?? ''),
            'qty_sold' => htmlspecialchars($sale['qty_sold'] ?? ''),
            'product_price_ttc' => number_format((float) $sale['product_price_ttc'], 0, ',', ' '),
            'commercial_name' => htmlspecialchars($sale['commercial_name'] ?? ''),
            'client_name' => htmlspecialchars($sale['client_name'] ?? ''),
            'client_phone' => htmlspecialchars($sale['client_phone'] ?? ''),
            'client_ice' => htmlspecialchars($sale['client_ice'] ?? ''),
            'private_note' => htmlspecialchars($sale['private_note'] ?? ''),
            'payment_details' => htmlspecialchars($sale['payment_details'] ?? ''),
            'total_invoice_amount' => number_format((float) $sale['total_invoice_amount'], 2, ',', ' '),
            'credit_note_amount' => number_format((float) $sale['credit_note_amount'], 2, ',', ' '),
            'amount_paid' => number_format((float) ($sale['amount_paid'] + $sale['credit_note_amount']), 2, ',', ' '),
            'amount_unpaid' => number_format((float) $sale['amount_unpaid'], 2, ',', ' '),
            'pdf_link' => generate_pdf_link($sale['invoice_ref'] ?? '', $sale['entity_id'] ?? ''),
            'entity_id' => $sale['entity_id'] ?? '',
            'invoice_type' => htmlspecialchars($sale['invoice_type'] ?? '')
        ];
    }, $sales_combined)),
    'commercial_ranking' => array_values(array_map(function($commercial) {
        return [
            'name' => htmlspecialchars($commercial['commercial_name'] ?? ''),
            'revenue' => number_format($commercial['revenue'], 0, ',', ' '),
                        'total_sales' => $commercial['invoice_count'], // Add total sales

            'avg_basket' => number_format($commercial['average_basket'], 0, ',', ' '),
            'magasin' => htmlspecialchars($commercial['magasin'] ?? '')
        ];
    }, $commercials_combined)),
    'best_selling_products' => array_map(function($product) use ($store_id) {
        $stock = $store_id === 'all' ? $product['total_stock'] : 
            $store_id == 1 ? $product['stock_casa'] :
            $store_id == 18 ? $product['stock_rabat'] :
            $store_id == 4 ? $product['stock_marrakech'] :
            $store_id == 3 ? $product['stock_tanger'] :
            $product['total_stock'];

        return [
            'label' => htmlspecialchars($product['product_label'] ?? ''),
            'product_ref' => $product['product_ref'],
            'qty_sold' => htmlspecialchars($product['qty_sold'] ?? ''),
            'total_ttc' => number_format((float) $product['total_ttc'], 0, ',', ' '),
            'stock' => $stock
        ];
    }, $result['best_selling_products']),
    'revenue_by_category' => array_map(function($category) {
        return [
            'category' => htmlspecialchars($category['category'] ?? ''),
            'total_revenue' => number_format($category['total_revenue'], 0, ',', ' '),
            'percentage' => number_format($category['percentage'], 2) . '%'
        ];
    }, $result['revenue_by_category']),
    'revenue_by_store' => array_map(function($store) {
        return [
            'store' => htmlspecialchars($store['store'] ?? ''),
            'revenue' => number_format($store['revenue'], 0, ',', ' '),
            'percentage' => number_format($store['percentage'], 2) . '%'
        ];
    }, $result['revenue_by_store']),
    'payments' => array_map(function($payment) {
        return [
            'payment_id' => htmlspecialchars($payment['payment_id'] ?? ''),
            'payment_date' => (new DateTime($payment['payment_date']))->format('d-m-Y'),
            'payment_ref' => htmlspecialchars($payment['payment_ref'] ?? ''),
            'invoice_ref' => htmlspecialchars($payment['invoice_ref'] ?? ''),
            'invoice_date' => (new DateTime($payment['invoice_date']))->format('d-m-Y'),
            'amount' => number_format($payment['amount'], 2, ',', ' '),
            'payment_method' => htmlspecialchars($payment['payment_method'] ?? '')
        ];
    }, $result['payments'])
];

// Log response for debugging
error_log('Response: ' . json_encode($response, JSON_PRETTY_PRINT));

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
