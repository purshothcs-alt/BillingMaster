import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { PRODUCTS_CACHE_KEY, useGetProductsQuery } from '@/features/products/api/productsApi';
import type { Product } from '@/features/products/types';
import { getCachedValue } from '@/services/db/db';
import { formatCurrency } from '@/shared/utils/format';
import { useAppDispatch } from '@/app/hooks';
import { addToCart } from '../cartSlice';

export const ProductGrid = () => {
  const dispatch = useAppDispatch();
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [search, setSearch] = useState('');
  const [offlineProducts, setOfflineProducts] = useState<Product[] | undefined>();

  useEffect(() => {
    if (isError) {
      getCachedValue<Product[]>(PRODUCTS_CACHE_KEY).then(setOfflineProducts);
    }
  }, [isError]);

  const sourceProducts = products ?? offlineProducts;

  const filtered = useMemo(() => {
    const list = (sourceProducts ?? []).filter((p) => p.status === 'active');
    if (!search.trim()) return list;
    const term = search.toLowerCase();
    return list.filter(
      (p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term) || p.barcode?.includes(term),
    );
  }, [sourceProducts, search]);

  return (
    <Box>
      {isError && offlineProducts && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You're offline. Showing the last synced product catalog.
        </Alert>
      )}
      <TextField
        fullWidth
        placeholder="Search by name, SKU, or scan barcode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <Grid container spacing={1.5}>
        {!isLoading &&
          filtered.map((product) => (
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <Card variant="outlined">
                <CardActionArea
                  onClick={() =>
                    dispatch(
                      addToCart({
                        productId: product.id,
                        productName: product.name,
                        sku: product.sku,
                        unitPrice: product.sellingPrice,
                        taxRate: product.taxRate,
                      }),
                    )
                  }
                >
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Inventory2OutlinedIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.sku}
                    </Typography>
                    <Typography variant="subtitle2" color="primary.main" fontWeight={700} sx={{ mt: 0.5 }}>
                      {formatCurrency(product.sellingPrice)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
