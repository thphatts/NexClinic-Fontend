import apiClient, { getResponseData } from '@/lib/axios';
import { ApiResponse, PagedResponse, Product } from '@/types/api';

export interface ProductQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  name?: string;
  category?: string;
}

export const productService = {
  async getAllProducts(params?: ProductQueryParams): Promise<PagedResponse<Product>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Product>>>('/products', {
      params: {
        page_no: params?.page || 1,
        page_size: params?.size || 10,
        sortBy: params?.sortBy || 'id',
        sortDir: params?.sortDir || 'asc',
        name: params?.name || undefined,
        category: params?.category || undefined,
      },
    });
    return getResponseData<PagedResponse<Product>>(res);
  },
};
