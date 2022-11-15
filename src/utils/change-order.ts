import { arrayMove } from '@dnd-kit/sortable';

type Id = string | number;

type Element = {
  id: number;
  orderNumber: number;
};

export const changeOrder =
  <T extends Element>(firstId: Id, secondId: Id) =>
  (array?: T[] | null) => {
    if (!array) {
      return;
    }

    const activeIndex = array.findIndex((x) => x.id === firstId);
    const overIndex = array.findIndex((x) => x.id === secondId);

    return arrayMove(array, activeIndex, overIndex).map((x, i) => ({
      ...x,
      orderNumber: i + 1,
    }));
  };
