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
  port: process.env.DB_PORT || 3306,
});

async function initializeDatabase() {
  try {
    // 1. Create orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`customer_name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50) NOT NULL,
        \`total_price\` DECIMAL(10,2) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabel 'orders' siap atau berhasil dibuat.");

    // 2. Create order_items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`order_items\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`order_id\` INT NOT NULL,
        \`product_id\` INT NOT NULL,
        \`product_name\` VARCHAR(255) NOT NULL,
        \`price\` DECIMAL(10,2) NOT NULL,
        \`quantity\` INT NOT NULL,
        \`subtotal\` DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabel 'order_items' siap atau berhasil dibuat.");

    // 3. Create services table
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`services\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`subtitle\` VARCHAR(255) NOT NULL,
        \`price\` DECIMAL(10,2) NOT NULL,
        \`description\` TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabel 'services' siap atau berhasil dibuat.");

    // 4. Prepopulate services if empty
    const [servicesRows] = await db.query("SELECT COUNT(*) as count FROM services");
    if (servicesRows[0].count === 0) {
      const defaultServices = [
        ["Professional Grooming", "Pemandian & Cukur Bulu Rapi", 75000, "Pemandian air hangat menggunakan sampo organik anti-kutu, pengeringan higienis, cukur bulu estetis, potong kuku, serta pembersihan telinga."],
        ["Cozy Pet Hotel", "Penitipan Mewah Ber-AC", 50000, "Penitipan hewan ber-AC dengan kasur tidur nyaman, jadwal bermain interaktif, makanan super-premium terjadwal, dan pengawasan kamera CCTV 24 jam."],
        ["Veterinary Consultation", "Konsultasi Medis & Vaksin", 120000, "Pemeriksaan kesehatan, pemberian vaksinasi berkala, pengobatan infeksi, saran nutrisi, serta penanganan darurat langsung oleh dokter hewan berlisensi."],
        ["Obedience Pet Training", "Pelatihan Hewan Terarah", 200000, "Program kepatuhan dasar (duduk, diam, datang saat dipanggil, jabat tangan) yang dibimbing oleh pelatih profesional berpengalaman dengan sistem kasih sayang."]
      ];
      for (const service of defaultServices) {
        await db.query("INSERT INTO services (name, subtitle, price, description) VALUES (?, ?, ?, ?)", service);
      }
      console.log("Prepopulasi data 'services' berhasil disisipkan.");
    }
  } catch (err) {
    console.error("Gagal melakukan inisialisasi database:", err.message);
  }
}

initializeDatabase();

app.get("/", (req, res) => {
  res.send("API Rifky PawCare berjalan");
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ message: "Backend dan MySQL berhasil terhubung" });
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
    const { owner_name, pet_name, pet_type, phone, package_type } = req.body;

    if (!owner_name || !pet_name || !pet_type || !phone || !package_type) {
      return res.status(400).json({
        message: "Semua data wajib diisi",
      });
    }

    const sql = `
      INSERT INTO members 
      (owner_name, pet_name, pet_type, phone, package_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [owner_name, pet_name, pet_type, phone, package_type]);

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

app.post("/api/orders", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { customer_name, phone, cartItems, totalPrice } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Keranjang masih kosong" });
    }

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      "INSERT INTO orders (customer_name, phone, total_price) VALUES (?, ?, ?)",
      [customer_name || "Guest", phone || "-", totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items 
        (order_id, product_id, product_name, price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.price * item.quantity,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Pesanan berhasil disimpan",
      order_id: orderId,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
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
