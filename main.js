$(document).ready(function() {
	//initiera variabler, ska vi göra detta eller inte? Vad tycker du?
	//let allProducts = ""; //Produkttabellen inkl html-taggar
	//let products = []; JSON-arrayen m objekt

	const $cart = $("#cartItems") //div-elementet som innehåller varukorgen
	let $cartItems = "" //Varukorgstabellen med valda produkter inkl html-taggar
	let $cartArray = [] //Array m varukorgens innehåll (produkter) i form av objekt
	let $updateButtons = [] //Plus- och minusknappar i varukorgen, för att ändra antal (1 per produktrad)
	let $deleteButtons = [] //Ta bort-knappar i varukorgen (1 per produktrad)

	$.getJSON("products.json", function(products) {
		//DEL 1: STORE
		// 1.1 Rita ut en tabell på sidan med alla produkter från json-filen

		//Skapa en variabel allProducts som ska innehålla alla produkter i json - filen, inkl.html - taggar för tabell
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

		//Lägg till en tabellrad för varje produkt
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

		allProducts += `</table>`
		$("#products").html(allProducts) //Ersätter innehållet i den tomma div-taggen med id="products"

		//1.2. Sätt lyssnare på lägg till-knappar och input-fält för antal

		//Hitta alla lägg till-knappar, lyssna efter klick och anropa funktionen addToCart
		const $addProductButtons = $(".addProductBtn")
		$addProductButtons.each(function() {
			$(this).on("click", function() {
				addToCart(this.id)
			})
		})

		//Hitta alla antal-inputfält, lyssnar efter ändring och anropar funktionen addQty som lägger till värdet i objektet
		const $itemQuantityFields = $(".quantity")
		$itemQuantityFields.each(function() {
			$(this).on("change", function() {
				addQty(this.id, this.value)
			})
		})

		//1.3. Skapa lyssnare för knappen visa/dölja varukorg
		const $showCartBtn = $("#showCartBtn")
		$showCartBtn.click(function() {
			$cart.toggle()
		})

		//Slut på STORE

		//DEL 2: SHOPPING CART
		//2.1 Funktion drawCart() ritar ut varukorgen som en tabell med valda produkter och knappar
		function drawCart() {
			$cartItems = ""
			$cartItems = `<h3>Din varukorg</h3><table class="table table-striped table-hover"><thead class="thead-light">
											<tr>
												<th>Namn</th>
												<th>Antal</th>
												<th>Pris/st</th>
												<th></th>
											</tr>
								</thead>
									`
			$cartArray.forEach(product => {
				$cartItems += `<tr>						
													<td>${product.name}</td>
													<td><button type="button" id="${product.id}" class="minusOne changeQty">➖</button>  
													${product.qty}  
													<button type="button" id="${product.id}" class="plusOne changeQty">➕</button></td>
													<td>${product.price} SEK</td>
													<td><button type="button" id="${product.id}" class="removeProductBtn">Ta bort</button></td>
												</tr>
							`
			})
			$cartItems += "</table>"
			$cartItems +=
				"<button type='button' class='sendOrderBtn'><i class='fa fa-arrow-right'></i><a href='receipt.html'> Skicka beställning </a></button>"
			$cartItems +=
				"<button type='button' class='emptyCartBtn' ><i class='fa fa-trash'></i> Töm varukorgen</button></br></br>"
			//	cartArray = []
			console.log($cartItems)
			//Lägg till tabellen i DOM:en (i div-taggen med id=cartItems)
			$("#cartItems").html($cartItems)

			//Allt som har förändrats i varukorgon (dvs element som inte är statiska)
			//behöver hanteras i samband med drawCart()

			//2.2 Sätt lyssnare på knappar i varukorgen

			//Cacha plus- och minusknappar och lägg på lyssnare som anropar changeQty() vid klick
			$updateButtons = $(".changeQty")
			$updateButtons.each(function() {
				$(this).on("click", function() {
					console.log(this)
					changeQty(this)
				})
			})

			//Cacha "Ta bort"-knappar och lägg på lyssnare som anropar removeFromCart () vid klick
			$deleteButtons = $(".removeProductBtn")
			$deleteButtons.each(function() {
				$(this).on("click", function() {
					console.log(this)
					removeFromCart(this)
				})
			})

			//Cacha "Töm varukorgen"-knappen och lägg på lyssnare som anropar emptyCart() vid klick
			$emptyCartBtn = $(".emptyCartBtn")
			$emptyCartBtn.on("click", function() {
				emptyCart()
			})
			//Cacha "Skicka beställning"-knappen och lägg på lyssnare som anropar sendOrder() vid klick
			$sendOrderBtn = $(".sendOrderBtn")
			$sendOrderBtn.on("click", function() {
				sendOrder() //alert eller för VG skapa i nytt fönster
			})
		}
		//Slut på drawCart()

		//DEL 3. Funktioner som manipulerar varukorgen på olika sätt

		//3.1 Välja antal på produkt innan produkten läggs till i varukorg
		function addQty(id, qty) {
			for (let i = 0; i < products.length; i++) {
				if (id == products[i].id) {
					products[i].qty = qty
				}
			}
		}

		//3.2 Lägg till objekt i varukorgen samt spara det i localstorage
		function addToCart(buttonId) {
			//Kvar att fixa: Villkor för att undvika dubletter
			//if produkt(id?) redan ligger i varukorgen(array.includes?), alert "Produkten ligger redan i varukorgen")
			//else kör for-loopen

			for (let i = 0; i < products.length; i++) {
				if (buttonId == products[i].id) {
					$cartArray.push(products[i])
					//console.log(products[i]);
					console.log($cartArray)
					//Spara arrayen i localStorage (använd JSON.stringify för att få med hakparenteserna)

					updateLocalStorage()
					drawCart()

					$itemQuantityFields[i].value = null //tömmer objektets qty-fält
				}
				//Lägg till objektet i local storage
			}
		}

		//3.3 Ta bort objekt från varukorgen (samt local storage?)
		function removeFromCart(buttonId) {
			//kod
		}

		//3.4 Ändra antal på befintlig produkt i varukorgen
		function changeQty(button) {
			$button = button

			for (let i = 0; i < products.length; i++) {
				if ($button.id == products[i].id) {
					let qty = parseInt(products[i].qty) //Hämtar qty-propertyn från aktuell produkt & gör om till en INT

					if ($(button).hasClass("plusOne")) {
						qty++
						products[i].qty = qty
						$cartArray.splice([i], 1, products[i])
					} else if ($(button).hasClass("minusOne")) {
						qty--
						products[i].qty = qty
						$cartArray.splice([i], 1, products[i])
					} else {
						alert("Something wrong")
					}
				}
			}
			drawCart()
		}
		//3.5 Tömma varukorgen
		function emptyCart() {
			$cartArray = []
			drawCart()
		}

		//3.6 Skicka beställning
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

		//OKLART! Men verkar fungera. Sparas i localStorage, och uppdateras när man lägger till något.
		function updateLocalStorage() {
			//Rensa localStorage
			localStorage.clear()
			//Spara arrayen i localStorage
			localStorage.setItem("cartItems", JSON.stringify($cartArray))
			let storedArray = JSON.parse(localStorage.getItem("cartItems"))
			console.log(storedArray)
		}

		//OKLART! Hur skriva ut alla köpta produkter i en tabell, på samma sätt som på startsidan?
		function getProductsFromLocalStorage() {
			storedArray = JSON.parse(localStorage.getItem("cartItems"))
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
			document.getElementById("test").innerHTML = output
		}

		//Funktion för att visa felmeddelande om JSON-filen inte går att läsa.
	}).fail(function() {
		console.error("Fel vid läsning av JSON!")
	})
})
