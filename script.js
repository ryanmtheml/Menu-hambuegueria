console.log ("teste")

const menu = document.getElementById ("menu")
const cartBtn = document.getElementById ("cart-btn")
const cartmodal = document.getElementById ("modal-cart")
const cartItemsContainer = document.getElementById ("cart-items")
const cartTotal = document.getElementById ("cart-total")
const cartCheckoutBtn = document.getElementById ("checkout-btn")
const closeModalBtn = document.getElementById ("close-modal-btn")
const cartCounter = document.getElementById ("cart-count")
const adressInput = document.getElementById ("address")
const adressWarn = document.getElementById ("address-warn")
const pedidorealizado = document.getElementById ("pedidofinalizado")

let cart = [];

// abrir o modal cart

cartBtn.addEventListener("click", function(){
    cartmodal.style.display = "flex"
    updateCartModal();
})

//fecha o modal quando clica no botão

closeModalBtn.addEventListener("click", function(){
    cartmodal.style.display = "none"
})

//fecha o modal cart quando clica fora da tela

cartmodal.addEventListener ("click", function(event){
    if(event.target === cartmodal){
    cartmodal.style.display = "none"
}
})

menu.addEventListener("click", function(event){
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

   // console.log(parentButton)

    if (parentButton){
        const name = parentButton.getAttribute("data-name")

        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart (name, price)

        //ADICIONAR AO CARRINHO
    }

})

// função para adicionar ao carrinho

function addToCart(name, price){

    const existingItem = cart.find(item=> item.name === name)

    if(existingItem){
        // se existir aumenta a quantidade
        existingItem.quantity += 1;
        return;    
    } 
    
    else {

    cart.push({
        name,
        price,
        quantity: 1,
    })

    }

    updateCartModal()
    

}

function getTotalCart () {
    var total = 0;
    cart.forEach(item => {
        total +=item.quantity
    })
    return total;
        
}

// Atualiza o carrinho

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

        cart.forEach(item =>{
            const cartItemElement = document.createElement ("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

            cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
                <div>

                <p class="font-bold">${item.name}</p>
                <p>Qtd:${item.quantity}</p>
                <p class="font-medium mt-2">$ ${item.price.toFixed(2)}</p>

                </div>


                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>


        </div>
        `

        total += item.price * item.quantity

    cartItemsContainer.appendChild(cartItemElement)

        })

    cartTotal.textContent = total.toLocaleString("en", {
        style: "currency",
        currency: "USD"
    });

    //consertar bug de quantidade de itens no carrinho

    cartCounter.innerText = getTotalCart();
    

}

//função remover item carrinho

cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

    function removeItemCart (name){
        const index = cart.findIndex(item => item.name === name);

        if(index !== -1){
            const item = cart[index];

            if (item.quantity > 1){
                item.quantity -= 1;     
                updateCartModal();
                return;           
            }

            cart.splice(index, 1);
            updateCartModal();

        }

    }

    adressInput.addEventListener("input", function (event){
        let inputValue = event.target.value;

        if(inputValue !== "")
            adressInput.classList.remove("border-red-500")
            adressWarn.classList.add("hidden")
    })

    cartCheckoutBtn.addEventListener("click", function(){

       const isOpen = checkRestaurantOpen();
       if(!isOpen){

        Toastify({
            text: "Ops! estamos fechados",
            duration: 3000,
            close: false,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();

         //  alert("Restaurante fechado no momento")
         
           return;
       }


    //  if (cart.length === 0) return;
        if (adressInput.value === "" ){
            adressWarn.classList.remove("hidden")
            adressInput.classList.add("border-red-500")
            return
        }
    
        // Enviar pedido api
        const cartItems =cart.map ((item)=> {
            return (
                ` ${item.name} Quantidade: (${item.quantity}) Preço: $${item.price} | `
            )
        }) .join("")

        const message= encodeURIComponent (cartItems)
        const phone = "931802964"

        window.open(`https://wa.me/${phone}?text=${message} Total${cartTotal.textContent} | Endereço: ${adressInput.value}`,"_blank")

        cart.length = 0;
        adressInput.value = ("") ;
        updateCartModal();
        cartmodal.style.display = "none"
        pedidorealizado.style.display = "flex"

    })

    function checkRestaurantOpen(){
        const data = new Date();
        const hora= data.getHours();
        return hora >=18 && hora <=22;
    }

    const spanItem = document.getElementById("date-span")
    const isOpen = checkRestaurantOpen();

    if (isOpen){
        spanItem.classList.remove("bg-red-500")
        spanItem.classList.add("bg-green-600")
    }else{
        spanItem.classList.remove("bg-green-600")
        spanItem.classList.add("bg-red-500")
        
    }