# Techgear Inläminguppgift

## Jag har använt mig av Node.js, Express.js och Node-paketet Better-SQLite3 för att skapa en databas och en koppling mellan databasen och javascript för att bilda en api.

### Alla funktioner inom G-nivå funkar.
### GET /products 
○ Lista alla produkter 
○ Använd JOIN för att inkludera kategori- och tillverkarinfo för varje produkt 
### GET /products/:id 
○ Visa all information om en specifik produkt 
### GET /products/search?name={searchterm} 
○ Sök och lista produkter vars namn innehåller söktermen 
### GET /products/category/:categoryId 
○ Lista alla produkter i en specifik kategori 
### POST /products 
○ Skapa en ny produkt 
○ All nödvändig produktinfo skickas i request body 
### PUT /products/:id 
○ Uppdatera en existerande produkt 
○ Ny produktinfo skickas i request body 
### DELETE /products/:id 
○ Ta bort en produkt 
○ Ska även ta bort alla produktens recensioner (CASCADE DELETE) 
## Kundhantering 
### GET /customers/:id 
○ Visa kundinformation 
○ Inkludera orderhistorik via JOIN med orders-tabellen 
### PUT /customers/:id 
○ Uppdatera kundens kontaktuppgifter (email, telefon, adress) 
### GET /customers/:id/orders 
○ Lista alla ordrar för en specifik kund 
## Analysdata 
### GET /products/stats/:id
○ Visa statistik grupperad per kategori 
○ Antal produkter per kategori 
○ Genomsnittligt pris per kategori 
### GET /reviews/stats/:id 
○ Visa genomsnittligt betyg per produkt 
○ Använd GROUP BY för att sammanställa data
