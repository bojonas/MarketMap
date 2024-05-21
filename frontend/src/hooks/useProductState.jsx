import { useState, useContext } from 'react';
import { MyMarketContext } from '../DimensionContext';

export function useProductState() {
  const [products, setProducts] = useState([]);
  const context = useContext(MyMarketContext);

  if (context) return [context.products, context.setProducts];
  return [products, setProducts];
}