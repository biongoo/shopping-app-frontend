import { Unit } from '~/enums';
import i18n from '~/i18n';
import { ApiData } from '~/models';
import { List, ListPreview } from '~/types';
import { connectApi } from './connect-api';

type PutListDto = {
  id?: number;
  name?: string;
};

type GetListDto = {
  id: number;
};

type DeleteListDto = {
  id: number;
};

type PutListItemDto = {
  listId: number;
  productId: number;
  sectionId: number;
  unit: Unit;
  count: number;
  id?: number;
  description?: string;
};

type DeleteListItemDto = {
  id: number;
};

type PostShareList = {
  id: number;
  email: string;
};

export type PostCheckListItem = {
  id: number;
  checked: boolean;
  shopId?: number;
  sectionId?: number;
};

export const getLists = (): Promise<ApiData<ListPreview[]>> =>
  connectApi({
    endpoint: `list?lang=${i18n.resolvedLanguage}`,
  });

export const putList = (body: PutListDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'list',
    method: 'PUT',
    body: {
      ...body,
      lang: i18n.resolvedLanguage,
    },
  });

export const deleteList = (body: DeleteListDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'list',
    method: 'DELETE',
    body,
  });

export const getList = (body: GetListDto): Promise<ApiData<List>> =>
  connectApi({
    endpoint: `list/item?id=${body.id}&lang=${i18n.resolvedLanguage}`,
  });

export const putListItem = (body: PutListItemDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'list/item',
    method: 'PUT',
    body,
  });

export const deleteListItem = (body: DeleteListItemDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'list/item',
    method: 'DELETE',
    body,
  });

export const checkItem = (body: PostCheckListItem): Promise<ApiData> =>
  connectApi({
    endpoint: 'list/item/check',
    method: 'POST',
    body: {
      id: body.id,
      checked: body.checked,
    },
  });

export const shareList = (body: PostShareList): Promise<ApiData> =>
  connectApi({
    endpoint: 'list/share',
    method: 'POST',
    body: body,
  });
