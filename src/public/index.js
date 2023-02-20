const btn = document.querySelector(".productsContainer");

async function addToCart(id) {
  await fetch(`api/cart/63f12e9a3dcd14466d2d0ed7/product/${id}`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
  });
  Swal.fire({
    toast: true,
    icon: "success",
    position: "center",
    html: "Producto agregado con exito",
    timer: 1000,
    showConfirmButton: false,
  });
}