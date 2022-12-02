type orderArray = Array<{
  id: number;
  order: number;
}>;

export const hasOrderChanged = (
  reordered: orderArray,
  original?: orderArray
) => {
  for (const shop of reordered) {
    const originalOrder = original?.find((x) => x.id === shop.id)?.order;

    if (originalOrder != shop.order) {
      return true;
    }
  }

  return false;
};
