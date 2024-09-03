SELECT
    orders.status_ready,
    CASE WHEN COUNT(*) FILTER (WHERE ordersnom.status_cal='К' AND NOT orders.status_ready AND ordersnom.kolvo > 0) > 0 THEN 'К' ELSE ' ' END AS status_cal,
    CASE WHEN COUNT(*) FILTER (WHERE ordersnom.status_instr='И' AND NOT orders.status_ready AND ordersnom.kolvo > 0) > 0 THEN 'И' ELSE ' ' END AS status_instr,
    CASE WHEN COUNT(*) FILTER (WHERE ordersnom.status_draft='Ч' AND NOT orders.status_ready AND ordersnom.kolvo > 0) > 0 THEN 'Ч' ELSE ' ' END AS status_draft,
    CASE WHEN COUNT(*) FILTER (WHERE ordersnom.status_metall='М' AND NOT orders.status_ready AND ordersnom.kolvo > 0) > 0 OR NOT dbo.st_set(orders.id) THEN 'М' ELSE ' ' END AS status_metall,
    CASE WHEN COUNT(*) FILTER (WHERE ordersnom.status_kp='КП' AND ordersnom.kolvo > 0 AND NOT orders.status_ready) > 0 AND
              COUNT(*) FILTER (WHERE
                  ordersnom.kolvo > 0 AND
                  (ordersnom.status_cal='К' OR
                   ordersnom.status_instr='И' OR
                   ordersnom.status_draft='Ч' OR
                   ordersnom.status_metall='М')
                  ) = 0 AND dbo.st_set(orders.id) THEN 'КП' ELSE ' ' END AS status_kp,
    orders.id,
    orders.date,
    clients.name,
    orders.nds,
    orders.comments,
    orders.tech_fio,
    clients.contact,
    orders.client_id,
    SUM(ordersnom.metall_price_total) as metall_price_total,
    orders.logistics_price,
    MAX(ordersnom.metall_buy_time) as metall_buy_time,
    orders.locked,
    orders.logistics_price_per_detail,
    clients.phone,
    clients.email,
    orders.is_complete,
    orders.count_pos,
    orders.omts_comments,
    orders.order_manager,
    orders.goz
FROM
    dbo.orders
        JOIN dbo.clients ON orders.client_id = clients.id
        JOIN dbo.ordersnom ON ordersnom.order_id = orders.id
WHERE
    orders.deleted = false
-- SEARCH_CONDITION
GROUP BY
    orders.status_ready,
    orders.id,
    orders.date,
    clients.name,
    orders.nds,
    orders.comments,
    orders.tech_fio,
    clients.contact,
    orders.client_id,
    orders.logistics_price,
    orders.locked,
    orders.logistics_price_per_detail,
    clients.phone,
    clients.email,
    orders.is_complete,
    orders.count_pos,
    orders.omts_comments,
    orders.order_manager,
    orders.goz
ORDER BY
    orders.id DESC
LIMIT :limit
    OFFSET :offset
