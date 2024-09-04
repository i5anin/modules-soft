-- database/sql/getOrdersDataCount.sql
SELECT COUNT(DISTINCT orders.id) AS total_count
FROM dbo.orders
         INNER JOIN dbo.ordersnom ON dbo.ordersnom.order_id = dbo.orders.id
         INNER JOIN dbo.cal_info ON dbo.ordersnom.id = dbo.cal_info.ordersnom_id
-- SEARCH_CONDITION
WHERE dbo.orders.deleted =FALSE;
