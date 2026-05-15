# Descripció de l'activitat

L'usuari de la nostra webapp necessita una pantalla on poder pujar unes factures en format json de les quals n'extreurem dades.

Aquestes factures ens poden arribar en dos formats diferents, tot i que sempre contindran més o menys les mateixes dades.

S'ha de crear la pantalla de la nostra webapp per carregar aquests fitxers, i poder consultar o eliminar les factures craedes. També caldrà gestionar possibles errors, tenint en compte si són bloquejants (per exemple, un json mal formatat o una factura no té base imposable) o només informatius (un client no té adreça)

# Apunts del desenvolupament
- El més important de la tasca, és com es planteja la interacció de l'usuari, el disseny i la maquetació.
- La "persistència de dades" pot ser en memòria del backend, no cal implementar una connexió amb base de dades.
- Plantejar l'aplicació pensant que en un futur apareixeran nous formats de factura.
- La selecció del format de factura que s'està important pot ser manual o automàtica.
- Si no tenim impostos, els podem calcular com el 21% de la base imposable.
- Per compilar el frontend es pot fer amb `npm run build` des de l'arrel del projecte.
- Per executar l'aplicació, es pot fer `./mvnw spring-boot:run` des de l'arrel del projecte.

## Format de les factures

### Factura A
```
{
  range: {
    from: DATE,
    to: DATE,
  },
  date: DATE,
  number: STRING,
  client: {
    name: STRING,
    vat_number: STRING,
    address: STRING
  },
  base: NUMBER,
  tax: NUMBER
}
```

### Factura B
```
{
  from_date: DATE,
  to_date: DATE,
  bill_date: DATE,
  bill_number: STRING,
  client: STRING,
  vat_number: STRING,
  base: NUMBER,
  tax: NUMBER,
  total: NUMBER
}
```

