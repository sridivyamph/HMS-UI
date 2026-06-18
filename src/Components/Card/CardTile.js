import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

export default function CardTile() {
  return (
    <Card sx={{ maxWidth: 345, margin: 'auto', textAlign: 'center', boxShadow: 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <CardMedia
          component="img"
          height="140"
          image="https://via.placeholder.com/140" // Replace with your image URL or local image path
          alt="Card Image"
          sx={{ borderRadius: '50%', width: 100, height: 60 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Card Title
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            This is a description for the card. It provides more details about the content displayed on the card.
          </Typography> */}
        </CardContent>
      </Box>
    </Card>
  );
}
