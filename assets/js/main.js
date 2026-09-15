/**
 * Bari Farm - Main Interactive JavaScript
 * Menangani pemilihan varian produk, kalkulator harga, interaksi modal,
 * drawer navigasi mobile responsif, dan pembentukan pesan WhatsApp otomatis.
 */

// Konfigurasi Nomor WhatsApp Bari Farm
const BARI_FARM_WA_NUMBER = "6289508781642"; // Nomor WhatsApp aktif Bari Farm

// Data Varian Produk
const PRODUCTS_DATA = {
  chicken: {
    name: "Daging Ayam Kampung Segar",
    variants: {
      "karkas-800": {
        title: "Karkas Muda (800g - 900g)",
        price: 58000,
        badge: "Paling Pas 2-3 Porsi",
        desc: "Ayam kampung muda segar utuh lengkap dengan kepala & ceker bersih. Daging empuk, cocok untuk ayam goreng kremes atau panggang.",
        weight: "±850 gram"
      },
      "karkas-1000": {
        title: "Karkas Standar (1.0kg - 1.1kg)",
        price: 68000,
        badge: "Paling Favorit ⭐",
        desc: "Ukuran ideal keluarga dengan serat daging padat berisi, gurih alami, sangat lezat untuk sop ayam herbal & opor tradisi.",
        weight: "±1050 gram"
      },
      "potong-4": {
        title: "Potong 4 Bagian (Vakum)",
        price: 70000,
        badge: "Praktis Siap Masak",
        desc: "Sudah dipotong rapi menjadi 4 bagian higienis (2 dada, 2 paha) + ati ampela bersih. Langsung cemplung ke panci tanpa repot.",
        weight: "±900 gram"
      },
      "potong-8": {
        title: "Potong 8 Bagian (Vakum)",
        price: 72000,
        badge: "Porsi Pas Sehari-hari",
        desc: "Dipotong 8 bagian presisi higienis dengan pemotong steril. Kemasan vakum kedap udara tahan segar lebih lama.",
        weight: "±950 gram"
      }
    }
  },
  egg: {
    name: "Telur Ayam Kampung Asli",
    variants: {
      "mika-10": {
        title: "Mika Higienis (Isi 10 Butir)",
        price: 28000,
        badge: "Panen Segar Pagi Ini",
        desc: "Telur ayam kampung murni kualitas grade-A. Kuning telur oranye kental kaya omega & beta-karoten, cangkang tebal bersih.",
        weight: "10 Butir"
      },
      "tray-30": {
        title: "Tray Karton Aman (Isi 30 Butir)",
        price: 82000,
        badge: "Hemat Mingguan Keluarga ⭐",
        desc: "Karton tray tebal ramah lingkungan pelindung benturan. Pilihan hemat untuk nutrisi harian seluruh anggota keluarga.",
        weight: "30 Butir (1 Tray)"
      },
      "tray-60": {
        title: "Paket 2 Tray (Isi 60 Butir)",
        price: 160000,
        badge: "Terbaik untuk Resto / Usaha",
        desc: "Kualitas konsisten untuk kebutuhan koki, pengusaha jamu/kuliner, atau stok bulanan dengan jaminan ganti bila pecah di jalan.",
        weight: "60 Butir (2 Tray)"
      }
    }
  }
};

// State Aplikasi
let currentChickenVariant = "karkas-1000";
let currentChickenQty = 1;

let currentEggVariant = "tray-30";
let currentEggQty = 1;

// Format Rupiah Helper
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
}

// Inisialisasi Event Listener setelah DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initChickenVariants();
  initEggVariants();
  initModal();
  initSmoothScroll();
});

// 1. Sticky Navbar & Mobile Drawer Menu Toggle
function initNavbar() {
  const navbar = document.getElementById("main-navbar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileMenuBackdrop = document.getElementById("mobile-menu-backdrop");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("navbar-scrolled");
    } else {
      navbar?.classList.remove("navbar-scrolled");
    }
  });

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener("click", closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
      closeModal();
    }
  });
}

// 2. Varian Daging Ayam
function initChickenVariants() {
  const buttons = document.querySelectorAll("[data-chicken-variant]");
  const priceEl = document.getElementById("chicken-price");
  const descEl = document.getElementById("chicken-desc");
  const badgeEl = document.getElementById("chicken-badge");
  const weightEl = document.getElementById("chicken-weight");
  const minusBtn = document.getElementById("chicken-qty-minus");
  const plusBtn = document.getElementById("chicken-qty-plus");
  const qtyEl = document.getElementById("chicken-qty");
  const orderBtn = document.getElementById("chicken-order-btn");

  function updateChickenUI() {
    const data = PRODUCTS_DATA.chicken.variants[currentChickenVariant];
    if (!data) return;

    if (priceEl) priceEl.textContent = formatRupiah(data.price);
    if (descEl) descEl.textContent = data.desc;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (weightEl) weightEl.textContent = data.weight;
    if (qtyEl) qtyEl.textContent = currentChickenQty;

    buttons.forEach(btn => {
      if (btn.getAttribute("data-chicken-variant") === currentChickenVariant) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentChickenVariant = btn.getAttribute("data-chicken-variant");
      updateChickenUI();
    });
  });

  if (minusBtn) {
    minusBtn.addEventListener("click", () => {
      if (currentChickenQty > 1) {
        currentChickenQty--;
        updateChickenUI();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener("click", () => {
      currentChickenQty++;
      updateChickenUI();
    });
  }

  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      const variantData = PRODUCTS_DATA.chicken.variants[currentChickenVariant];
      openQuickOrderModal({
        productKey: "chicken",
        productName: PRODUCTS_DATA.chicken.name,
        variantKey: currentChickenVariant,
        variantTitle: variantData.title,
        price: variantData.price,
        qty: currentChickenQty
      });
    });
  }

  updateChickenUI();
}

