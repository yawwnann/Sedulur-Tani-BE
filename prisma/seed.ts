import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.paymentNotification.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.checkout.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.userAddress.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✅ Old data cleared");

  // Create seller users
  const password = await bcrypt.hash("password123", 10);

  console.log("👤 Creating users...");
  const seller1 = await prisma.user.create({
    data: {
      email: "seller1@example.com",
      password_hash: password,
      name: "Toko Pupuk Tani Jaya",
      phone: "081234567890",
      role: "seller",
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: "seller2@example.com",
      password_hash: password,
      name: "Agro Pupuk Nusantara",
      phone: "081234567891",
      role: "seller",
    },
  });

  const seller3 = await prisma.user.create({
    data: {
      email: "seller3@example.com",
      password_hash: password,
      name: "Pupuk Organik Indonesia",
      phone: "081234567892",
      role: "seller",
    },
  });

  console.log("✅ Sellers created");

  // Create products with categories
  console.log("🛒 Creating products...");
  const products = [
    // Pupuk Urea
    {
      name: "Pupuk Urea 50kg",
      description:
        "Pupuk urea berkualitas tinggi dengan kandungan nitrogen 46% untuk pertumbuhan vegetatif tanaman",
      category: "Pupuk Urea",
      weight: 50000,
      price: 210000,
      stock: 100,
      image_url:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500",
      seller_id: seller1.id,
    },
    {
      name: "Pupuk Urea 25kg",
      description: "Pupuk urea kemasan praktis untuk lahan kecil dan menengah",
      category: "Pupuk Urea",
      weight: 25000,
      price: 110000,
      stock: 150,
      image_url:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500",
      seller_id: seller2.id,
    },
    {
      name: "Pupuk Urea Subsidi 50kg",
      description: "Pupuk urea bersubsidi pemerintah untuk petani Indonesia",
      category: "Pupuk Urea",
      weight: 50000,
      price: 180000,
      stock: 200,
      image_url:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500",
      seller_id: seller1.id,
    },

    // Pupuk NPK
    {
      name: "Pupuk NPK Phonska 50kg",
      description:
        "Pupuk NPK lengkap dengan kandungan N, P, K seimbang untuk semua jenis tanaman",
      category: "Pupuk NPK",
      weight: 50000,
      price: 275000,
      stock: 120,
      image_url:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500",
      seller_id: seller2.id,
    },
    {
      name: "Pupuk NPK 16-16-16 25kg",
      description:
        "Pupuk NPK majemuk dengan kandungan seimbang untuk pertumbuhan optimal",
      category: "Pupuk NPK",
      weight: 25000,
      price: 145000,
      stock: 90,
      image_url:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500",
      seller_id: seller3.id,
    },
    {
      name: "Pupuk NPK Mutiara 50kg",
      description: "Pupuk NPK berkualitas premium untuk hasil panen maksimal",
      category: "Pupuk NPK",
      weight: 50000,
      price: 290000,
      stock: 80,
      image_url:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500",
      seller_id: seller1.id,
    },

    // Pupuk Kandang
    {
      name: "Pupuk Kandang Kambing 25kg",
      description:
        "Pupuk kandang kambing organik, sudah difermentasi dan siap pakai",
      category: "Pupuk Kandang",
      weight: 25000,
      price: 45000,
      stock: 150,
      image_url:
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=500",
      seller_id: seller3.id,
    },
    {
      name: "Pupuk Kandang Sapi 50kg",
      description:
        "Pupuk kandang sapi organik kaya nutrisi untuk kesuburan tanah",
      category: "Pupuk Kandang",
      weight: 50000,
      price: 65000,
      stock: 130,
      image_url:
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=500",
      seller_id: seller2.id,
    },
    {
      name: "Pupuk Kandang Ayam Premium 25kg",
      description:
        "Pupuk kandang ayam premium dengan kandungan nitrogen tinggi",
      category: "Pupuk Kandang",
      weight: 25000,
      price: 55000,
      stock: 100,
      image_url:
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=500",
      seller_id: seller1.id,
    },

    // Pupuk Kompos
    {
      name: "Pupuk Kompos Organik 20kg",
      description:
        "Pupuk kompos organik dari bahan alami untuk meningkatkan kesuburan tanah",
      category: "Pupuk Kompos",
      weight: 20000,
      price: 35000,
      stock: 110,
      image_url:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
      seller_id: seller3.id,
    },
    {
      name: "Pupuk Kompos Daun 25kg",
      description:
        "Pupuk kompos dari daun-daunan, kaya humus untuk media tanam",
      category: "Pupuk Kompos",
      weight: 25000,
      price: 40000,
      stock: 95,
      image_url:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
      seller_id: seller2.id,
    },
    {
      name: "Pupuk Kompos Premium 50kg",
      description: "Pupuk kompos berkualitas tinggi sudah matang sempurna",
      category: "Pupuk Kompos",
      weight: 50000,
      price: 75000,
      stock: 70,
      image_url:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
      seller_id: seller1.id,
    },

    // Pupuk TSP
    {
      name: "Pupuk TSP (Triple Super Phosphate) 50kg",
      description:
        "Pupuk TSP dengan kandungan fosfor tinggi untuk pembungaan dan pembuahan",
      category: "Pupuk TSP",
      weight: 50000,
      price: 320000,
      stock: 75,
      image_url:
        "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500",
      seller_id: seller2.id,
    },
    {
      name: "Pupuk TSP 25kg",
      description: "Pupuk fosfat untuk merangsang pertumbuhan akar dan buah",
      category: "Pupuk TSP",
      weight: 25000,
      price: 165000,
      stock: 60,
      image_url:
        "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500",
      seller_id: seller1.id,
    },

    // Pupuk KCL
    {
      name: "Pupuk KCL (Kalium Klorida) 50kg",
      description:
        "Pupuk kalium untuk meningkatkan kualitas dan ketahanan hasil panen",
      category: "Pupuk KCL",
      weight: 50000,
      price: 285000,
      stock: 85,
      image_url:
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500",
      seller_id: seller3.id,
    },
    {
      name: "Pupuk KCL 25kg",
      description:
        "Pupuk kalium untuk memperkuat batang dan meningkatkan rasa buah",
      category: "Pupuk KCL",
      weight: 25000,
      price: 150000,
      stock: 70,
      image_url:
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500",
      seller_id: seller2.id,
    },

    // Pupuk Organik Cair
    {
      name: "POC (Pupuk Organik Cair) 5 Liter",
      description: "Pupuk organik cair untuk pemupukan lewat daun dan akar",
      category: "Pupuk Organik Cair",
      weight: 5000,
      price: 85000,
      stock: 120,
      image_url:
        "https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?w=500",
      seller_id: seller3.id,
    },
    {
      name: "POC Mikroorganisme 10 Liter",
      description:
        "Pupuk cair dengan mikroorganisme aktif untuk kesuburan tanah",
      category: "Pupuk Organik Cair",
      weight: 10000,
      price: 165000,
      stock: 80,
      image_url:
        "https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?w=500",
      seller_id: seller1.id,
    },
    {
      name: "POC Herbafarm 5 Liter",
      description: "Pupuk organik cair untuk tanaman sayuran dan buah",
      category: "Pupuk Organik Cair",
      weight: 5000,
      price: 95000,
      stock: 100,
      image_url:
        "https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?w=500",
      seller_id: seller2.id,
    },

    // Pupuk Hayati
    {
      name: "Pupuk Hayati Azolla 1kg",
      description:
        "Pupuk hayati dari azolla untuk meningkatkan nitrogen di sawah",
      category: "Pupuk Hayati",
      weight: 1000,
      price: 45000,
      stock: 90,
      image_url:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500",
      seller_id: seller3.id,
    },
    {
      name: "Pupuk Hayati Rhizobium 500g",
      description:
        "Pupuk hayati dengan bakteri pengikat nitrogen untuk kacang-kacangan",
      category: "Pupuk Hayati",
      weight: 500,
      price: 65000,
      stock: 60,
      image_url:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500",
      seller_id: seller1.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ ${products.length} products created with categories`);

  // Create a buyer user
  const buyer = await prisma.user.create({
    data: {
      email: "buyer@example.com",
      password_hash: password,
      name: "Pak Tani",
      phone: "081234567893",
      role: "buyer",
    },
  });

  // Create address for buyer
  await prisma.userAddress.create({
    data: {
      user_id: buyer.id,
      label: "Rumah",
      recipient_name: "Pak Tani",
      phone: "081234567893",
      address_line: "Jl. Raya Pertanian No. 123",
      city: "Semarang",
      province: "Jawa Tengah",
      postal_code: "50123",
      is_default: true,
    },
  });

  console.log("✅ Buyer and address created");

  console.log("\n🎉 Seeding finished successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Products: ${await prisma.product.count()}`);
  console.log(`   - Addresses: ${await prisma.userAddress.count()}`);
  console.log("\n🔑 Test Credentials:");
  console.log("   Seller 1: seller1@example.com / password123");
  console.log("   Seller 2: seller2@example.com / password123");
  console.log("   Seller 3: seller3@example.com / password123");
  console.log("   Buyer: buyer@example.com / password123");
  console.log("\n📦 Product Categories:");
  console.log("   - Pupuk Urea (3 products)");
  console.log("   - Pupuk NPK (3 products)");
  console.log("   - Pupuk Kandang (3 products)");
  console.log("   - Pupuk Kompos (3 products)");
  console.log("   - Pupuk TSP (2 products)");
  console.log("   - Pupuk KCL (2 products)");
  console.log("   - Pupuk Organik Cair (3 products)");
  console.log("   - Pupuk Hayati (2 products)");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
