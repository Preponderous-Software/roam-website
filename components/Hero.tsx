import {Box, Button, Stack, Typography} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import GitHubIcon from '@mui/icons-material/GitHub';
import React from 'react';
import SpriteStrip from './SpriteStrip';
import {REPO_URL} from '../utils/site';

// Landing hero: the game name, its one-line pitch, the two primary calls to
// action (download / source), and a strip of the game's own sprites underneath.
const Hero: React.FC = () => (
    <Box sx={{textAlign: 'center', py: {xs: 5, md: 9}}}>
        <Box
            component="img"
            src="/roam-icon.png"
            alt="Roam"
            sx={{width: {xs: 88, md: 112}, height: 'auto', imageRendering: 'pixelated', mb: 3}}
        />
        <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{fontWeight: 700, letterSpacing: '-0.02em'}}
        >
            Roam
        </Typography>
        <Typography
            variant="h6"
            color="text.secondary"
            sx={{maxWidth: 640, mx: 'auto', fontWeight: 400}}
        >
            Explore a procedurally-generated 2D world and interact with your
            surroundings — survive, craft, farm, and build a home in the wild.
        </Typography>
        <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center" sx={{mt: 4}}>
            <Button variant="contained" size="large" startIcon={<DownloadIcon/>} href="/download">
                Download Roam
            </Button>
            <Button
                variant="outlined"
                size="large"
                startIcon={<GitHubIcon/>}
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                View Source
            </Button>
        </Stack>
        <Box sx={{mt: {xs: 5, md: 7}}}>
            <SpriteStrip/>
        </Box>
    </Box>
);

export default Hero;
