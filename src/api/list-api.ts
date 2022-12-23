import { Unit } from '~/enums';
import i18n from '~/i18n';
import { ApiData } from '~/models';
import { List, ListPreview } from '~/types';
import { connectApi } from './connect-api';

type PostListDto = {
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
  description?: string;
};

type DeleteListItemDto = {
  id: number;
};

type PostCheckListItem = {
  id: number;
};

export const getLists = (): Promise<ApiData<ListPreview[]>> =>
  connectApi({
    endpoint: `list?lang=${i18n.resolvedLanguage}`,
  });

export const addList = (body: PostListDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'list',
    method: 'POST',
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
    body,
  });
