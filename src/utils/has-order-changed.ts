type orderArray = Array<{
  id: number;
  orderNumber: number;
}>;

export const hasOrderChanged = (
  reordered: orderArray,
  original?: orderArray
) => {
  for (const shop of reordered) {
    const originalOrder = original?.find((x) => x.id === shop.id)?.orderNumber;

    if (originalOrder != shop.orderNumber) {
      return true;
    }
  }

  return false;
};
