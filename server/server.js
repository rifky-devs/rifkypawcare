import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "petshop_db",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

/*
  FORMAT VALIDASI
  - Nama: huruf, spasi, titik, apostrof, tanda hubung
  - Nama hewan: huruf, angka, spasi, titik, apostrof, tanda hubung
  - Nomor HP: wajib 08 dan total 10 sampai 15 digit
*/

const nameRegex = /^[A-Za-zÀ-ÿ\s.'-]{3,60}$/;
const petNameRegex = /^[A-Za-zÀ-ÿ0-9\s.'-]{2,40}$/;
const phoneRegex = /^08[0-9]{8,13}$/;

const allowedPetTypes = ["Kucing", "Anjing"];
const allowedPackages = ["Silver Paw", "Gold Paw", "Platinum Paw"];

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidName(value) {
  return nameRegex.test(cleanText(value));
}

function isValidPetName(value) {
  return petNameRegex.test(cleanText(value));
}

function isValidPhone(value) {
  return phoneRegex.test(cleanText(value));
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function normalizeCartItems(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return null;
  }

  const normalizedItems = [];

  for (const item of cartItems) {
    const productId = Number(item.id);
    const quantity = Number(item.quantity);

    if (!isPositiveInteger(productId) || !isPositiveInteger(quantity)) {
      return null;
    }

    if (quantity > 99) {
      return null;
    }

    normalizedItems.push({
      productId,
      quantity,
    });
  }

  return normalizedItems;
}

async function initializeDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        owner_name VARCHAR(255) NOT NULL,
        pet_name VARCHAR(255) NOT NULL,
        pet_type VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        package_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [productRows] = await db.query("SELECT COUNT(*) AS count FROM products");

    if (productRows[0].count === 0) {
      const defaultProducts = [
        [
          "Royal Canin Cat Food",
          85000,
          "Makanan kucing premium dengan nutrisi seimbang.",
        ],
        [
          "Dog Dry Food Premium",
          95000,
          "Makanan anjing kering berkualitas tinggi.",
        ],
        [
          "Pet Shampoo Anti Kutu",
          45000,
          "Sampo hewan untuk membantu membersihkan kutu.",
        ],
        [
          "Cat Litter Sand",
          60000,
          "Pasir kucing higienis dan mudah dibersihkan.",
        ],
      ];

      await db.query(
        "INSERT INTO products (name, price, description) VALUES ?",
        [defaultProducts]
      );
    }

    const [serviceRows] = await db.query("SELECT COUNT(*) AS count FROM services");

    if (serviceRows[0].count === 0) {
      const defaultServices = [
        [
          "Professional Grooming",
          "Pemandian & Cukur Bulu Rapi",
          75000,
          "Pemandian air hangat, sampo organik, cukur bulu, potong kuku, dan pembersihan telinga.",
        ],
        [
          "Cozy Pet Hotel",
          "Penitipan Mewah Ber-AC",
          50000,
          "Penitipan hewan ber-AC dengan jadwal makan, bermain, dan pengawasan.",
        ],
        [
          "Veterinary Consultation",
          "Konsultasi Medis & Vaksin",
          120000,
          "Pemeriksaan kesehatan, vaksinasi, pengobatan, dan saran nutrisi.",
        ],
        [
          "Obedience Pet Training",
          "Pelatihan Hewan Terarah",
          200000,
          "Program pelatihan kepatuhan dasar untuk hewan peliharaan.",
        ],
      ];

      await db.query(
        "INSERT INTO services (name, subtitle, price, description) VALUES ?",
        [defaultServices]
      );
    }

    console.log("Database siap digunakan.");
  } catch (error) {
    console.error("Gagal inisialisasi database:", error.message);
  }
}

initializeDatabase();

app.get("/", (req, res) => {
  res.send("API Rifky PawCare berjalan");
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      message: "Backend dan MySQL berhasil terhubung",
    });
  } catch (error) {
    res.status(500).json({
      message: "Database gagal terhubung",
      error: error.message,
    });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data produk",
      error: error.message,
    });
  }
});

