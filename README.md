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


---

# Resolució de l'exercici

Bones, equip! He aprofitat el README per redactar l'apartat de justificació de com he resolt el problema i quines decisions he pres, i el perquè. Primer l'exercici en si (lectura de factures, formateig, errors, CRUD, interacció, disseny i tests); després, per separat, les coses que no es demanaven explícitament però que s'han tingut en compte; i al final, el context. Ha estat complicat aturar l'abast del projecte: com ja treballo amb un projecte molt semblant en producció i funcionament des de fa anys, no he pogut evitar tenir en compte i afegir molts elements que no entraven explícitament dins l'exercici, però que volia constatar que tinc presents. Estic segur que ja els implementeu, però com que a l'exercici no hi havia bases ni referències, els he anat creant des de zero i bastant indiscriminadament. En el context del projecte real seria més aviat adaptació i utilització dels recursos existents.

## 1. L'exercici

### Com funciona
La pàgina **Factures** (`/invoices`) té una capçalera amb el títol i el botó **Importar**, i sota una targeta amb la llista de factures. "Importar" obre un únic diàleg on es poden arrossegar o triar diversos fitxers JSON. Els fitxers apareixen com a pendents (amb una creu per treure'ls) i, en prémer **Pujar**, es processen un per un, amb feedback per a cada fitxer. A sota, dins el mateix diàleg, apareix la taula de resultats (fitxer / estat / comentaris). A la llista, l'ull obre el detall de la factura en un panell lateral i la paperera l'elimina, amb confirmació prèvia.

### Lectura i extracció de dades
- El frontend llegeix cada JSON, **detecta automàticament el format** (A o B) i el converteix a una única `Invoice` comuna.
- Cada format és un fitxer propi (`features/invoices/helpers/formats/`) amb dues coses: com reconèixer-lo (`detect`, mira les claus pròpies del format, sense cadenes de `typeof`) i com extreure'n les dades (`toDraft`). Les regles de validació són comunes. Els formats es llisten en un registre (`index.ts`).
- **Afegir un format nou** és afegir un fitxer i una línia al registre; la resta del codi no canvia (l'enunciat demana pensar en nous formats).
- Tot és tipat: el JSON és entrada no fiable i es llegeix amb helpers (`json.ts`) que mai llancen excepcions.

### Formateig i càlculs
- Si falta l'impost, es calcula com el **21 %** de la base. Si falta el total, es calcula com base + impost.
- Imports i dates es mostren segons l'idioma actiu.

### Errors bloquejants i informatius
| Cas | Tipus | Resultat |
|-----|-------|----------|
| JSON mal format | bloquejant | no es crea |
| Format no reconegut | bloquejant | no es crea |
| Base imposable absent o no numèrica | bloquejant | no es crea |
| Impost o total absents | informatiu | es calculen i s'avisa |
| Client sense adreça | informatiu | es crea amb avís |
| Número de factura buit | **bloquejant (a propòsit)** | no es crea |
| Número de factura que ja existeix | — | s'**actualitza** la factura existent (no es duplica) |
| Període invertit (inici posterior al final) | informatiu | es crea amb avís |
| Total que no quadra amb base + impost | informatiu | es crea amb avís |
| NIF/CIF amb format invàlid | informatiu | es crea amb avís |

- Els **bloquejants** no deixen crear la factura (aquell fitxer queda marcat en vermell i no avança). Els **informatius** deixen crear-la i només avisen. Tots apareixen a la taula de resultats, com una llista de comentaris per fitxer.
- **Una sola llista de regles per a tots els formats.** Cada format només sap reconèixer-se i convertir-se a la factura comuna. Un camp que un format no té mai (per exemple, l'adreça al format B) queda com a «no aplica» i no genera cap avís, perquè no el tindrà mai.
- Amb els 6 fitxers d'exemple (que no s'han modificat): A1, A3, B1 i B2 es creen sense avisos; A2 es crea amb dos avisos (període invertit i NIF/CIF `B123` invàlid); **B3 no es crea** (número buit, bloquejant) i s'informa també del total 1600 que no quadra amb base + impost 1512,50.
- **El número identifica la factura.** Si s'importa una factura amb un número que ja existeix, no es crea una de nova: s'actualitza l'existent, i els resultats (estat "Actualitzada" i un comentari) ho deixen clar.
- **Un error bloquejant fet a propòsit.** Segons l'enunciat, cap dels 6 fitxers d'exemple està mal format ni li falta la base imposable, així que els 6 s'haurien de crear (A2 i B3 amb avisos). Perquè es pugui veure com es comporta un error bloquejant amb dades reals, he fet bloquejant el número de factura buit, encara que això vagi més enllà del que diu l'enunciat; per això `factura_B3.json` no es crea.

### Interacció de l'usuari
- Zona per arrossegar fitxers o botó per triar-los; es poden pujar diversos alhora.
- Cada fitxer mostra el seu estat (pendent, pujant, creada, creada amb avisos, no creada) i, en acabar, els seus comentaris a la taula de resultats. La importació **no mostra toasts**: el resultat ja és a la taula i no es vol duplicar. Qualsevol acció pot desactivar els toasts (èxit i error) amb una sola propietat (`toasts: false`).
- El feedback important (els resultats de la pujada, la confirmació d'eliminar) va en un **diàleg** que bloqueja la pantalla i s'ha de tancar amb un botó; el resultat de la pujada és dins el mateix diàleg d'importació, no en un segon diàleg a sobre.
- En acabar una pujada, les factures creades surten de la llista de pendents (ja són a la taula de resultats) i els fitxers bloquejats hi queden en vermell, perquè l'usuari els pugui revisar o treure.

### CRUD
- **Crear**: importar fitxers. **Consultar**: la llista i el detall en un panell lateral (títol i descripció, no una taula). **Eliminar**: paperera amb confirmació.
- Cada acció informa amb un toast: d'error sempre; d'èxit per defecte en crear i eliminar, i en lectures només si es demana. L'excepció és la importació, que ja informa a la taula de resultats.
- **Persistència en memòria, al frontend i no al backend.** L'enunciat permet que la persistència sigui en memòria del backend. El backend d'aquest projecte no té cap endpoint de factures (`/api/invoices` respon 404) i no l'he tocat; per això la memòria la fa el frontend. **És un mock: una API simulada que en realitat no existeix.** El servei fa crides HTTP a `/api/invoices` com ho faria amb un backend real, i un interceptor (`core/crud/crud-mock.interceptor.ts`, registrat per a factures a `features/invoices/services/invoices.mock.ts`) les intercepta i respon en memòria (crear, llistar, actualitzar, eliminar). El contracte d'aquests endpoints (rutes, mètodes i forma de les dades) també és inventat. Les dades es perden en recarregar la pàgina. Amb un endpoint real esborraria el mock i registraríem el backend real.

### Disseny unificat amb targetes (Cards)
- El títol de cada pàgina i les seves accions van **fora** de les targetes, en una capçalera de pàgina (títol a l'esquerra, accions a la dreta). Tot el que hi ha sota va en una **Card** genèrica.
- La Card té capçalera opcional (títol + accions), cos lliure i peu opcional (accions). Regla: la capçalera conté les accions que **inicien** alguna cosa sobre el contingut de la targeta; el peu conté les que **confirmen o resolen** (acceptar, cancel·lar, pujar).
- Així l'usuari sap sempre on mirar, la UX es comporta igual a tota l'aplicació i el codi de maquetació no es repeteix.
- Components reutilitzables amb props i classes CSS apilables (`btn btn-primary btn-outline`, `card card-rounded card-square`...), en comptes d'herència de classes. El botó és un de sol i es configura només amb props (confirmació sí/no, toasts sí/no, missatges); un únic operador (`withToasts`) aplica la regla dels toasts i un únic servei (`ConfirmService`) obre les confirmacions.
- **Cap codi repetit**: cada comportament viu en un sol lloc, de manera que canviar un botó o una funció una vegada ho canvia a tota l'aplicació.

### Tests
He fet servir el testing que m'ha proposat la IA amb tot el context que li he donat. He posat poc testing, i no per cada component o acció d'UX, perquè és un exercici i no un projecte complet; però sóc conscient que en el projecte real tota acció ha d'estar coberta per tests. En aquest cas he valorat:
- **Lògica**: lectura i detecció automàtica del format (A i B), els 6 fitxers d'exemple (errors bloquejants i informatius), el càlcul del 21 % quan falta l'impost, afegir un format nou sense tocar res més, el servei i el store (backend simulat en memòria: crear, llistar, actualitzar, eliminar), la regla dels toasts, el formateig, les traduccions amb gènere i la capa genèrica d'importació, el mock i les confirmacions.
- **Components**: només dos, com a mostra: el **botó** (variants, confirmació, càrrega, toasts) i el **drawer** (obrir i tancar, accions de capçalera, animació). Tots els components haurien de tenir els seus tests.
- El recorregut complet (importar, llistar, detall, eliminar, menú, configuració) s'ha comprovat a mà al navegador, també servit per Spring Boot.

## 2. No demanat explícitament, però tingut en compte
Coses que l'enunciat no demana i que vosaltres probablement ja teniu resoltes al vostre projecte, però que jo sol tenir sempre presents. Les he pensat i deixat plantejades **sense desenvolupar-les en excés**; per a cada una s'indica fins on s'ha arribat.

- **Anglès com a idioma base.** Codi, noms, comentaris, fitxers, carpetes, tests, commits i documentació en anglès; només les traduccions de la interfície (català i castellà) i aquest apartat són en català.
- **Tipatge a tot arreu**, no només a les factures: components, esdeveniments, configuracions i funcions, sense `any`, perquè l'IDE ajudi a detectar què està malament.
- **ESLint i Prettier** per tenir una manera única de programar i d'estilitzar el codi (`npm run lint`, `format` i `format:check`). També serveixen perquè la IA que ajuda a escriure el codi tingui unes regles d'estil explícites i comprovables, i no en depengui del criteri.
- **Internacionalització** (català i castellà, escalable): cap text escrit a mà a les vistes ni als components (ni tan sols el títol de la pàgina): tot surt de les traduccions. Idioma desat, si no el del navegador, si no català; es canvia des de la configuració. Servei propi en lloc d'una llibreria; afegir un idioma és un JSON i una línia. Les paraules i accions compartides (capçaleres de taula, «Veure»/«Eliminar», resultats i estats) es defineixen una sola vegada i reben el nom de l'entitat i el seu gènere («Factura eliminada», «Client eliminat»). No s'ha fet: plurals.
- **Imatge gràfica:** no l'he desenvolupat (logo, paleta de marca, tipografia, composició...). El que he volgut marcar és la utilització de components reaprofitables, un estil de disseny amb variables definides en un sol lloc i classes que utilitzen la variable i no estils *hardcoded*... Tot el més DRY i escalable possible.
- **Estils i tema:** tipografia (mides, pesos, interlineat), opacitats (completa, desactivat, amagat i la gradació dels colors), radis de vora, capes (z-index), moviment (durades, acceleració), espaiats, vores i mides com a variables de disseny, i una base per als elements (`h1`–`h6`, `p`, `small`, `strong`...) que els components només sobreescriuen quan volen alguna cosa concreta; classes CSS apilables pròpies (estil Tailwind; en altres projectes a vegades he fet servir la llibreria), classes de color de text generades d'una sola llista, colors per severitat amb variants d'opacitat i tema dia/nit (el del sistema, recordat). L'idioma i el tema es canvien des d'un panell de configuració (botó al menú). En pantalles petites el menú passa a ser un drawer per l'esquerra que s'obre i es tanca amb una hamburguesa, i la configuració substitueix el seu contingut; l'acció de tornar és una icona a la capçalera del drawer, al costat de la creu de tancar, perquè la capçalera del drawer i del diàleg es comporta com la de la Card (títol opcional i accions només amb icona); tots dos tenen sempre la creu de tancar i admeten més accions. Els botons que només són una icona són quadrats i totalment rodons, amb una sola regla d'estil.
- **Usuaris, rols i gestió:** no sé com s'autentica. Assumeixo, pel que em vau explicar, que hi ha rols (per exemple, administrador i client) que condicionarien què es pot pujar, consultar o eliminar. No s'ha implementat; no hi ha cap sistema d'autenticació (guards, token...).
- **Stores:** store propi sobre RxJS perquè l'aplicació és senzilla; en una de complexa es valoraria NgRx. (Jo utilitzo Pinia amb Vue.)
- **Versió i entorn:** Angular 14 amb NgModules; Node 18.17, perquè el CLI no suporta oficialment versions més noves.
- **Claude Code al projecte (carpeta `.claude/`).** Em vau explicar que no treballeu amb Claude (o algun altre assistent d'IA) integrat al projecte. He proposat un sistema senzill de funcionament: unes normes (`hard-rules.md`), un registre de decisions amb el seu perquè (`decisions.md`), unes stories (`stories.md`) i un workflow (`workflow.md`), tot carregat amb un `CLAUDE.md`. L'objectiu és assegurar unes maneres de funcionar, un flux de treball i unes directrius que facilitin la feina amb Claude. És volgudament una estructura simple: es podria modificar i millorar amb *gates* (comprovacions que bloquegin si no es compleixen les normes), més testing, i bloquejos al CI/CD, al desplegament i als pull requests, entre altres; aquí només es vol mostrar l'estructura bàsica. Una regla del sistema és que el codi no porta comentaris: tot el que s'explica (decisions, motius) viu a `.claude/`. Una evolució natural seria que `.claude/` adoptés una **estructura d'arbre**: unes normes i decisions *generals* (estils i tot el projecte) i, a més, arxius propis per a cada entitat (per exemple `invoices`) i per a cada component (botó, drawer...), amb les seves normes, decisions i què hi pot fer i què no la IA. Sempre que es toqui una entitat o un component, la IA hauria de mirar primer els seus arxius concrets, a més dels generals, per saber com treballar-hi; així el context és petit i precís, i no un únic fitxer enorme. Aquí només hi ha el nivell general, perquè és un exercici.
- **Icones:** són SVG en línia copiats al codi (una entrada per icona, sense llibreria), suficient per a les poques icones que fa servir l'aplicació. Es podria fer servir Font Awesome o una altra llibreria d'icones per coherència i estilització; s'ha tingut en compte i no s'ha desenvolupat.
- **Fora d'abast:** ordenar, filtrar i paginar la taula, el backend real i l'autenticació.

## 3. Context i procés
- **Experiència i ús d'IA.** No tinc experiència prèvia en Angular. Tot el que té a veure amb el llenguatge i el framework (sintaxi, API, patrons propis d'Angular) ho he deixat en bona part a discreció de la IA. Jo he aportat l'estructura de carpetes, la metodologia (decisions una a una, stories, tests, una branca i un PR), les regles d'UX (Card, capçalera i peu, toasts, tema, internacionalització) i com s'ha de treballar de manera formal i lògica; no ho he desenvolupat jo mateix per falta de coneixement d'Angular. Un cop dins del projecte m'interessa aprendre'n, veure com està plantejat, buscar millors pràctiques i, en un futur proper, prendre jo les decisions d'acord amb aquestes pràctiques i amb la resta del projecte. Aquest exercici m'ha servit també per començar a habituar-me a l'ecosistema d'Angular i per tornar a treballar extensament amb classes, que feia temps que no tocava.
- **Metodologia.** Les decisions s'han pres una a una i queden escrites, amb el seu perquè, a `.claude/decisions.md`; les normes, les stories i el workflow són al mateix directori.

## Com executar-ho

### Què cal tenir instal·lat
| Per a... | Cal |
|----------|-----|
| Tot | Git i connexió a internet (la primera vegada es baixen dependències) |
| Servidor de desenvolupament i tests (`npm ...`) | **Node 18.17** (amb npm 9). Si fas servir `nvm`: `nvm install 18.17.0 && nvm use 18.17.0`. Angular 14 no funciona amb versions de Node molt més noves (per exemple, la 24) |
| Tests | Google Chrome (els tests s'executen amb Karma) |
| Spring Boot (`./mvnw ...`) | **JDK 17 o superior** (`java -version`). No cal instal·lar Maven (el porta `mvnw`) ni Node: Maven baixa el seu propi Node 14.21.3 i npm 6.14.18 i els deixa dins del projecte |

### Passos
```bash
git clone <url-del-repositori> energy-tools
cd energy-tools
git checkout feat/invoices-upload     # la branca amb l'exercici
```

**Opció A · Servidor de desenvolupament** (només Node 18; el backend es simula en memòria):
```bash
nvm use 18.17.0       # o tenir Node 18 actiu
npm ci                # instal·la les dependències exactes del package-lock
npm start             # http://localhost:4200 (recarrega en canviar el codi)
```

**Opció B · Amb Spring Boot** (JDK 17+; serveix l'aplicació compilada):
```bash
./mvnw spring-boot:run   # a Windows: mvnw.cmd spring-boot:run
# http://localhost:8080  (la primera vegada triga uns minuts: baixa Node 14, instal·la i compila el frontend)
```
Un cop servida per Spring Boot, les rutes porten `#`: `http://localhost:8080/#/invoices`. Aquest mode també es pot fer en dos passos: `npm run build` (genera el frontend a `src/main/resources/static`) i `./mvnw spring-boot:run`.

### Altres comandes (Node 18)
```bash
npm test -- --watch=false --browsers=ChromeHeadless   # tests una sola vegada, sense obrir Chrome (npm test els deixa en mode "watch")
npm run lint          # lint
npm run format:check  # comprova el format (npm run format el corregeix)
npm run build         # compila el frontend a src/main/resources/static
```

### Coses a tenir en compte
- El backend no té endpoints de factures, així que és el frontend qui simula l'API i la persistència en memòria (mock). Les dades es perden en recarregar la pàgina.
- `./mvnw spring-boot:run` i `npm run build` reescriuen `src/main/resources/static` (que és al repositori): no s'ha de commitejar.
- Després d'executar `./mvnw`, si vols tornar a treballar amb `npm`, torna a fer `npm ci` (Maven hi instal·la les dependències amb el seu npm 6).
- Si el port 4200 o el 8080 està ocupat, canvia'l: `npm start -- --port 4300` o `./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081`.
