import { api, API_ENDPOINTS } from "../api";

export interface Pack {
  id: string;
  name: string;
  coinsCount: number;
  discountPerCent: number;
  bonusCount: number;
  createdAt: string;
  updatedAt: string;
  advantages: string[];
  disadvantages: string[];
  isDaily: boolean;
  isFree: boolean;
  price: number;
}

export async function fetchPacks(): Promise<Pack[]> {
  const response = await api.get<Pack[]>(API_ENDPOINTS.PACKS.GET_ALL);
  return response.data;
}
