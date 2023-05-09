SELECT AVG(TO_DATE(end_date,'YYYY-MM-DD') - TO_DATE(start_date,'YYYY-MM-DD')) as average_duration
FROM reservations;