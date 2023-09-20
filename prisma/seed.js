const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const categories = require('./categories.json');
const products = require('./products.json');
const campaigns = require('./campaigns.json');
const users = require('./users.json');
async function main() {
  for (var i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: { id: categories[i].id },
      update: {},
      create: {
        title: categories[i].title,
      },
    });
  }
  for (var i = 0; i < products.length; i++) {
    await prisma.product.upsert({
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
  for (var i = 0; i < campaigns.length; i++) {
    await prisma.campaign.upsert({
      where: { id: campaigns[i].id },
      update: {},
      create: {
        description: campaigns[i].description,
        min_purchase_price: campaigns[i].min_purchase_price,
        min_purchase_quantity: campaigns[i].min_purchase_quantity,
        discount_quantity: campaigns[i].discount_quantity,
        discount_percent: campaigns[i].discount_percent,
        rule_author: campaigns[i].rule_author,
        rule_category: campaigns[i].rule_category,
      },
    });
  }
  for (var i = 0; i < users.length; i++) {
    await prisma.user.upsert({
      where: { id: users[i].id },
      update: {},
      create: {
        username: users[i].username,
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
