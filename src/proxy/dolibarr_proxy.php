<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$DOLIBARR_API = [
    'url' => 'https://erp.sketch-design.ma/api/index.php',
    'key' => '44cef33c96e192664e96c22a677c7e044c054461'
];

$invoice_ref = $_GET['invoice_ref'] ?? '';
$entity_id = $_GET['entity_id'] ?? '';

if (!$invoice_ref || !$entity_id) {
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

try {
    // First get invoice ID
    $ch = curl_init($DOLIBARR_API['url'] . "/invoices?sqlfilters=(ref:=:'$invoice_ref')");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'DOLAPIKEY: ' . $DOLIBARR_API['key'],
        'Entity: ' . $entity_id
    ]);

    $response = curl_exec($ch);
    $invoices = json_decode($response, true);

    if (!$invoices || empty($invoices)) {
        echo json_encode(['error' => 'Invoice not found']);
        exit;
    }

    // Get PDF content
    $invoice_id = $invoices[0]['id'];
    $ch = curl_init($DOLIBARR_API['url'] . "/invoices/$invoice_id/document");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'DOLAPIKEY: ' . $DOLIBARR_API['key'],
        'Entity: ' . $entity_id
    ]);

    $pdf_content = curl_exec($ch);
    
    header('Content-Type: application/pdf');
    echo $pdf_content;

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?> 