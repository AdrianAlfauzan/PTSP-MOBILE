export type ProductType = 'informasi' | 'jasa' | string;

export interface ProductDataBackendProps {
  Deskripsi: string;
  Harga: number;
  Nama: string;
  Pemilik: string;
  Status: string;
  id: string;
}
