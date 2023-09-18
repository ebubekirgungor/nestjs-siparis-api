const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const categories = require('./categories.json');
const products = require('./products.json');
async function main() {
  for (var i = 0; i < categories.length; i++) {
    await prisma.categories.upsert({
      where: { id: categories[i].id },
      update: {},
      create: {
        title: categories[i].title,
      },
    });
  }
  for (var i = 0; i < products.length; i++) {
    await prisma.products.upsert({
      where: { id: products[i].id },
      update: {},
      create: {
        title: products[i].title,
        category_id: products[i].category_id,
        author: products[i].author,
        list_price: products[i].list_price,
        stock_quantity: products[i].stock_quantity,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
