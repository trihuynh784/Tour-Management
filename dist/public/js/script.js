// Slider Tour Detail
try {
  var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  });
  var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: swiper,
    },
  });
} catch (error) {
  console.log(error);
}

// End Slider Tour Detail

// Alert
const alertToggle = () => {
  const alertAddCartSuccess = document.querySelector(
    "[alert-add-cart-success]"
  );

  if (alertAddCartSuccess) {
    alertAddCartSuccess.classList.remove("alert-hidden");
    setTimeout(() => {
      alertAddCartSuccess.classList.add("alert-hidden");
    }, 3000);
  }
};
const closeAlert = document.querySelector("[close-alert]");
if (closeAlert) {
  closeAlert.addEventListener("click", () => {
    const alertAddCartSuccess = document.querySelector(
      "[alert-add-cart-success]"
    );
    if (alertAddCartSuccess) {
      alertAddCartSuccess.classList.add("alert-hidden");
    }
  });
}
// End Alert

// Cart
const updateCartRealtime = () => {
  const cartQuantity = document.querySelector("[cart-quantity]");
  if (cartQuantity) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const quantity = cart ? cart.reduce((sum, item) => (sum += item.quantity), 0) : 0;

    cartQuantity.innerHTML = quantity;
  }
};
updateCartRealtime();
// End Cart

// Cart
const cart = localStorage.getItem("cart");
if (!cart) {
  localStorage.setItem("cart", JSON.stringify([]));
}
const formAddToCart = document.querySelector("form[form-add-to-cart]");
if (formAddToCart) {
  formAddToCart.addEventListener("submit", (e) => {
    e.preventDefault();
    const tourId = parseInt(formAddToCart.getAttribute("tour-id"));
    const quantity = parseInt(e.target.elements.quantity.value);

    if (tourId && quantity > 0) {
      const cart = JSON.parse(localStorage.getItem("cart"));

      const isExistTour = cart.findIndex((item) => item.tourId == tourId);
      if (isExistTour == -1) {
        cart.push({
          tourId: tourId,
          quantity: quantity,
        });
      } else {
        cart[isExistTour].quantity += quantity;
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartRealtime();
      alertToggle();
    }
  });
}
// End Cart