// 3. Varian Telur Ayam
function initEggVariants() {
  const buttons = document.querySelectorAll("[data-egg-variant]");
  const priceEl = document.getElementById("egg-price");
  const descEl = document.getElementById("egg-desc");
  const badgeEl = document.getElementById("egg-badge");
  const weightEl = document.getElementById("egg-weight");
  const minusBtn = document.getElementById("egg-qty-minus");
  const plusBtn = document.getElementById("egg-qty-plus");
  const qtyEl = document.getElementById("egg-qty");
  const orderBtn = document.getElementById("egg-order-btn");

  function updateEggUI() {
    const data = PRODUCTS_DATA.egg.variants[currentEggVariant];
    if (!data) return;

    if (priceEl) priceEl.textContent = formatRupiah(data.price);
    if (descEl) descEl.textContent = data.desc;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (weightEl) weightEl.textContent = data.weight;
    if (qtyEl) qtyEl.textContent = currentEggQty;

    buttons.forEach(btn => {
      if (btn.getAttribute("data-egg-variant") === currentEggVariant) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentEggVariant = btn.getAttribute("data-egg-variant");
      updateEggUI();
    });
  });

  if (minusBtn) {
    minusBtn.addEventListener("click", () => {
      if (currentEggQty > 1) {
        currentEggQty--;
        updateEggUI();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener("click", () => {
      currentEggQty++;
      updateEggUI();
    });
  }

  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      const variantData = PRODUCTS_DATA.egg.variants[currentEggVariant];
      openQuickOrderModal({
        productKey: "egg",
        productName: PRODUCTS_DATA.egg.name,
        variantKey: currentEggVariant,
        variantTitle: variantData.title,
        price: variantData.price,
        qty: currentEggQty
      });
    });
  }

  updateEggUI();
}

// 4. Modal Pemesanan Cepat & WhatsApp Generator
let modalOrderState = null;

function openQuickOrderModal(orderData) {
  modalOrderState = { ...orderData };
  const modal = document.getElementById("order-modal");
  const titleEl = document.getElementById("modal-product-title");
  const variantEl = document.getElementById("modal-variant-title");
  const unitPriceEl = document.getElementById("modal-unit-price");
  const qtyEl = document.getElementById("modal-qty");
  const totalEl = document.getElementById("modal-total-price");

  if (titleEl) titleEl.textContent = modalOrderState.productName;
  if (variantEl) variantEl.textContent = modalOrderState.variantTitle;
  if (unitPriceEl) unitPriceEl.textContent = formatRupiah(modalOrderState.price);
  if (qtyEl) qtyEl.textContent = modalOrderState.qty;
  
  updateModalTotal();

  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function updateModalTotal() {
  const totalEl = document.getElementById("modal-total-price");
  const qtyEl = document.getElementById("modal-qty");
  if (!modalOrderState) return;

  const total = modalOrderState.price * modalOrderState.qty;
  if (totalEl) totalEl.textContent = formatRupiah(total);
  if (qtyEl) qtyEl.textContent = modalOrderState.qty;
}

function closeModal() {
  const modal = document.getElementById("order-modal");
  if (modal) {
    modal.classList.add("hidden");
    // Hanya buka kembali scroll jika mobile menu juga sedang tertutup
    const mobileMenu = document.getElementById("mobile-menu");
    if (!mobileMenu || mobileMenu.classList.contains("hidden")) {
      document.body.style.overflow = "";
    }
  }
}

function initModal() {
  const modal = document.getElementById("order-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const minusBtn = document.getElementById("modal-qty-minus");
  const plusBtn = document.getElementById("modal-qty-plus");
  const sendWaBtn = document.getElementById("modal-submit-wa");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (minusBtn) {
    minusBtn.addEventListener("click", () => {
      if (modalOrderState && modalOrderState.qty > 1) {
        modalOrderState.qty--;
        updateModalTotal();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener("click", () => {
      if (modalOrderState) {
        modalOrderState.qty++;
        updateModalTotal();
      }
    });
  }

  if (sendWaBtn) {
    sendWaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!modalOrderState) return;

      const customerName = document.getElementById("customer-name")?.value.trim() || "-";
      const customerAddress = document.getElementById("customer-address")?.value.trim() || "-";
      const customerNotes = document.getElementById("customer-notes")?.value.trim() || "Standar";
      const totalAmount = formatRupiah(modalOrderState.price * modalOrderState.qty);

      const waMessage = 
`Halo Admin *Bari Farm*, saya ingin memesan produk segar berikut:

📦 *Detail Pesanan:*
• *Produk:* ${modalOrderState.productName}
• *Varian:* ${modalOrderState.variantTitle}
• *Jumlah:* ${modalOrderState.qty} paket
• *Estimasi Total:* ${totalAmount}

📍 *Data Pengiriman:*
• *Nama Pemesan:* ${customerName}
• *Alamat / Area:* ${customerAddress}
• *Catatan Tambahan:* ${customerNotes}

Apakah stok segar hari ini tersedia untuk dikirimkan via Sameday / Instant? Terima kasih! 🙏`;

      const encodedUrl = `https://wa.me/${BARI_FARM_WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      window.open(encodedUrl, "_blank");
      closeModal();
    });
  }
}

// 5. Smooth Scroll Navigation
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length <= 1) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}
