$(document).ready(function() {
	//initiera variabler, ska vi göra detta eller inte? Vad tycker du?
	//let allProducts = ""; //Produkttabellen inkl html-taggar
	//let cartItems = ""; //Varukorgstabellen inkl html-taggar
	//let products = []; JSON-arrayen m objekt
	let cartArray = [] //Array m varukorgens innehåll (produkter) i form av objekt
	let $updateButtons = []
	let deleteButtons = []

	$.getJSON("products.json", function(products) {
		//STORE
		// 1. Skapa en variabel, och sätt den till en sträng som innehåller all info / alla relevanta element
		// Strängen ska innehålla en tabell i detta fall (om det är så vi vill att datan ska visas)
		let allProducts = `<table class="table table-striped table-hover">`
		allProducts += `<thead class="thead-dark">
											<tr>
												<th></th>
												<th>Namn</th>
												<th>Ursprungsland</th>
												<th>Pris/st</th>
												<th>Antal</th>
												<th></th>
											</tr>
										</thead>`

		//2. Lägg till en tabellrad för varje produkt med all aktuell data(i form av td-taggar) = produktens olika properties plus en td med <input>(antal), och en td med <button>(för att lägga till)
		products.forEach(product => {
			allProducts += `<tr>
                          <td><div class="img-container"><img src="${product.image}"</div></td>						
                          <td>${product.name}</td>
                          <td>${product.origin}</td>
                          <td>${product.price} SEK</td>
                          <td><input type="number" min=0 id="${product.id}" class="quantity"></input></td>
                          <td><button type="button" id="${product.id}" class="addProductBtn">Lägg i varukorg</button></td>
                      </tr>`
		})

		//3. Lägg till sluttaggen som sista steg, för att stänga table-elementet
		allProducts += `</table>`

		//4. Sätt innerHTML på div:en med id="products" till variabeln allProducts (ersätter den tomma div-taggen med tabellen som fyllts med alla produkter)
		$("#products").html(allProducts)

		//EVENT LISTENERS FÖR STATISKA ELEMENT I PRODUKTLISTAN SAMT VISA/DÖLJ VARUKORG
		//5. Hitta alla "Lägg till-knappar" (blir en sk. HTMLcollection med alla 10 knappar)
		//Lyssna efter klick på alla "lägg till"-knappar, och anropa addToCart

		const addProductButtons = document.getElementsByClassName("addProductBtn")
		//console.log(addProductButtons);

		for (let i = 0; i < addProductButtons.length; i++) {
			addProductButtons[i].addEventListener("click", function() {
				addToCart(addProductButtons[i].id)
			})
		}
		//6. Hitta alla antal-input och skapa lyssnare för dem, anropa addQty som lägger till värdet i objektet
		const itemQuantityFields = document.getElementsByClassName("quantity")
		//console.log(itemQuantityFields);

		for (let i = 0; i < itemQuantityFields.length; i++) {
			itemQuantityFields[i].addEventListener("change", function() {
				addQty(itemQuantityFields[i].id, itemQuantityFields[i].value)
				//itemQuantityFields[i].value = null;
			})
		}

		//8. Hitta alla "Ta bort"-knappar och skapa lyssnare för dem, anropa removeFromCart
		//let deleteButtons = [];
		for (let i = 0; i < deleteButtons.length; i++) {
			deleteButtons[i].addEventListener("click", function() {
				removeFromCart(deleteButtons[i].id)
			})
		}
		//9. skapa lyssnare för beställningsknapp som anropar sendOrder()

		//SHOPPING CART
		//10. Skapa en tom array för varukorgen, som kan fyllas med de produkter som läggs till vid klick.
		//let cartArray = [];
		//11. Skapa grunden för en tabell för att visa produkter i varukorgen

		//12. Funktion som skapar en tabellrad för varje produkt med namn, antal, pris och "ta bort"-knapp
		function drawCart() {
			let cartItems = `<table class="table table-striped table-hover"><thead class="thead-light">
											<tr>
												<th>Namn</th>
												<th>Antal</th>
												<th>Pris/st</th>
												<th></th>
											</tr>
								</thead>
									`
			cartArray.forEach(product => {
				cartItems += `<tr>						
                          <td>${product.name}</td>
                          <td><button type="button" id="${product.id}" class="minusOne changeQty">➖</button>  
                          ${product.qty}  
                          <button type="button" id="${product.id}" class="plusOne changeQty">➕</button></td>
                          <td>${product.price} SEK</td>
                          <td><button type="button" id="${product.id}" class="removeProductBtn">Ta bort</button></td>
                        </tr>
              `
			})
			cartItems += "</table>"
			cartItems +=
				"<button type='button' class='sendOrderBtn'><i class='fa fa-arrow-right'></i><a href='receipt.html'> Skicka beställning </a></button>"
			cartItems +=
				"<button type='button' class='emptyCartBtn' ><i class='fa fa-trash'></i> Töm varukorgen</button></br></br>"
			//	cartArray = []
			console.log(cartItems)

			//13. Lägg till tabellen i DOM:en
			document.getElementById("cartItems").innerHTML = cartItems

			//Allt som har förändrats i varukorgon (dvs element som inte är statiska)
			//behöver hanteras i samband med drawCart()

			//lägg in plus/minusknappar i variabeln updateButtons och skapa lyssnare som anropar changeQty
			$updateButtons = $(".changeQty")
			console.log($updateButtons)
			$updateButtons.each(function() {
				$(this).on("click", function() {
					console.log(this)
					changeQty(this)
				})
			})

			//samma för "ta bort"-knapparna
			deleteButtons = document.getElementsByClassName("removeProductBtn")

			//16. Rensa hela varukorgen samt hela local storage

			//Hitta "Töm varukorgen"-knappen och spara i en variabel (casha)
			$emptyCartBtn = $(".emptyCartBtn") //console.log($emptyCartBtn)

			//Lyssna efter klick på töm-knappen
			$emptyCartBtn.on("click", function() {
				emptyCart()
			})

			//Funktionen emptyCart()
			function emptyCart() {
				cartArray = []
				drawCart()
			}

			//18. Funktion för beställningsbekräftelse kopplat till skicka-knapp

			//Hitta "Skicka beställning"-knappen och spara i en variabel (casha)
			$sendOrderBtn = $(".sendOrderBtn")
			console.log($sendOrderBtn)

			//Lyssna efter klick på skicka-knappen
			$sendOrderBtn.on("click", function() {
				sendOrder() //alert eller för VG skapa i nytt fönster
			})

			//Funktionen sendOrder()
			function sendOrder() {
				alert("Din order skickas")
				showReceipt() //OBS! VG-nivå: Funktion som visar orderöversikt på ny sida
				emptyCart()
			}

			//Skapa funktion showReceipt() som visar en översikt av beställningen (med alla detaljer)
			function showReceipt() {
				$("#orderedProducts").html("TEST")
				getProductsFromLocalStorage()
			}
		}

		//Räcker det att spara till localstorage, och sedan hämta datan till varukorgen därifrån? I vilken ordning ska saker ske?

		//14. Lägg till objekt i varukorgen samt spara det i localstorage
		function addToCart(buttonId) {
			for (let i = 0; i < products.length; i++) {
				if (buttonId == products[i].id) {
					//Kontrollera om produkten finns i varukorgen,
					//om inte lägg till objektet i cartArray (EJ KLART)
					cartArray.push(products[i])
					//console.log(products[i]);
					console.log(cartArray)
					//Spara arrayen i localStorage (använd JSON.stringify för att få med hakparenteserna)

					updateLocalStorage()
					drawCart()

					//töm objektets qty-fält
					itemQuantityFields[i].value = null
				}
				//Lägg till objektet i local storage
			}
		}

		//15. Ta bort objekt från varukorgen samt local storage
		function removeFromCart(buttonId) {
			//kod
		}

		//16. Rensa hela varukorgen samt hela local storage
		//function emptyCart() {
		//kod
		//}

		//17. Funktioner för att ändra antal på produkt
		//innan produkten läggs till i varukorg
		function addQty(id, qty) {
			for (let i = 0; i < products.length; i++) {
				if (id == products[i].id) {
					products[i].qty = qty
				}
			}
		}

		//på befintlig produkt i varukorg
		function changeQty(button) {
			$button = button

			for (let i = 0; i < products.length; i++) {
				if ($button.id == products[i].id) {
					console.log($button.id)
					console.log(products[i].id)
					let qty = parseInt(products[i].qty)
					console.log(qty)

					if ($(button).hasClass("plusOne")) {
						qty++
						products[i].qty = qty
						cartArray.splice([i], 1, products[i])
						console.log(products[i].qty)
					} else if ($(button).hasClass("minusOne")) {
						qty--
						products[i].qty = qty
						cartArray.splice([i], 1, products[i])
						console.log(products[i].qty)
					} else {
						alert("Something wrong")
					}
				}
			}

			drawCart()
		}

		/*
		//18. Funktion för beställningsbekräftelse
		function sendOrder() {
			//alert eller för VG skapa i nytt fönster
		}*/

		//OKLART! Men verkar fungera. Sparas i localStorage, och uppdateras när man lägger till något.
		function updateLocalStorage() {
			//Rensa localStorage
			localStorage.clear()
			//Spara arrayen i localStorage
			localStorage.setItem("cartItems", JSON.stringify(cartArray))
			let storedArray = JSON.parse(localStorage.getItem("cartItems"))
			console.log(storedArray)
		}

		//OKLART! Hur skriva ut alla köpta produkter i en tabell, på samma sätt som på startsidan?
		function getProductsFromLocalStorage() {
			let storedArray = JSON.parse(localStorage.getItem("cartItems"))
			console.log(storedArray)

			let output = `<table class="table table-striped table-hover">
								<thead class="thead-light">
								<tr>
								<th></th>
								<th>Namn</th>
								<th>Ursprungsland</th>
								<th>Pris</th>
								<th>Antal</th>
								<th></th>
								</tr>
								</thead>`

			for (let i = 0; i < localStorage.length; i++) {
				console.log(localStorage.getItem(localStorage.key(i))) //Med getItem hämtar vi själva värdet

				output += "<tr>" + localStorage.getItem(localStorage.key(i)) + "<tr/>"
			}
			output += "</table>"
			document.getElementById("orderedProducts").innerHTML = output
		}

		//Funktion för att visa felmeddelande om JSON-filen inte går att läsa.
	}).fail(function() {
		console.error("Fel vid läsning av JSON!")
	})
})
