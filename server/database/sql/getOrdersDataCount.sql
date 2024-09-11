-- database/sql/getOrdersDataCount.sql
SELECT COUNT(DISTINCT orders.id) AS total_count
FROM dbo.orders
         INNER JOIN dbo.ordersnom ON dbo.ordersnom.order_id = dbo.orders.id
         INNER JOIN dbo.clients ON orders.client_id = clients.id
         LEFT JOIN dbo.mats ON mats.id = ordersnom.zag_tech_material_id -- Добавляем LEFT JOIN для mats
         LEFT JOIN dbo.cal_info ON ordersnom.id = cal_info.ordersnom_id -- Добавляем LEFT JOIN для cal_info
         LEFT JOIN dbo.calibres ON cal_info.cal_id = calibres.id -- Добавляем LEFT JOIN для calibres
WHERE dbo.orders.deleted = FALSE
-- SEARCH_CONDITION
;
