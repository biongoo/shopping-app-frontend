import { sub } from 'date-fns';
import { ListPreview } from '~/types';

export const list: ListPreview[] = [
  {
    id: 1,
    name: 'Lista z 09.12.2022',
    editDate: sub(new Date(), {
      days: 1,
    }),
    products: [{ name: 'Apples', checked: false }],
  },
  {
    id: 2,
    name: 'Lista z 10.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: false },
      { name: 'Bread', checked: false },
    ],
  },
  {
    id: 3,
    name: 'Lista z 11.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: true },
      { name: 'Bread', checked: true },
      { name: 'Rum', checked: true },
    ],
  },
  {
    id: 4,
    name: 'Lista z 12.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: false },
      { name: 'Bread', checked: false },
      { name: 'Rum', checked: false },
      { name: 'Vodka', checked: false },
    ],
  },
  {
    id: 5,
    name: 'Lista z 13.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: false },
      { name: 'Bread', checked: false },
      { name: 'Rum', checked: false },
      { name: 'Vodka', checked: false },
      { name: 'Sugar', checked: false },
    ],
  },
  {
    id: 6,
    name: 'Lista z 14.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Tomatoes', checked: false },
      { name: 'Ham', checked: false },
    ],
  },
];
