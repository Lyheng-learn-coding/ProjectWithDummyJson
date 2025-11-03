let currentProduct = null;
let quantity = 1;

document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.getElementById("detailContainer");
  const backBtn = document.getElementById("backBtn");
  const productId = new URLSearchParams(window.location.search).get("id");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      history.back();
    });
  }

  if (!productId) {
    displayError("Product ID is missing.");
    return;
  }

  displayLoading();
  fetchProduct(productId);

  detailContainer.addEventListener("click", handleProductActions);
});

function displayError(message) {
  const detailContainer = document.getElementById("detailContainer");
  detailContainer.innerHTML = `<p class="text-center text-2xl text-red-500">${message}</p>`;
}

function displayLoading() {
  const detailContainer = document.getElementById("detailContainer");
  detailContainer.innerHTML = '<p class="text-center text-2xl">Loading product...</p>';
}

function fetchProduct(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Product not found");
      }
      return res.json();
    })
    .then((data) => {
      currentProduct = data;
      document.title = data.title;
      renderProductDetail(data);
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
      displayError("Failed to load product.");
    });
}

function handleProductActions(e) {
  const increbtn = e.target.closest(".btnincrement");
  const decrebtn = e.target.closest(".btndecrement");
  const addtoCartBtn = e.target.closest(".add-to-cart-btn");

  if (increbtn) {
    quantity++;
    updateQtyDisplay();
  }

  if (decrebtn) {
    if (quantity > 1) {
      quantity--;
      updateQtyDisplay();
    }
  }

  if (addtoCartBtn) {
    if (currentProduct) {
      addProductToCart(currentProduct, quantity);
    }
  }
}

function updateQtyDisplay() {
  const gtyElement = document.querySelector(".quantity-span");
  gtyElement.textContent = quantity;
}

function renderProductDetail(p) {
  const detailContainer = document.getElementById("detailContainer");
  const rating = Math.round(p.rating);
  const stars = Array(5)
    .fill(0)
    .map((_, i) =>
      i < rating
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>'
    )
    .join("");

  detailContainer.innerHTML = `
      <div class="md:w-[400px]">
          <img
            src="${p.thumbnail}"
            alt="${p.title}"
            class="w-full "
          />
        </div>
        <div class="p-[10px] md:p-0 md:w-1/2">
          <h2 class="font-bold text-[1.5rem]">${p.title}</h2>
          <p class="text-yellow-400 text-[1rem]">
            ${stars} <span class="text-gray-500 text-[1.2rem]">(${p.rating.toFixed(
    1
  )})</span> 
         <span class = "text-black text-[1rem]">review</span>
          </p>
          <h2 class="text-black font-bold text-[1.4rem] mt-4">Description</h2>
          <p class="max-w-prose">
                    ${p.description}
          </p>
          <p class="font-bold text-[red] text-[1.4rem] my-4">$${p.price}</p>
          <div class="flex md:gap-4 gap-2.5 flex-col-reverse md:flex-row">
            <div>
              <button
                class="add-to-cart-btn p-[10px] bg-black text-[1rem] flex justify-center items-center gap-1.5 rounded-[5px] text-white cursor-pointer hover:bg-white hover:text-black hover:outline-1 transition-all duration-[0.2s] w-full md:w-auto"
              >
                <i class="fa-solid fa-cart-shopping"></i> Add to cart
              </button>
            </div>
            <div class="flex gap-1.5 justify-end">
              <button
                class="btndecrement p-[10px] rounded-[5px] bg-[#f4f4f4] text-black text-[1rem] cursor-pointer"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <span
                class="quantity-span p-[10px] px-[15px] text-[1rem] bg-[#f4f4f4]  hover:outline-1 rounded-[5px]"
                >1</span
              >

              <button
                class="btnincrement p-[10px] rounded-[5px] bg-[#f4f4f4] text-black text-[1rem] cursor-pointer"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
    
    `;
}

function getCartProduct() {
  const cartData = localStorage.getItem("cartPro");
  if (!cartData || cartData === "undefined") {
    return [];
  }
  return JSON.parse(cartData) || [];
}

function saveProductDetail(cartPro) {
  localStorage.setItem("cartPro", JSON.stringify(cartPro));
}

function addProductToCart(product, quantity) {
  let cart = getCartProduct();
  let existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    // If product exists, update its quantity
    existingProduct.quantity += quantity;
    Swal.fire({
      title: "Quantity Updated",
      text: "The product quantity has been updated in your cart.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      draggable: true,
    });
  } else {
    // Add new product with the specified quantity
    let productToAdd = { ...product, quantity: quantity };
    cart.push(productToAdd);
    Swal.fire({
      title: "Added to Cart!",
      text: "Product has been added to your cart.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      draggable: true,
    });
  }
  saveProductDetail(cart);
}