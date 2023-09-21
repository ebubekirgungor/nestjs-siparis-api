function get_available_campaigns(campaigns, products) {
  const available_campaigns = [];
  for (const campaign of campaigns) {
    const conditions =
      (campaign.rule_author &&
        campaign.rule_category &&
        campaign.min_purchase_quantity &&
        campaign.discount_quantity &&
        products.filter(
          (product) =>
            product.author === campaign.rule_author &&
            product.category.title === campaign.rule_category,
        ).length >= campaign.min_purchase_quantity) ||
      (campaign.rule_author &&
        campaign.rule_category &&
        campaign.min_purchase_quantity &&
        campaign.discount_percent &&
        products.filter(
          (product) =>
            product.author === campaign.rule_author &&
            product.category.title === campaign.rule_category,
        ).length >= campaign.min_purchase_quantity) ||
      (campaign.rule_category &&
        !campaign.rule_author &&
        campaign.min_purchase_quantity &&
        campaign.discount_quantity &&
        products.filter(
          (product) => product.category.title === campaign.rule_category,
        ).length >= campaign.min_purchase_quantity) ||
      (campaign.rule_author &&
        !campaign.rule_category &&
        campaign.min_purchase_quantity &&
        campaign.discount_quantity &&
        products.filter((product) => product.author === campaign.rule_author)
          .length >= campaign.min_purchase_quantity) ||
      (campaign.rule_category &&
        !campaign.rule_author &&
        campaign.min_purchase_quantity &&
        campaign.discount_percent &&
        products.filter(
          (product) => product.category.title === campaign.rule_category,
        ).length >= campaign.min_purchase_quantity) ||
      (campaign.rule_author &&
        !campaign.rule_category &&
        campaign.min_purchase_quantity &&
        campaign.discount_percent &&
        products.filter((product) => product.author === campaign.rule_author)
          .length >= campaign.min_purchase_quantity) ||
      (campaign.min_purchase_quantity &&
        campaign.discount_quantity &&
        !campaign.rule_category &&
        !campaign.rule_author &&
        products.length >= campaign.min_purchase_quantity) ||
      (campaign.min_purchase_quantity &&
        campaign.discount_percent &&
        !campaign.rule_category &&
        !campaign.rule_author &&
        products.length >= campaign.min_purchase_quantity) ||
      (campaign.min_purchase_price &&
        products.reduce((sum, product) => sum + product.list_price, 0) >=
          campaign.min_purchase_price);

    if (conditions) {
      if (campaign.discount_percent != null) {
        available_campaigns.push({
          id: campaign.id,
          discount_percent: campaign.discount_percent,
          rule_author: campaign.rule_author,
          rule_category: campaign.rule_category,
        });
      } else if (campaign.discount_quantity != null) {
        available_campaigns.push({
          id: campaign.id,
          discount_quantity: campaign.discount_quantity,
          rule_author: campaign.rule_author,
          rule_category: campaign.rule_category,
        });
      }
    }
  }
  return available_campaigns;
}

function get_discounted_total_price(campaign, products, total_price) {
  if (campaign.discount_percent != null) {
    const discounted_price =
      total_price - (total_price * campaign.discount_percent) / 100;
    return discounted_price;
  } else if (campaign.discount_quantity != null) {
    const { rule_author, rule_category, discount_quantity } = campaign;

    const eligible_products = products
      .filter(
        (product) =>
          (!rule_author || product.author === rule_author) &&
          (!rule_category || product.category.title === rule_category),
      )
      .sort((a, b) => a.list_price - b.list_price)
      .slice(0, discount_quantity);

    const discounted_price =
      total_price -
      eligible_products.reduce((sum, product) => sum + product.list_price, 0);

    return discounted_price;
  } else return 0;
}
export { get_available_campaigns, get_discounted_total_price };
