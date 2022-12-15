import i18n from '~/i18n';
import { ApiData } from '~/models';
import { ListPreview } from '~/types';
import { connectApi } from './connect-api';

type PostList = {
  name?: string;
};

export const getLists = (): Promise<ApiData<ListPreview[]>> =>
  connectApi({
    endpoint: `list?lang=${i18n.resolvedLanguage}`,
  });

export const addList = (body: PostList): Promise<ApiData<string>> =>
  connectApi({
    endpoint: 'list',
    method: 'POST',
    body: {
      ...body,
      lang: i18n.resolvedLanguage,
    },
  });
