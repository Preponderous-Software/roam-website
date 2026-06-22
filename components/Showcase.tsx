import {Box, Grid, Paper, Typography} from '@mui/material';
import React from 'react';
import {sectionHeaderStyle} from '../styles/styles';

interface Shot {
    src: string;
    caption: string;
}

const SHOTS: Shot[] = [
    {src: '/screenshots/house.png', caption: 'A base built from gathered wood and stone'},
    {src: '/screenshots/map.png', caption: 'The minimap view of a generated world'},
];

const Showcase: React.FC = () => (
    <Box component="section" id="showcase" sx={{py: 2}}>
        <Typography variant="h4" component="h2" sx={(theme) => sectionHeaderStyle(theme)}>
            A peek at the world
        </Typography>
        <Grid container spacing={{xs: 2, md: 3}}>
            {SHOTS.map((shot) => (
                <Grid item xs={12} sm={6} key={shot.src}>
                    <Paper
                        elevation={0}
                        sx={{
                            overflow: 'hidden',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.12)'},
                        }}
                    >
                        <Box
                            component="img"
                            src={shot.src}
                            alt={shot.caption}
                            sx={{
                                display: 'block',
                                width: '100%',
                                height: {xs: 220, sm: 280},
                                objectFit: 'contain',
                                imageRendering: 'pixelated',
                                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b0e13' : '#eef1f5'),
                            }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{p: 2, textAlign: 'center'}}>
                            {shot.caption}
                        </Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </Box>
);

export default Showcase;
