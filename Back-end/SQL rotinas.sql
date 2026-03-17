
-- select * from produtos
select * from produtos
select * from produtos


-- ALTER TABLE produtos
--     ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;

	ALTER TABLE produtos 
    ALTER COLUMN id_image TYPE TEXT;

	alter table produtos add  destaque bool

update produtos set destaque = true where id = 2