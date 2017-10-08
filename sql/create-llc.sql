BEGIN;
DROP TABLE IF EXISTS corp_owners;
SELECT "owner-address", COUNT(*) as "distinct-company-count" INTO TEMPORARY owner_count FROM (SELECT DISTINCT "owner-name", "owner-address" FROM  (SELECT "owner-name", "owner-address" FROM "sf-ownership" WHERE "owner-name" ~ '(\w+) (LLC|LP)') d WHERE "owner-address" = d."owner-address") t GROUP BY  "owner-address" ORDER BY COUNT(*) DESC;
CREATE TABLE corp_owners  as
SELECT owner_count."owner-address", "distinct-company-count", d."total-units"
FROM owner_count
  JOIN (SELECT COUNT(*) as "total-units", "owner-address" FROM "sf-ownership" WHERE "owner-name" ~ '(\w+) (LLC|LP)' GROUP BY "owner-address" ORDER BY COUNT(*) DESC) d on owner_count."owner-address" = d."owner-address";
COMMIT;
