import { ProductType, Unit } from '~/enums';
import i18n from '~/i18n';
import { ApiData } from '~/models';
import { Product } from '~/types';
import { connectApi } from './connect-api';

type PostProductDto = {
  name: string;
  units: Unit[];
  sectionId?: number;
};

type PatchProductDto = {
  id: number;
  name: string;
  units: Unit[];
  type: ProductType;
  sectionId?: number;
};

type DeleteProductDto = {
  id: number;
};

export const getProducts = (): Promise<ApiData<Product[]>> =>
  connectApi({
    endpoint: `product?lang=${i18n.resolvedLanguage}`,
  });

export const addProduct = (body: PostProductDto): Promise<ApiData<Product>> =>
  connectApi({
    endpoint: 'product',
    method: 'POST',
    body: {
      ...body,
      lang: i18n.resolvedLanguage,
    },
  });

export const editProduct = (
  body: PatchProductDto
): Promise<ApiData<Product>> => {
  return body.type === ProductType.global
    ? connectApi({
        endpoint: 'product/global',
        method: 'PATCH',
        body: {
          id: body.id,
          sectionId: body.sectionId,
        },
      })
    : connectApi({
        endpoint: 'product/local',
        method: 'PATCH',
        body: {
          id: body.id,
          name: body.name,
          units: body.units,
          sectionId: body.sectionId,
          lang: i18n.resolvedLanguage,
        },
      });
};

export const deleteProduct = (body: DeleteProductDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'product',
    method: 'DELETE',
    body,
  });
