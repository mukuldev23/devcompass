import apiClient from './client';

export async function fetchArticles({ category, page = 1, limit = 20 }) {
  const { data } = await apiClient.get('/articles', {
    params: {
      category: category || undefined,
      page,
      limit
    }
  });

  return data.data;
}

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories');
  return data.data;
}

export async function fetchSources() {
  const { data } = await apiClient.get('/sources');
  return data.data;
}

export async function fetchRandomArticle() {
  const { data } = await apiClient.get('/articles/random');
  return data.data;
}

export async function fetchHotArticles({ category, limit = 8 }) {
  const { data } = await apiClient.get('/articles/hot', {
    params: {
      category: category || undefined,
      limit
    }
  });

  return data.data;
}
