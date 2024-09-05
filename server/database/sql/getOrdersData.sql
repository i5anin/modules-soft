SELECT dbo.orders.status_ready,
       CASE
           WHEN COUNT(*) FILTER (WHERE ordersnom.status_cal = 'К' AND ordersnom.kolvo > 0 AND NOT status_ready) > 0
               THEN 'К'
           END                         AS status_cal,
       CASE
           WHEN COUNT(*) FILTER (WHERE ordersnom.status_instr = 'И' AND ordersnom.kolvo > 0) > 0
               THEN 'И'
           END                         AS status_instr,
       CASE
           WHEN COUNT(*) FILTER (WHERE ordersnom.status_draft = 'Ч' AND ordersnom.kolvo > 0) > 0
               THEN 'Ч'
           END                         AS status_draft,
       CASE
           WHEN COUNT(*) FILTER (WHERE ordersnom.status_metall = 'М' AND ordersnom.kolvo > 0) > 0 OR
                NOT dbo.st_set(orders.id)
               THEN 'М'
           END                         AS status_metall,
       CASE
           WHEN COUNT(*) FILTER (WHERE ordersnom.status_kp = 'КП' AND ordersnom.kolvo > 0 AND NOT status_ready) > 0
               AND COUNT(*) FILTER (
                   WHERE ordersnom.kolvo > 0
                       AND (
                             ordersnom.status_cal = 'К'
                                 OR ordersnom.status_instr = 'И'
                                 OR ordersnom.status_draft = 'Ч'
                                 OR ordersnom.status_metall = 'М'
                             )
                   ) = 0
               AND dbo.st_set(orders.id)
               THEN 'КП'
           END                         AS status_kp,
       dbo.orders.id,
       dbo.orders.date,
       dbo.clients.name,
       dbo.orders.client_id,
       MAX(dbo.ordersnom.cal_buy_time) AS cal_buy_time,
       orders.order_manager,
       dbo.orders.locked,
       dbo.orders.is_complete,
       dbo.orders.count_pos,
       dbo.orders.comments,
       orders.goz
FROM dbo.clients
         INNER JOIN dbo.orders
                    ON dbo.orders.client_id = dbo.clients.id
         INNER JOIN dbo.ordersnom
                    ON dbo.ordersnom.order_id = dbo.orders.id
         INNER JOIN dbo.cal_info
                    ON dbo.ordersnom.id = dbo.cal_info.ordersnom_id
WHERE dbo.orders.deleted = FALSE
--   AND date BETWEEN @date_from AND @date_to
-- SEARCH_CONDITION
GROUP BY orders.order_manager,
         dbo.orders.status_ready,
         dbo.orders.status_cal,
         dbo.orders.status_instr,
         dbo.orders.status_draft,
         dbo.orders.status_metall,
         dbo.orders.status_kp,
         dbo.orders.id,
         dbo.orders.date,
         dbo.clients.name,
         dbo.orders.client_id,
         dbo.orders.locked,
         dbo.orders.is_complete,
         dbo.orders.count_pos,
         dbo.orders.comments,
         orders.goz
ORDER BY dbo.orders.id DESC
LIMIT :limit OFFSET :offset;
