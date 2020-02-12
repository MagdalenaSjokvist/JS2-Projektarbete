$(document).ready(function() {
	//let allProducts = ""; //Produkttabellen inkl html-taggar
	//let products = []; JSON-arrayen m objekt

	let $storedArray = [] //array med valda produkter som sparas i localStorage
	const $cart = $("#cartItems") //div-elementet som visar varukorgen på sidan
	let $cartItems = "" //Varukorgstabellen med valda produkter inkl html-taggar
	let $cartArray = [] //Array m varukorgens innehåll (produkter) i form av objekt
	let $updateButtons = [] //Plus- och minusknappar i varukorgen, för att ändra antal (1 per produktrad)
	let $deleteButtons = [] //Ta bort-knappar i varukorgen (1 per produktrad)
	let $receiptWindow //referens till receipt-fönstret som öppnas vid beställning

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
                          <td><button type="button" id="${product.id}" class="addProductBtn"><i class="fa fa-cart-plus" aria-hidden="true"></i> Lägg i varukorg</button></td>
                      </tr>`
		})

		allProducts += `</table>`
		$("#products").html(allProducts) //Ersätter innehållet i den tomma div-taggen med id="products"

		//1.2. Sätt lyssnare på statiska element i produktlistan (lägg till-knappar och input-fält för antal)

		//Cacha alla lägg till-knappar, lyssna efter klick och anropa funktionen addToCart
		const $addProductButtons = $(".addProductBtn")
		$addProductButtons.each(function() {
			$(this).on("click", function() {
				addToCart(this.id)
			})
		})

		//Cacha alla antal-inputfält, lyssnar efter ändring och anropar funktionen addQty som lägger till värdet i objektet
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
												<th>Produkt</th>
												<th>Antal</th>
												<th>Pris/st</th>
												<th></th>
											</tr>
								</thead>
									`
			$cartArray.forEach(product => {
				$cartItems += `<tr>						
													<td>${product.name}</td>
													<td><button type="button" id="${product.id}" class="minusOne changeQty"><i class="fa fa-minus" aria-hidden="true"></i></button>  
													 ${product.qty}
													<button type="button" id="${product.id}" class="plusOne changeQty"><i class="fa fa-plus" aria-hidden="true"></i></button></td>
													<td>${product.price} SEK</td>
													<td><button type="button" id="${product.id}" class="removeProductBtn"><i class="fa fa-trash-o" aria-hidden="true"></i> Ta bort</button></td>
												</tr>
							`
			})
			$cartItems += "</table>"
			$cartItems += `<h4>Totalsumma: ${totalPrice($cartArray)} kr </h4>`
			$cartItems +=
				"<button type='button' class='sendOrderBtn'><i class='fa fa-arrow-right'></i> Skicka beställning </button>"
			$cartItems +=
				"<button type='button' class='emptyCartBtn' ><i class='fa fa-trash'></i> Töm varukorgen</button></br></br>"
			//	cartArray = []

			$("#cartItems").html($cartItems) //Lägg till tabellen i DOM:en (i div-taggen med id=cartItems)

			//Allt som har förändrats i varukorgon (dvs element som inte är statiska)
			//behöver hanteras i samband med drawCart()

			//2.2 Sätt lyssnare på knappar i varukorgen

			//Cacha plus- och minusknappar och lägg på lyssnare som anropar changeQty() vid klick
			$updateButtons = $(".changeQty")
			$updateButtons.each(function() {
				$(this).on("click", function() {
					changeQty(this)
				})
			})

			//Cacha "Ta bort"-knappar och lägg på lyssnare som anropar removeFromCart () vid klick
			$deleteButtons = $(".removeProductBtn")
			$deleteButtons.each(function() {
				$(this).on("click", function() {
					removeFromCart(this.id)
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
				sendOrder() //alert eller för VG visa kvitto med detaljer i nytt fönster
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

		//3.2 Lägg till objekt i varukorgen
		function addToCart(buttonId) {
			let index = parseInt(buttonId) - 1 //index = index i JSON-arrayen (som börjar på 0, därav -1)
			let newProduct = products[index]

			//Kollar om produkten redan finns i varukorgen, för att undvika dubletter
			if ($cartArray.includes(newProduct)) {
				alert("Produkten är redan tillagd, vänligen ändra antal i varukorgen.")
				$itemQuantityFields[index].value = null //tömmer produktradens antal-fält
			} else {
				for (let i = 0; i < products.length; i++) {
					if (buttonId == products[i].id) {
						$cartArray.push(products[i])
						updateLocalStorage() //Uppdaterar arrayen i localStorage
						drawCart()
						$itemQuantityFields[i].value = null //tömmer produktradens antal-fält
					}
				}
			}
		}

		//3.3 Ta bort produkt från varukorgen (returnerar en uppdaterad array som filtrerat bort den borttagna produkten)
		function removeFromCart(buttonId) {
			const removedProductId = parseInt(buttonId)
			const updatedCart = $cartArray.filter(function(item) {
				//const itemID = item.id
				return item.id !== removedProductId
			})
			$cartArray = updatedCart
			updateLocalStorage()
			drawCart()
		}

		//3.4 Ändra antal på befintlig produkt i varukorgen
		function changeQty(button) {
			$button = button

			for (let i = 0; i < products.length; i++) {
				if ($button.id == products[i].id) {
					let qty = parseInt(products[i].qty) //Hämtar qty-propertyn från aktuell produkt och gör om till en INT

					if ($(button).hasClass("plusOne")) {
						qty++
						products[i].qty = qty
					} else if ($(button).hasClass("minusOne")) {
						qty--
						products[i].qty = qty
					} else {
						alert("Something wrong")
					}
				}
			}
			updateLocalStorage()
			drawCart()
		}
		//3.5 Tömma varukorgen
		function emptyCart() {
			$cartArray = []
			drawCart()
		}

		//3.6 Beräkna totalsumman i varukorgen
		function totalPrice(arr) {
			let outputPrice = 0

			for (let i = 0; i < arr.length; i++) {
				const qty = parseInt(arr[i].qty)
				const price = parseInt(arr[i].price)
				outputPrice += qty * price
			}

			return outputPrice
		}

		//3.7 Skicka beställning och visa bekräftelse/kvitto i nytt fönster
		function sendOrder() {
			alert("Din order skickas")
			openWindow()
			emptyCart()
		}

		//3.8 Öppna orderbekräftelse i nytt fönster
		function openWindow() {
			$receiptWindow = window.open(
				"receipt.html",
				"_blank",
				"toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=700,height=400"
			)
		}

		//3.9 Uppdatera localStorage
		function updateLocalStorage() {
			localStorage.clear() //Rensar först localStorage
			localStorage.setItem("storedItems", JSON.stringify($cartArray)) //Spara aktuell array i localStorage
		}

		//3.10 Visa felmeddelande om JSON-filen inte går att läsa.
	}).fail(function() {
		console.error("Fel vid läsning av JSON!")
	})
})
