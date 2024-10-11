//Tính năng thông báo
const alertMessage = document.querySelector("[alert-message]");
if (alertMessage) {
  setTimeout(() => {
    alertMessage.style.display = "none";
  }, 3000);
}

//Cập nhật số lượng sản phẩm trong giỏ hàng
const tableCart = document.querySelector("[table-cart]");
if (tableCart) {
  const inputQuantity = tableCart.querySelectorAll("input");
  inputQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const quantity = input.value;
      const productId = input.getAttribute("item-id");
      axios.patch("/cart/update", { quantity, productId }).then((res) => {
        if (res.status === 200) {
          location.reload();
        }
      });
    });
  });
}
