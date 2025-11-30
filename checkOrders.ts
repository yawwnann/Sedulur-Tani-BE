import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkOrders() {
  try {
    // 1. Check total orders
    const totalOrders = await prisma.order.count();
    console.log(`\n📊 Total Orders in Database: ${totalOrders}`);

    // 2. Get all orders with user info
    const orders = await prisma.order.findMany({
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        product: {
          select: {
            name: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log("\n📦 Sample Orders (Latest 5):");
    orders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order ID: ${order.id}`);
      console.log(`   - User: ${order.user.name} (${order.user.email}) [Role: ${order.user.role}]`);
      console.log(`   - User ID: ${order.user.id}`);
      console.log(`   - Product: ${order.product.name}`);
      console.log(`   - Seller: ${order.product.seller.name} (${order.product.seller.email})`);
      console.log(`   - Seller ID: ${order.product.seller.id}`);
      console.log(`   - Quantity: ${order.quantity}`);
      console.log(`   - Status: ${order.status}`);
    });

    // 3. Check unique users who have orders
    const uniqueBuyers = await prisma.order.findMany({
      select: {
        user_id: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      distinct: ['user_id']
    });

    console.log("\n👥 Unique Buyers with Orders:");
    uniqueBuyers.forEach(buyer => {
      console.log(`   - ${buyer.user.name} (${buyer.user.email}) - ID: ${buyer.user_id}`);
    });

    // 4. Check all users in database
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    console.log("\n👤 All Users in Database:");
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) [${user.role}] - ID: ${user.id}`);
    });

  } catch (error) {
    console.error("Error checking orders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();
