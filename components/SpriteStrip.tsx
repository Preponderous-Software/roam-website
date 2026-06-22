import {Box} from '@mui/material';
import React from 'react';

// A row of the game's own 32x32 sprites, rendered crisp (no smoothing) as a bit
// of pixel-art flavour. Purely decorative, so it is hidden from assistive tech.
const SPRITES = [
    'player_down', 'chicken', 'rabbit', 'deer', 'wolf', 'bear', 'snake',
    'wheat', 'matureCrop', 'apple', 'campfire', 'torch', 'chest', 'oakWood', 'stone',
];

const SpriteStrip: React.FC<{ size?: number }> = ({size = 40}) => (
    <Box
        aria-hidden
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1.5,
            opacity: 0.9,
        }}
    >
        {SPRITES.map((name) => (
            <Box
                key={name}
                component="img"
                src={`/sprites/${name}.png`}
                alt=""
                sx={{
                    width: size,
                    height: size,
                    imageRendering: 'pixelated',
                    transition: 'transform 0.2s ease',
                    '&:hover': {transform: 'translateY(-4px) scale(1.1)'},
                }}
            />
        ))}
    </Box>
);

export default SpriteStrip;
