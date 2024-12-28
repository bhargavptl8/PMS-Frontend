import * as React from 'react';
import { Pagination, Stack, Typography } from '@mui/material';

export default function RowsPagination({ page, setPage, totalPages }) {
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack direction={"row"} sx={{ marginTop: '20px', alignItems: 'center', justifyContent: 'flex-end' }} spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination count={totalPages} page={page} variant="outlined" color="primary" shape="rounded" onChange={handleChange} />
    </Stack>
  );
}