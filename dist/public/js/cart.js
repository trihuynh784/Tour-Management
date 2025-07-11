const deleteItem = () => {
  const buttonsDelete = document.querySelectorAll("[button-delete-tour]");

  buttonsDelete.forEach((buttonDelete) => {
    buttonDelete.addEventListener("click", () => {
      const tourId = buttonDelete.getAttribute("button-delete-tour");

      const cart = JSON.parse(localStorage.getItem("cart"));
      const newCart = cart.filter((item) => item.tourId != tourId);

      localStorage.setItem("cart", JSON.stringify(newCart));
      drawListTour();
    });
  });
};

// Realtime update price tour if it's change
const changeQuantity = () => {
  const quantityInputs = document.querySelectorAll("[name='quantity']");
  if (quantityInputs) {
    quantityInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const tourId = input.getAttribute("item-id");
        const quantity = parseInt(input.value);
        const cart = JSON.parse(localStorage.getItem("cart"));

        const isExistTour = cart.findIndex((item) => item.tourId == tourId);
        if (isExistTour == -1) {
          cart.push({
            tourId: tourId,
            quantity: quantity,
          });
        } else {
          cart[isExistTour].quantity = quantity;
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        drawListTour();
        updateCartRealtime();
      });
    });
  }
};
// End Realtime update price tour if it's change

// Give data of cart from localStorage and send to server by JSON
const drawListTour = () => {
  fetch("http://localhost:3000/cart/list-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: localStorage.getItem("cart"),
  })
    .then((res) => res.json())
    .then((data) => {
      const htmlsArray = data.tours.map((tour, index) => {
        return `
        <tr> 
          <td>${index + 1}</td>
          <td class="text-center"><img src="${tour.info.image}" alt="${
          tour.info.title
        }" width="120px"/></td>
          <td> <a href="/tours/detail/${tour.info.slug}">${
          tour.info.title
        }</a></td>
          <td>${tour.price_special.toLocaleString()}đ</td>
          <td> 
            <input class="form-control" type="number" min="1" max="${
              tour.info.stock
            }" value="${tour.quantity}" name="quantity" item-id="${
          tour.tourId
        }" style="width: 60px"/>
          </td>
          <td>${tour.total_price.toLocaleString()}đ</td>
          <td> 
            <button class="btn btn-sm btn-danger" button-delete-tour="${
              tour.tourId
            }">Xóa</button>
          </td>
        </tr>
      `;
      });

      const tbody = document.querySelector("[list-tour]");
      tbody.innerHTML = htmlsArray.join("");

      const totalPrice = data.tours.reduce(
        (total, tour) => total + tour.total_price,
        0
      );
      const totalPriceFlag = document.querySelector("[total-price]");
      totalPriceFlag.innerHTML = totalPrice.toLocaleString();

      changeQuantity();
      deleteItem();
    });
};
drawListTour();
// End Give data of cart from localStorage and send to server by JSON

// Order Tours
const formOrder = document.querySelector("form[form-order]");
if (formOrder) {
  formOrder.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = e.target.elements.fullName.value;
    const phone = e.target.elements.phone.value;
    const note = e.target.elements.note.value;

    const cart = JSON.parse(localStorage.getItem("cart"));

    const data = {
      infoUser: {
        fullName: fullName,
        phone: phone,
        note: note,
      },
      cart: cart,
    };

    fetch("/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          localStorage.removeItem("cart");
          window.location.href = `/order/success?orderCode=${data.orderCode}`
        } else {
          alert("Lỗi!!!")
        }
      });
  });
}
// End Order Tours
