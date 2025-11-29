import React from 'react';

export interface ProductDataPropsUI {
  title: string;
  desc: string;
  icon: React.ReactNode;
  pathname: '/screens/productDetailScreen';
  paramCategory: string;
}
