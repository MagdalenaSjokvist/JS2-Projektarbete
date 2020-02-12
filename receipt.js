//1. hämtar den sparade produktdatan från localStorage (alla beställda produkter)
// och sparar ner datan i en ny array ($receiptArray)
$(document).ready(function() {
	const $receiptArray = JSON.parse(localStorage.getItem("storedItems"))

	//3. hittar och cachar <div id="orderedProducts"> som finns i filen receipt.html
	let $orderedProducts = $("#orderedProducts")

	//4. sätter div:ens innehåll till en tabell som ritar ut de beställda produkterna (utifrån $receiptArray)
	$orderedProducts = ""
	$orderedProducts += `<table class="table table-striped table-hover">
                      <thead class="thead-light">
                        <tr>
                          <th></th>
                          <th>Produkt</th>
                          <th>Antal</th>
                          <th>Pris/st</th>
                          
                        </tr>
                      </thead>`
	$receiptArray.forEach(product => {
		$orderedProducts += `<tr>
  <td><div class="img-container"><img src="${product.image}"</div></td>						
  <td>${product.name}</td>
  <td>${product.qty}</td>
  <td>${product.price} SEK</td>
</tr>`
	})
	$orderedProducts += "</table>"
	$orderedProducts += `<h3 class="alignRight">Totalsumma: ${totalPrice(
		$receiptArray
	)} kr </h3>`
	$("#orderedProducts").html($orderedProducts)

	localStorage.clear() //Tömmer localStorage, efter att produkterna har ritats ut i på kvittosidan.

	//4. funktion som räknar ut och returnerar beställningens totalsumma
	function totalPrice(arr) {
		let outputPrice = 0

		for (let i = 0; i < arr.length; i++) {
			const qty = parseInt(arr[i].qty)
			const price = parseInt(arr[i].price)
			outputPrice += qty * price
		}

		return outputPrice
	}

	//5. Cacha stäng-knappen, sätt lyssnare vid klick som stänger fönstret
	const $closeBtn = $("#close")
	$closeBtn.on("click", function() {
		window.close()
	})
	//6. Cacha skriv ut-knappen, sätt lyssnare vid klick som öppnar print-dialogruta
	const $printBtn = $("#print")
	$printBtn.on("click", function() {
		window.print()
	})
})
