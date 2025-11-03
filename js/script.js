const searchContainer = document.getElementById("searchContainer");
const forInputSearch = document.querySelectorAll(".forinputSearch");
const removeSearchBar = document.querySelectorAll(".removeSearchBar");
const overlayDark = document.getElementById("overlayDark");
const mainContainer = document.getElementById("mainContainer");
const favHeartBtn = document.getElementById("favHeartBtn");
const favCartContainer = document.getElementById("favCartContainer");
const btnBackFav = document.getElementById("btnBackFav");
const favContainer = document.getElementById("favContainer");

// --- Search Bar Logic ---

forInputSearch.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (searchContainer.classList.contains("top-[-100%]")) {
      searchContainer.classList.remove("top-[-100%]");
      searchContainer.classList.add("top-0");
      overlayDark.classList.add("block");
      overlayDark.classList.remove("hidden");
      document.getElementById("searchProductInput").focus();
    }
  });
});

removeSearchBar.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (searchContainer.classList.contains("top-0")) {
      searchContainer.classList.remove("top-0");
      searchContainer.classList.add("top-[-100%]");
      overlayDark.classList.add("hidden");
      overlayDark.classList.remove("block");
    }
  });
});

overlayDark.addEventListener("click", (e) => {
  e.preventDefault();
  // Hide search bar
  searchContainer.classList.remove("top-0");
  searchContainer.classList.add("top-[-100%]");
  // Hide favorites panel
  favCartContainer.classList.add("right-[-100%]");
  favCartContainer.classList.remove("right-0");
  // Hide overlay
  overlayDark.classList.add("hidden");
  overlayDark.classList.remove("block");
});

// --- Favorite Product Functions ---
function getFavProducts() {
  const favData = localStorage.getItem("favProducts");
  if (!favData || favData === "undefined") {
    return [];
  }
  return JSON.parse(favData) || [];
}

function saveFavProducts(favProducts) {
  localStorage.setItem("favProducts", JSON.stringify(favProducts));
}

function updateFavCount() {
  const favCountSpan = document.querySelector(".favCounter");
  const favProducts = getFavProducts();
  if (favCountSpan) {
    if (favProducts.length > 0) {
      favCountSpan.textContent = favProducts.length;
      favCountSpan.classList.remove("invisible");
    } else {
      favCountSpan.classList.add("invisible");
    }
  }
}

function updateCartCount() {
  let cartSpan = document.querySelector(".cartCounter");
  let cart = getCartProduct();
  let countPro = cart.length;

  if (countPro > 0) {
    cartSpan.textContent = cart.length;
    cartSpan.classList.remove("invisible");
  } else {
    cartSpan.classList.add("invisible");
  }
}
function updateCartCountMobile() {
  let cartSpan = document.querySelector(".cartCountermobile");
  let cart = getCartProduct();
  let countPro = cart.length;

  if (countPro > 0) {
    cartSpan.classList.remove("invisible");
  } else {
    cartSpan.classList.add("invisible");
  }
}

function saveCartProduct(cartPro) {
  localStorage.setItem("cartProt", JSON.stringify(cartPro));
}

function getCartProduct() {
  const cartData = localStorage.getItem("cartPro");
  if (!cartData || cartData === "undefined") {
    return [];
  }
  return JSON.parse(cartData) || [];
}

function toggleFavorite(productId, button) {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((product) => {
      let favProducts = getFavProducts();
      const productIndex = favProducts.findIndex((p) => p.id == productId);

      if (productIndex > -1) {
        favProducts.splice(productIndex, 1);
        button.classList.remove("text-red-600");
        button.querySelector("i").classList.remove("fa-solid");
        button.querySelector("i").classList.add("fa-regular");
      } else {
        favProducts.push(product);
        button.classList.add("text-red-600");
        button.querySelector("i").classList.add("fa-solid");
        button.querySelector("i").classList.remove("fa-regular");
      }

      saveFavProducts(favProducts);
      updateFavCount();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

favHeartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  displayProFav();
  if (favCartContainer.classList.contains("right-[-100%]")) {
    favCartContainer.classList.remove("right-[-100%]");
    favCartContainer.classList.add("right-0");
    overlayDark.classList.add("block");
    overlayDark.classList.remove("hidden");
  }
});

btnBackFav.addEventListener("click", (e) => {
  e.preventDefault();
  if (favCartContainer.classList.contains("right-0")) {
    favCartContainer.classList.remove("right-0");
    favCartContainer.classList.add("right-[-100%]");
    overlayDark.classList.remove("block");
    overlayDark.classList.add("hidden");
  }
});

// --- Carousel & Fetching Logic ---

function setupCarousel(container) {
  const prevBtn = container.parentElement.querySelector(".prev-product-btn");

  const nextBtn = container.parentElement.querySelector(".next-product-btn");

  if (prevBtn && nextBtn) {
    nextBtn.addEventListener("click", () => {
      const scrollAmount = container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      const scrollAmount = container.offsetWidth;
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
}

function fetchAndDisplayCategory(category, containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    setupCarousel(container);
    // Show a loading state
    container.innerHTML = `<p class="text-center text-lg p-4">Loading products...</p>`;
    fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          displayAllpro(data.products, container);
        } else {
          container.innerHTML = `<p class="text-[red] text-center text-[1.4rem] p-4">No products found</p>`;
        }
      })
      .catch((err) => {
        console.error(err);
        container.innerHTML = `<p class="text-[red] text-center text-[1.4rem] p-4">Error loading products</p>`;
      });
  }
}

