//getJSON
$(document).ready(function() {
	$.getJSON("products.json", function(products) {
		/*console.log(products) //Skriver ut resultatet (response) = hela arrayen av produkter
		console.log(products[0]) //Skriver ut hela det första objektet (med alla properties)
		console.log(products[0].name) //Skriver ut name från första objektet
	
		//Visar alla namn
		products.forEach(element => {
			console.log(element.name)
		})

		//Visar både namn och origin:
		products.forEach(product => {
			console.log(product.name + ", " + product.origin)
		})
		*/

		//STORE

		// 1. Skapa en variabel, och sätt den till en sträng med alla relevanta element
		// Strängen ska innehålla en tabell i detta fall
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
              </thead>`

		//2. Lägg till en tabellrad för varje produkt med all aktuell data(i form av td-taggar) = produktens olika properties plus en td med <input>(antal), och en td med <button>(för att lägga till)
		products.forEach(product => {
			allProducts += `<tr>
									<td><div class="img-container"><img src="${product.image}"</div></td>						
									<td>${product.name}</td>
                  <td>${product.origin}</td>
									<td>${product.price}</td>
									<td><input type="number" min=0 id="quantity"></input>
									<td><button type="button" id="${product.id}" class="addProductBtn">Lägg i varukorg</button>
                </tr>`
		})

		//3. Lägg till sluttaggen som sista steg, för att stänga table-elementet
		allProducts += "</table>"

		//4. Sätt innerHTML på div:en med id="products" till variabeln allProducts (ersätter den tomma div-taggen med tabellen som fyllts med alla produkter)
		$("#products").html(allProducts) // Alternativ med vanilla JS: document.getElementById("products").innerHTML = allProducts

		//5. Hitta alla "Lägg till-knappar" (blir en sk. HTMLcollection med alla 10 knappar)
		const addProductButtons = document.getElementsByClassName("addProductBtn")
		console.log(addProductButtons)

		//SHOPPING CART
		//6. Skapa en tom array för varukorgen, som kan fyllas med de produkter som läggs till vid klick.
		let cartArray = []

		//7. Lyssna efter klick på alla knappar, och lägg till vald produkt i varukorgen (arrayen cartArray) och i localStorage
		for (let i = 0; i < addProductButtons.length; i++) {
			addProductButtons[i].addEventListener("click", function() {
				addToCart(addProductButtons[i].id)
				//console.log(addProductButtons[i].id)
			})
		}

		//8. Skapa grunden för en tabell för att visa produkter i varukorgen
		//Fundering: Vad kan läggas i HTML och vad gör vi bäst i att skapa i js-filen? De delar som är konstanta.
		let cartItems = `<table class="table table-striped table-hover">
								<thead class="thead-light">
									<tr>
										<th>Namn</th>
										<th>Antal</th>
										<th>Pris</th>
										<th></th>
									</tr
								</thead>`

		drawCart()

		//9. Loopa igenom arrayen cartItems och skapa en ny tabellrad för varje produkt (med namn, antal, pris och ta bort-knapp)
		function drawCart() {
			cartArray.forEach(product => {
				cartItems += `<tr>
											<td>${product.name}</td>
											<td>Antal</td>
											<td>${product.price}</td>
											<td><button type="button" id="${product.id}" class="removeProductBtn">Ta bort</button></td>
										</tr>`
			})

			cartItems += "</table>"
			//Lägg till sluttaggen som sista steg, för att stänga table-elementet

			//10. Sätt div-taggen med id="cartItems" till tabellens innehåll = variabeln cartItems
			$("#cartItems").html(cartItems)
		}

		//FUNDERING: Räcker det att spara till localstorage, och sedan hämta datan till varukorgen därifrån? I vilken ordning ska saker ske?

		//FUNKTIONER

		//11. Lägg till produkt i varukorgen (och local storarage?)
		function addToCart(buttonId) {
			for (let i = 0; i < products.length; i++) {
				if (buttonId == products[i].id) {
					cartArray.push(products[i])
					//TEST: console.log("hej " + products[i].name)
					//console.log(cartArray)
					drawCart()
				}
				//Lägg till produkt i localStorage
			}
		}
		/*
		//12. Ta bort produkt från varukorgen
		function removeFromCart(buttonId) {
			for (let i = 0; i < products.length; i++) {
				if (buttonId == products[i].id) {
					//TEST: console.log("hej " + products[i].name)
					//cartArray.remove(products[i])
					//TEST: console.log(cartArray)
				}
				drawCart()
			}
		}

		function updateLocalStorage() {}
		function getProductsFromLocalStorage() {}
*/

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
