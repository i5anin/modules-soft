SELECT DISTINCT
    orders.id AS order_id,
    orders.date AS order_date,
    orders.order_manager,
    clients.name AS client_name,
    clients.contact,
    dbo.orders.tech_fio,
    MAX(dbo.ordersnom.metall_buy_time) AS metall_buy_time,
    orders.comments,
    orders.omts_comments,
    orders.st_price,
    ordersnom.status_cal,
    ordersnom.status_instr,
    ordersnom.status_draft,
    ordersnom.status_metall,
    ordersnom.status_kp,
    ordersnom.id,
    ordersnom.name,
    description,
    ordersnom.kolvo AS kolvo,
    ordersnom.kolvo_add AS kolvo_add,
    dbo.mats.name AS mats_name,
    dbo.mats.profile,
    ordersnom.zag_tech_kolvo_det,
    dbo.ordersnom.cal_buy_time AS cal_buy_time,
    MAX(dbo.ordersnom.cal_buy_time) AS max_cal_buy_time,
    COALESCE(ROUND(ordersnom.zag_buy_weight::NUMERIC / NULLIF(ordersnom.zag_buy_kolvo_det, 0)::NUMERIC, 3), 0) AS weight1_buy,
    zag_tech_weight,
    dbo.to_info(ordersnom.id),
    metall_buy_time,
    mats_from,
    imp,
    metall_price_total_det,
    CASE
        WHEN ordersnom.p_price_det = 0 THEN dbo.p_price_det_orders(ordersnom.id)
        ELSE ordersnom.p_price_det
        END AS p_price_det,
    pokr_maker,
    metall_price_total,
    ordersnom.comments,
    zag_comments,
    array_to_string(dbo.get_strat_nom(ordersnom.id, TRUE), ',') AS strat_info,
    (
        SELECT
            SUM(COALESCE(cal_info.cal_price, 0))
        FROM
            dbo.cal_info
                INNER JOIN
            dbo.ordersnom ON ordersnom.id = cal_info.ordersnom_id
        WHERE
            ordersnom.order_id = orders.id
          AND cal_info.in_use
    ) AS total_cal_price
FROM
    dbo.ordersnom
        INNER JOIN
    dbo.orders ON ordersnom.order_id = orders.id
        INNER JOIN
    dbo.clients ON clients.id = dbo.orders.client_id
        LEFT JOIN
    dbo.mats ON dbo.ordersnom.zag_tech_material_id = dbo.mats.id
WHERE
    dbo.ordersnom.order_id = :order_id
  AND is_sbor = FALSE
GROUP BY
    dbo.orders.status_ready,
    dbo.orders.status_cal,
    dbo.orders.status_instr,
    dbo.orders.status_draft,
    dbo.orders.status_metall,
    dbo.orders.status_kp,
    dbo.orders.id,
    dbo.orders.date,
    dbo.clients.name,
    dbo.clients.contact,
    dbo.orders.client_id,
    dbo.clients.phone,
    dbo.clients.email,
    dbo.orders.locked,
    is_complete,
    count_pos,
    omts_comments,
    dbo.ordersnom.id,
    dbo.mats.name,
    dbo.mats.profile
ORDER BY
    dbo.ordersnom.id ASC;