function displayAllpro(products, container) {
  if (!container) return;
  const favProducts = getFavProducts();

  container.innerHTML = products
    .map((p) => {
      const isFav = favProducts.some((fav) => fav.id === p.id);
      return `
            <div class="snap-start flex-shrink-0 w-[50%] md:w-1/4 p-2">
              <a href="../public/detail.html?id=${p.id}" class="block p-[5px]">
              <img
                src="${p.thumbnail}"
                alt="${p.title}"
                class="w-full md:h-auto aspect-6/7 object-contain rounded-[10px] cursor-pointer shadow-sm"
              />
              </a>
              <div class="mt-[10px] p-[10px]">
                <div class="flex justify-between items-center">
                  <h2 class="text-red-600 font-bold text-[1rem] md:text-[1.2rem]">$${
                    p.price
                  }</h2>
                  <button class="fav-btn product-id-${
                    p.id
                  } text-[1.2rem] cursor-pointer ${
        isFav ? "text-red-600" : ""
      }" data-product-id="${p.id}">
                    <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
                  </button>
                </div>
                <h2 class="md:text-[1rem] text-[0.8rem] truncate">${
                  p.title
                }</h2>
              </div>
            </div>
    `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const recentSearch = localStorage.getItem("recentSearch");
  if (recentSearch) {
    const searchProductInput = document.getElementById("searchProductInput");
    if (searchProductInput) {
      searchProductInput.value = recentSearch;
    }
    const forInputSearchInputs = document.querySelectorAll(".forinputSearch");
    forInputSearchInputs.forEach((input) => {
      if (input.tagName === "INPUT") {
        input.value = recentSearch;
      }
    });
  }

  updateFavCount();
  updateCartCount();
  updateCartCountMobile();

  // Fetch all categories
  fetchAndDisplayCategory("tops", "topContainer");
  fetchAndDisplayCategory("womens-dresses", "womenDressContainer");
  fetchAndDisplayCategory("womens-bags", "womenBagContainer");
  fetchAndDisplayCategory("womens-watches", "watchesContainer");
  fetchAndDisplayCategory("sunglasses", "sunglassesContainer");
  fetchAndDisplayCategory("womens-shoes", "shoesContainer");
});

mainContainer.addEventListener("click", (e) => {
  const favButton = e.target.closest(".fav-btn");
  if (favButton) {
    e.preventDefault();
    const productId = favButton.dataset.productId;
    toggleFavorite(productId, favButton);
  }
});

function displayProFav() {
  const favProducts = getFavProducts();
  if (!favContainer) return;

  if (!favProducts || favProducts.length === 0) {
    favContainer.innerHTML =
      "<p class = 'text-center text-[red] text-[1.2rem] mt-10'>No favorite products found</p>";
    return;
  }

  favContainer.innerHTML = favProducts
    .map(
      (p) => `
        <div
          class="flex justify-between items-center gap-1.5 shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-[10px] mb-4"
        >
          <a href="../public/detail.html?id=${p.id}" class = "flex items-center gap-2.5">
          <img
            src="${p.thumbnail}"
            alt="${p.title}"
            class="size-20 object-contain"
          />
          </a>
          <p
          class="flex-grow max-w-prose overflow-auto text-[0.8rem] md:text-[1rem] hide-scrollbar mx-2"
          >
          ${p.title}
          </p>
          <p class="text-[red]">$${p.price}</p>
          <button
            class="remove-fav-btn p-[10px] bg-[red] text-white text-[1rem] rounded-[5px] cursor-pointer" data-product-id="${p.id}"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
    `
    )
    .join("");
}

favCartContainer.addEventListener("click", (e) => {
  const removeButton = e.target.closest(".remove-fav-btn");
  if (removeButton) {
    e.preventDefault();
    const productId = removeButton.dataset.productId;

    let favProducts = getFavProducts();
    favProducts = favProducts.filter((p) => p.id != productId);
    saveFavProducts(favProducts);

    displayProFav();
    updateFavCount();

    const productButton = document.querySelector(`.product-id-${productId}`);

    if (productButton) {
      productButton.classList.remove("text-red-600");
      productButton.querySelector("i").classList.remove("fa-solid");
      productButton.querySelector("i").classList.add("fa-regular");
    }
  }
});

const searchProductBtn = document.querySelector(".searchProductBtn");
const searchProduct = document.getElementById("searchProductInput");

searchProductBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchValue = searchProduct.value;

  if (searchValue) {
    localStorage.setItem("recentSearch", searchValue);
    window.location.href = `../public/searchContainer.html?search=${searchValue}`;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchProductBtn.click();
  }
});
