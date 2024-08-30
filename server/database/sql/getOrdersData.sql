SELECT
    orders.status_ready,
    CASE
        WHEN COUNT(*) FILTER (WHERE ordersnom.status_cal = 'К' AND ordersnom.kolvo > 0 AND NOT orders.status_ready) > 0 THEN 'К'
        ELSE ' '
        END AS status_cal,
    CASE
        WHEN COUNT(*) FILTER (WHERE ordersnom.status_instr = 'И' AND ordersnom.kolvo > 0) > 0 THEN 'И'
        ELSE ' '
        END AS status_instr,
    CASE
        WHEN COUNT(*) FILTER (WHERE ordersnom.status_draft = 'Ч' AND ordersnom.kolvo > 0) > 0 THEN 'Ч'
        ELSE ' '
        END AS status_draft,
    CASE
        WHEN COUNT(*) FILTER (WHERE ordersnom.status_metall = 'М' AND ordersnom.kolvo > 0) > 0 OR NOT dbo.st_set(orders.id) THEN 'М'
        ELSE ' '
        END AS status_metall,
    CASE
        WHEN COUNT(*) FILTER (WHERE ordersnom.status_kp = 'КП' AND ordersnom.kolvo > 0 AND NOT orders.status_ready) > 0
            AND COUNT(*) FILTER (WHERE ordersnom.kolvo > 0 AND (ordersnom.status_cal = 'К' OR ordersnom.status_instr = 'И' OR ordersnom.status_draft = 'Ч' OR ordersnom.status_metall = 'М')) = 0
            AND dbo.st_set(orders.id) THEN 'КП'
        ELSE ' '
        END AS status_kp,
    orders.id,
    orders.date,
    clients.name,
    orders.client_id,
    MAX(ordersnom.cal_buy_time) AS cal_buy_time,
    orders.order_manager,
    orders.locked,
    orders.is_complete,
    orders.count_pos,
    orders.comments,
    orders.goz
FROM dbo.clients AS clients
         JOIN dbo.orders AS orders ON orders.client_id = clients.id
         JOIN dbo.ordersnom AS ordersnom ON ordersnom.order_id = orders.id
         JOIN dbo.cal_info AS cal_info ON ordersnom.id = cal_info.ordersnom_id
WHERE 1 = 1
/* Dynamic WHERE clause will be added here */
GROUP BY
    orders.order_manager, orders.status_ready, orders.id, orders.date, clients.name,
    orders.client_id, orders.locked, orders.is_complete, orders.count_pos, orders.comments, orders.goz
ORDER BY orders.status_cal DESC, orders.id DESC
/* LIMIT and OFFSET will be added here for pagination */
