// 1. Dữ liệu mảng sản phẩm (6 sản phẩm)
const products = [
  {
    id: 1,
    name: "iPhone 16 Pro Max 256GB",
    category: "Điện thoại",
    price: 34990000,
    description: "Chip A18 Pro mạnh mẽ, khung viền Titan siêu nhẹ, camera nâng cấp.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "MacBook Air M3 13 inch",
    category: "Laptop",
    price: 27490000,
    description: "Thiết kế mỏng nhẹ, pin lên đến 18 giờ, hiệu năng xử lý đồ họa mượt mà.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Tai nghe Sony WH-1000XM5",
    category: "Âm thanh",
    price: 7990000,
    description: "Chống ồn chủ động hàng đầu, âm thanh Hi-Res, đàm thoại rõ nét.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Bàn phím cơ Keychron K2 Pro",
    category: "Phụ kiện",
    price: 2350000,
    description: "Hỗ trợ QMK/VIA, kết nối Bluetooth 5.1 đa thiết bị, switch gõ êm.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Apple Watch Series 10",
    category: "Đồng hồ thông minh",
    price: 10990000,
    description: "Màn hình OLED góc rộng sáng hơn, theo dõi sức khỏe và nhịp tim 24/7.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Chuột không dây Logitech MX Master 3S",
    category: "Phụ kiện",
    price: 2490000,
    description: "Cảm biến 8000 DPI hoạt động trên mọi bề mặt, cuộn điện từ siêu tốc.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80"
  }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const errorMessage = document.getElementById("errorMessage");

// Định dạng tiền tệ VNĐ
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

// 2. Hàm render danh sách sản phẩm an toàn bằng DOM API
function renderProducts(list, keyword = "") {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    // Dùng textContent để ngăn XSS tuyệt đối khi hiển thị lại từ khóa người dùng nhập
    errorMessage.textContent = `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${keyword}".`;
    errorMessage.classList.remove("hidden");
    return;
  }

  errorMessage.classList.add("hidden");

  const fragment = document.createDocumentFragment();

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.className = "product-image";
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.category;

    const title = document.createElement("h2");
    title.className = "product-title";
    title.textContent = product.name;

    const desc = document.createElement("p");
    desc.className = "product-desc";
    desc.textContent = product.description;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatCurrency(product.price);

    info.append(category, title, desc, price);
    card.append(img, info);
    fragment.appendChild(card);
  });

  productGrid.appendChild(fragment);
}

// 3. Hàm chuẩn hóa chuỗi & tìm kiếm
function normalizeText(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Hỗ trợ tìm không dấu
}

function handleSearch() {
  const rawKeyword = searchInput.value;
  const cleanKeyword = rawKeyword.trim();

  if (!cleanKeyword) {
    renderProducts(products);
    return;
  }

  const normalizedQuery = normalizeText(cleanKeyword);

  const filtered = products.filter((item) =>
    normalizeText(item.name).includes(normalizedQuery)
  );

  renderProducts(filtered, cleanKeyword);
}

// 4. Kỹ thuật Debounce tối ưu hiệu năng khi gõ phím
function debounce(fn, delay = 250) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

searchInput.addEventListener("input", debounce(handleSearch, 250));

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderProducts(products);
  searchInput.focus();
});

// Hiển thị toàn bộ sản phẩm khi tải trang lần đầu
renderProducts(products);