app.get("/api/services", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data layanan",
      error: error.message,
    });
  }
});

app.get("/api/members", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM members ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data member",
      error: error.message,
    });
  }
});

app.post("/api/members", async (req, res) => {
  try {
    const ownerName = cleanText(req.body.owner_name);
    const petName = cleanText(req.body.pet_name);
    const petType = cleanText(req.body.pet_type);
    const phone = cleanText(req.body.phone);
    const packageType = cleanText(req.body.package_type);

    if (!ownerName || !petName || !petType || !phone || !packageType) {
      return res.status(400).json({
        message: "Semua data wajib diisi.",
      });
    }

    if (!isValidName(ownerName)) {
      return res.status(400).json({
        message:
          "Nama pemilik tidak valid. Gunakan minimal 3 karakter dan hanya boleh berisi huruf, spasi, titik, apostrof, atau tanda hubung.",
      });
    }

    if (!isValidPetName(petName)) {
      return res.status(400).json({
        message:
          "Nama hewan tidak valid. Gunakan 2 sampai 40 karakter dan hanya boleh berisi huruf, angka, spasi, titik, apostrof, atau tanda hubung.",
      });
    }

    if (!allowedPetTypes.includes(petType)) {
      return res.status(400).json({
        message: "Jenis hewan tidak valid.",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message:
          "Nomor WhatsApp tidak valid. Nomor harus diawali 08 dan berisi 10 sampai 15 digit angka.",
      });
    }

    if (!allowedPackages.includes(packageType)) {
      return res.status(400).json({
        message: "Paket membership tidak valid.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO members
      (owner_name, pet_name, pet_type, phone, package_type)
      VALUES (?, ?, ?, ?, ?)
      `,
      [ownerName, petName, petType, phone, packageType]
    );

    res.status(201).json({
      message: "Pendaftaran member berhasil",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menyimpan data member",
      error: error.message,
    });
  }
});

app.post("/api/orders", async (req, res) => {
  const customerName = cleanText(req.body.customer_name);
  const phone = cleanText(req.body.phone);
  const cartItems = normalizeCartItems(req.body.cartItems);

  if (!isValidName(customerName)) {
    return res.status(400).json({
      message:
        "Nama pelanggan tidak valid. Gunakan minimal 3 karakter dan hanya boleh berisi huruf, spasi, titik, apostrof, atau tanda hubung.",
    });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({
      message:
        "Nomor WhatsApp tidak valid. Nomor harus diawali 08 dan berisi 10 sampai 15 digit angka.",
    });
  }

  if (!cartItems) {
    return res.status(400).json({
      message: "Keranjang tidak valid atau masih kosong.",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let totalPrice = 0;
    const validOrderItems = [];

    for (const item of cartItems) {
      const [productRows] = await connection.query(
        "SELECT id, name, price FROM products WHERE id = ? LIMIT 1",
        [item.productId]
      );

      if (productRows.length === 0) {
        throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
      }

      const product = productRows[0];
      const productPrice = Number(product.price);
      const subtotal = productPrice * item.quantity;

      if (!Number.isFinite(productPrice) || productPrice <= 0) {
        throw new Error(`Harga produk ${product.name} tidak valid.`);
      }

      totalPrice += subtotal;

      validOrderItems.push({
        productId: product.id,
        productName: product.name,
        price: productPrice,
        quantity: item.quantity,
        subtotal,
      });
    }

    if (totalPrice <= 0) {
      throw new Error("Total harga tidak valid.");
    }

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders
      (customer_name, phone, total_price)
      VALUES (?, ?, ?)
      `,
      [customerName, phone, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of validOrderItems) {
      await connection.query(
        `
        INSERT INTO order_items
        (order_id, product_id, product_name, price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
          item.subtotal,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Pesanan berhasil disimpan",
      order_id: orderId,
      total_price: totalPrice,
    });
  } catch (error) {
    await connection.rollback();

    res.status(400).json({
      message: "Gagal menyimpan pesanan",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});