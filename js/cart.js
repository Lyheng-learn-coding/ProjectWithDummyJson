document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");
  const checkOutbtn = document.getElementById("checkoutBtn");
  const cartContainer = document.getElementById("cartContainer");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      history.back();
    });
  }

  window.addEventListener("pageshow", () => {
    const cart = getCartProduct();
    displayCartProduct(cart);
    updateTotal(cart);
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "cartPro") {
      const cart = getCartProduct();
      displayCartProduct(cart);
      updateTotal(cart);
    }
  });

  cartContainer.addEventListener("click", (e) => {
    const removeItem = e.target.closest(".removeitem");
    if (removeItem) {
      const productid = removeItem.dataset.itemid;

      let cart = getCartProduct();
      cart = cart.filter((p) => p.id != productid);
      saveProduct(cart);

      displayCartProduct(cart);
      updateTotal(cart);
    }
  });

  if (checkOutbtn) {
    checkOutbtn.addEventListener("click", (e) => {
      e.preventDefault();

      saveProduct([]);
      displayCartProduct([]);
      updateTotal([]);

      Swal.fire({
        title: "Your order has been placed",
        text: "Thank you for shopping with Dina Shop!",
        icon: "success",
        confirmButtonColor: "#008000",
        confirmButtonText: "Return to home page!",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "index.html";
        }
      });
    });
  }
});

function getCartProduct() {
  const cartData = localStorage.getItem("cartPro");
  if (!cartData || cartData === "undefined") {
    return [];
  }
  return JSON.parse(cartData) || [];
}

function saveProduct(cartPro) {
  localStorage.setItem("cartPro", JSON.stringify(cartPro));
}

function displayCartProduct(cart) {
  const cartContainer = document.getElementById("cartContainer");
  if (cart.length === 0) {
    cartContainer.innerHTML = `<tr><td colspan="6" class="text-center text-2xl text-red-500 p-4">Your cart is empty.</td></tr>`;
    return;
  }

  function generateOptions(max = 10, currentQty = 1) {
    let options = "";
    for (let i = 1; i <= max; i++) {
      options += `<option value="${i}" ${
        i === currentQty ? "selected" : ""
      }>${i}</option>`;
    }
    return options;
  }

  cartContainer.innerHTML = cart
    .map(
      (p) => `
        <tr>
          <td class="flex md:size-40 size-30">
            <img src="${p.thumbnail}" alt="${p.title}" class="" />
          </td>
          <td class="min-w-[150px] align-top p-[10px]">${p.title}</td>
          <td class="text-center font-bold p-[10px] align-top">$${p.price}</td>
          <td class="p-[10px] pl-0 text-center align-top">
            <select 
              name="quantity"
              class="quantity-selector border-[#ccc] border p-[5px] px-[10px] text-[1rem] text-left cursor-pointer rounded-[5px]"
              data-itemid="${p.id}"
            >
              ${generateOptions(10, p.quantity || 1)}
            </select>
          </td>
          <td class="text-center font-bold p-[10px] align-top">$${(
            p.price * (p.quantity || 1)
          ).toFixed(2)}</td>
          <td data-itemid='${
            p.id
          }' class="removeitem text-center text-[1.2rem] text-[red] align-top p-[10px]">
            <i class="fa-solid fa-trash-can"></i>
          </td>
        </tr>
      `
    )
    .join("");

  // Add event listeners to the quantity selectors
  const quantitySelectors = document.querySelectorAll(".quantity-selector");
  quantitySelectors.forEach((selector) => {
    selector.addEventListener("change", (e) => {
      const productId = e.target.dataset.itemid;
      const newQuantity = parseInt(e.target.value, 10);
      let cart = getCartProduct();
      const product = cart.find((p) => p.id == productId);
      if (product) {
        product.quantity = newQuantity;
        saveProduct(cart);
        displayCartProduct(cart);
        updateTotal(cart);
      }
    });
  });
}

function updateTotal(cart) {
  const totalElement = document.querySelector(".totalPrice");
  const total = cart.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
  const checkOutbtn = document.getElementById("checkoutBtn");
  if (checkOutbtn) {
    checkOutbtn.disabled = cart.length === 0;
  }
}
