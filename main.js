//getJSON
$(document).ready(function() {
	$.getJSON("products.json", function(products) {
		//Först: TESTA ATT OLIKA DATA KAN HÄMTAS FRÅN JSON-FILEN (med console.log)

		/*
		console.log(products) //Skriver ut resultatet (response) = hela arrayen av produkter
		console.log(products[0]) //Skriver ut hela det första objektet (med alla properties)
		console.log(products[0].name) //Skriver ut name från första objektet
		console.log(products[0].origin) //Skriver ut origin från första objekte
		console.log(products[0].price) //Skriver ut price från första objektet
		console.log(products[0].image) //Skriver ut image från första objektet

		//Visar alla namn
		products.forEach(element => {
			//console.log(element)
			console.log(element.name)
		})

		//Visar alla origin
		products.forEach(element => {
			console.log(element.origin)
		})

		//Visar både namn och origin:
		products.forEach(product => {
			console.log(product.name + ", " + product.origin)
		})
		*/

		//HÄR BÖRJAR KODEN (allt ovan är bara tester med console.log)

		// 1. Skapa en variabel, och sätt den till en sträng som innehåller all info / alla relevanta element
		// Strängen ska innehålla en tabell i detta fall (om det är så vi vill att datan ska visas)
		let allProducts = '<table class="table table-striped table-hover">'
		allProducts += `<thead class="thead-dark">
                <tr>
									<th></th>
									<th>Namn</th>
                  <th>Ursprungsland</th>
                  <th>Pris</th>
                  <th>Antal</th>
                  <th></th>
                </tr
              </thead>
    `

		//2. Lägg till en tabellrad för varje produkt med all aktuell data(i form av td-taggar) = produktens olika properties plus en td med <input>(antal), och en td med <button>(för att lägga till)
		products.forEach(product => {
			allProducts += `<tr>
									<td><div class="img-container"><img src="${product.image}"</div></td>						
									<td>${product.name}</td>
                  <td>${product.origin}</td>
									<td>${product.price}</td>
									<td><input type="number" min=0 id="quantity"></input>
									<td><button type="button" id="${product.id}" class="addProductBtn">Lägg i varukorg</button>
                </tr>
      `
		})

		//3. Lägg till sluttaggen som sista steg, för att stänga table-elementet
		allProducts += "</table>"

		//4. Sätt innerHTML på div:en med id="products" till variabeln table (ersätter den tomma div-taggen med tabellen som fyllts med alla produkter)
		document.getElementById("products").innerHTML = allProducts // Alternativ med jquery: $("#products").html(table)

		//5. Hitta alla "Lägg till-knappar" (blir en sk. HTMLcollection med alla 10 knappar)
		const addProductButtons = document.getElementsByClassName("addProductBtn")
		//console.log(addProductButtons)

		//6. Skapa en tom array för varukorgen, som kan fyllas med de produkter som läggs till vid klick.
		let addedToCart = []

		//7. Lyssna efter klick på alla knappar, och lägg till vald produkt i varukorgen (arrayen cartItems) och i localStorage
		for (let i = 0; i < addProductButtons.length; i++) {
			addProductButtons[i].addEventListener("click", function() {
				addedToCart += products[i].name + " "
				//console.log(addProductButtons[i].id)
				console.log(addedToCart)
			})
		}

		//8. Rita ut arrayen med valda produkter som en lista eller table (med bara namn och pris, och ev. bild?)

		//FUNDERING: Skapa ev. funktioner för att lägga till produkt i varukorg + lägga till i localstorage?
		//Räcker det att spara till localstorage, och sedan hämta datan till varukorgen därifrån? I vilken ordning ska saker ske?
		function addToCart() {}
		function updateLocalStorage() {}
		function getProductsFromLocalStorage() {}

		//Funktion för att visa felmeddelande om JSON-filen inte går att läsa.
	}).fail(function() {
		console.error("Fel vid läsning av JSON!")
	})
})

//1. Skapa produkt-behållare(article) för

//Skapa en webbsida som visar ca 10 olika valfria produkter. Produkterna måste hämtas från en JSON-fil.

//3. Skapa en JSON - fil för att lagra produkterna. Skapa en länk till JSON-filen längst ner på sidan.

//4. Skapa en varukorg. För G-nivå skall man kunna lägga till en styck av varje produkt i varukorgen.

//5. Visa produktnamn och pris i varukorgen. Visa totalsumma i varukorgen.

//6. Lägg till en beställningsknapp i varukorgen.
//Vid beställning(när kunden klickar på beställningsknappen), visa en bekräftelse på skärmen och töm varukorgen.
