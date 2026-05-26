import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "petshop_db",
  port: process.env.DB_PORT || 3306,
});

async function runSeed() {
  console.log("Memulai proses seeding database...");
  try {
    // 1. Drop existing tables if they exist to start fresh
    await db.query("DROP TABLE IF EXISTS order_items;");
    await db.query("DROP TABLE IF EXISTS orders;");
    await db.query("DROP TABLE IF EXISTS products;");
    await db.query("DROP TABLE IF EXISTS services;");
    await db.query("DROP TABLE IF EXISTS members;");
    console.log("Tabel lama berhasil di-drop.");

    // 2. Create services table
    await db.query(`
      CREATE TABLE \`services\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`subtitle\` VARCHAR(255) NOT NULL,
        \`price\` DECIMAL(10,2) NOT NULL,
        \`description\` TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabel 'services' berhasil dibuat.");

    // 3. Populate services
    const services = [
      ["Professional Grooming", "PEMANDIAN & CUKUR BULU RAPI", 75000, "Pemandian air hangat menggunakan sampo organik anti-kutu, pengeringan higienis, cukur bulu estetis, serta pembersihan telinga."],
      ["Cozy Pet Hotel", "PENITIPAN MEWAH BER-AC", 50000, "Penitipan hewan ber-AC dengan kasur tidur nyaman, jadwal bermain interaktif, makanan super-premium, dan CCTV 24 jam."],
      ["Veterinary Consultation", "KONSULTASI MEDIS & VAKSIN", 120000, "Pemeriksaan kesehatan, vaksinasi berkala, pengobatan ringan, serta konsultasi langsung dengan dokter hewan profesional."],
      ["Obedience Pet Training", "PELATIHAN HEWAN TERARAH", 200000, "Pelatihan perilaku dasar seperti duduk, diam, datang saat dipanggil, hingga pembentukan kebiasaan positif."]
    ];
    for (const s of services) {
      await db.query("INSERT INTO services (name, subtitle, price, description) VALUES (?, ?, ?, ?)", s);
    }
    console.log("Data 'services' berhasil diisi.");

    // 4. Create products table
    await db.query(`
      CREATE TABLE \`products\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`price\` DECIMAL(10,2) NOT NULL,
        \`rating\` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
        \`review_count\` INT NOT NULL DEFAULT 0,
        \`description\` TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabel 'products' berhasil dibuat.");

    // 5. Populate products
    const products = [
      ["Whiskas Premium Choice", "MAKANAN", 185000, 5.0, 120, "Makanan basah bergizi tinggi untuk kucing dewasa, menjaga kesehatan bulu, pencernaan, dan daya tahan tubuh."],
      ["Dino Cozy Cat Condo", "AKSESORIS", 350000, 4.9, 84, "Rumah pohon kucing minimalis modern dengan tiang garukan premium dan area tidur nyaman."],
      ["Dog Chew Bone Toy", "MAINAN", 45000, 4.8, 96, "Mainan kunyah tulang karet TPR elastis food-grade untuk melatih gigi dan mengurangi stres anjing."],
      ["Organic Honey Shampoo", "KESEHATAN", 85000, 5.0, 63, "Sampo organik berbahan madu dan aloe vera untuk melembutkan bulu serta menjaga kulit tetap sehat."]
    ];
    for (const p of products) {
      await db.query("INSERT INTO products (name, category, price, rating, review_count, description) VALUES (?, ?, ?, ?, ?, ?)", p);
    }
    console.log("Data 'products' berhasil diisi.");

    // 6. Create orders table
    await db.query(`
      CREATE TABLE \`orders\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`customer_name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50) NOT NULL,
        \`total_price\` DECIMAL(10,2) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabel 'orders' berhasil dibuat.");

    // 7. Create order_items table
    await db.query(`
      CREATE TABLE \`order_items\` (
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
    console.log("Tabel 'order_items' berhasil dibuat.");

    // 8. Create members table
    await db.query(`
      CREATE TABLE \`members\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`owner_name\` VARCHAR(255) NOT NULL,
        \`pet_name\` VARCHAR(255) NOT NULL,
        \`pet_type\` VARCHAR(100) NOT NULL,
        \`phone\` VARCHAR(50) NOT NULL,
        \`package_type\` VARCHAR(100) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabel 'members' berhasil dibuat.");

    console.log("Seeding database PawCare selesai dengan sukses!");
    process.exit(0);
  } catch (err) {
    console.error("Gagal melakukan seeding database:", err);
    process.exit(1);
  }
}

runSeed();
