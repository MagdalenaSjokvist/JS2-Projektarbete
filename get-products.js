$(document).ready(function() {
	$.getJSON("products.json", function(products) {
		// Skriv ut resultatet (response)
		console.log(products)

		// Skriv ut det första objektet
		console.log(products[0])

		// Skriv ut namnet från objektet
		console.log(products[0].name)

		// Skriv ut origin från objektet
		console.log(products[0].origin)

		// Skriv ut price från objektet
		console.log(products[0].price)

		// Visa alla namn
		products.forEach(element => {
			// console.log(element);
			console.log(element.name)
		})

		// Visa alla origin
		products.forEach(element => {
			console.log(element.origin)
		})

		// Visa både namn och e-postadresser
		products.forEach(product => {
			console.log(product.name + ", " + product.origin)
		})

		// Skapa en sträng som innehåller all info
		// Strängen ska innehålla en tabell
		let table = '<table class="table table-striped table-hover">'
		table += `<thead class="thead-dark">
                <tr>
									<th></th>
									<th>Namn</th>
                  <th>Ursprungsland</th>
                  <th>Pris</th>
                  <th></th>
                </tr
              </thead>
    `

		products.forEach(product => {
			table += `<tr>
									<td><div class="img-container"><img src="${product.image}"</div></td>						
									<td>${product.name}</td>
                  <td>${product.origin}</td>
									<td>${product.price}</td>
									<td><button type="button" id="addProductBtn">Lägg i varukorg</button>
                </tr>
      `
		})

		table += "</table>"

		console.log(table)
		document.getElementById("products").innerHTML = table

		// Alternativ med jquery:		$("#products").html(table)
	}).fail(function() {
		console.error("Fel vid läsning av JSON!")
	}) // getJSON
})

//1. Skapa produkt-behållare(article) för

//Skapa en webbsida som visar ca 10 olika valfria produkter. Produkterna måste hämtas från en JSON-fil.

//3. Skapa en JSON - fil för att lagra produkterna. Skapa en länk till JSON-filen längst ner på sidan.

//4. Skapa en varukorg. För G-nivå skall man kunna lägga till en styck av varje produkt i varukorgen.

//5. Visa produktnamn och pris i varukorgen. Visa totalsumma i varukorgen.

//6. Lägg till en beställningsknapp i varukorgen.
//Vid beställning(när kunden klickar på beställningsknappen), visa en bekräftelse på skärmen och töm varukorgen.
/*

KORREKT - funkar för att hämta:
$.getJSON("products.json", function(response) {
	console.log(response)
	$("#demo").html(response.name + "<br>" + response.price)
})


let addProductBtn = $(".addProductBtn")
addProductBtn.addEventListener("click", function() {
	load("products.json", showProducts)
})
function showProducts(xhr) {
	let product = JSON.parse(xhr.responseText)
	console.log(product)
	$(".product").innerHTML = product.name
}
*/
