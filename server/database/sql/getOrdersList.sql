WITH order_details AS (
    SELECT
        orders.id,
        orders.status_ready,
        COUNT(*) FILTER (WHERE ordersnom.status_cal='К' AND NOT orders.status_ready AND ordersnom.kolvo > 0) AS count_status_cal,
        COUNT(*) FILTER (WHERE ordersnom.status_instr='И' AND NOT orders.status_ready AND ordersnom.kolvo > 0) AS count_status_instr,
        COUNT(*) FILTER (WHERE ordersnom.status_draft='Ч' AND NOT orders.status_ready AND ordersnom.kolvo > 0) AS count_status_draft,
        COUNT(*) FILTER (WHERE ordersnom.status_metall='М' AND NOT orders.status_ready AND ordersnom.kolvo > 0) AS count_status_metall,
        COUNT(*) FILTER (WHERE ordersnom.status_kp='КП' AND ordersnom.kolvo > 0 AND NOT orders.status_ready) AS count_status_kp,
        orders.date,
        clients.name,
        orders.locked,
        orders.count_pos,
        orders.order_manager,
        MAX(dbo.ordersnom.cal_buy_time) AS cal_buy_time,
        orders.goz,
        orders.date AS date1,
        orders.date AS date2
    FROM
        dbo.orders
            INNER JOIN dbo.clients ON orders.client_id = clients.id
            INNER JOIN dbo.ordersnom ON ordersnom.order_id = orders.id
            LEFT JOIN dbo.mats ON mats.id = ordersnom.zag_tech_material_id
            LEFT JOIN dbo.cal_info ON ordersnom.id = cal_info.ordersnom_id
            LEFT JOIN dbo.calibres ON cal_info.cal_id = calibres.id
    WHERE
        orders.deleted = false
    -- SEARCH_CONDITION
    -- DATE_CONDITION
    GROUP BY
        orders.id,
        orders.status_ready,
        orders.date,
        clients.name,
        orders.locked,
        orders.count_pos,
        orders.order_manager,
        orders.goz
),
     total_count AS (
         SELECT COUNT(DISTINCT id) AS total_count
         FROM order_details
     )
SELECT
    total_count.total_count,
    order_details.status_ready,
    CASE WHEN order_details.count_status_cal > 0 AND NOT order_details.status_ready THEN 'К'  END AS status_cal,
    CASE WHEN order_details.count_status_instr > 0 AND NOT order_details.status_ready THEN 'И'  END AS status_instr,
    CASE WHEN order_details.count_status_draft > 0 AND NOT order_details.status_ready THEN 'Ч'  END AS status_draft,
    CASE WHEN order_details.count_status_metall > 0 OR NOT dbo.st_set(order_details.id) THEN 'М'  END AS status_metall,
    CASE WHEN order_details.count_status_kp > 0 AND order_details.count_status_cal = 0 AND order_details.count_status_instr = 0 AND order_details.count_status_draft = 0 AND order_details.count_status_metall = 0 AND dbo.st_set(order_details.id) THEN 'КП'  END AS status_kp,
    order_details.id,
    order_details.date,
    order_details.name,
    order_details.locked,
    order_details.count_pos,
    order_details.order_manager,
    order_details.goz
FROM
    order_details, total_count
ORDER BY
    -- SORTING
    order_details.date1 DESC,
    order_details.date2 DESC
LIMIT :limit
    OFFSET :offset


