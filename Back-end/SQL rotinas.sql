

select * from produtos;
select * from image;
select * from categoria;
select * from modelo;
select * from veiculos;
select * from marca;


	ALTER TABLE image
    ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;

	ALTER TABLE image 
    ALTER COLUMN id_produto TYPE integer;id

	alter table produtos add  titulo TEXT

	alter table produtos drop column  id_image 

update produtos set destaque = false where id= 4


ALTER TABLE produtos
ALTER COLUMN id_veiculo TYPE INTEGER
USING (CASE WHEN id_veiculo = TRUE THEN 1 ELSE 0 END);

select * from categoria


-- Retorno dos produtos em destaques: Part.1
SELECT 
P.id, P.descricao, P.ano, P.codigo, P.anuncio_ml, P.valor_original, P.titulo, 
M.marca, Md.modelo, C.nome_categoria, C.descricao as categoria_descricao, V.veiculo 
COUNT(*) OVER() AS total_count
FROM produtos P 
INNER JOIN marca M ON P.id_marca = M.id 
INNER JOIN modelo Md ON P.id_modelo = Md.id  
INNER JOIN categoria C ON P.id_categoria = C.id  
INNER JOIN veiculos V ON P.id_veiculo = V.id
where P.destaque = true


-- Retorno dos produtos em destaques: Part.2 (Trazendo as imagens)

select caminho_image from image 
where id_produto = 3
-- $1

SELECT 
                P.id, P.descricao, P.ano, P.codigo, P.anuncio_ml, P.valor_original, P.titulo, 
                M.marca, Md.modelo, C.nome_categoria, C.descricao as categoria_descricao, V.veiculo 
               
            FROM produtos P 
            INNER JOIN marca M ON P.id_marca = M.id 
            INNER JOIN modelo Md ON P.id_modelo = Md.id  
            INNER JOIN categoria C ON P.id_categoria = C.id  
            INNER JOIN veiculos V ON P.id_veiculo = V.id


SELECT * FROM produtos WHERE id_categoria = (SELECT id_categoria FROM produtos 
WHERE id = 4) AND id != 4 AND (delete_logic IS NULL OR delete_logic = false) ORDER BY RANDOM() LIMIT 8



