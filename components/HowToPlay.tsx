import {Box, Chip, Grid, Paper, Stack, Typography} from '@mui/material';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import TerminalIcon from '@mui/icons-material/Terminal';
import PublicIcon from '@mui/icons-material/Public';
import React from 'react';
import {sectionHeaderStyle} from '../styles/styles';
import {REPO_URL} from '../utils/site';

// A monospace command block for the copy-pasteable launch commands.
const Command: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <Box
        component="pre"
        sx={{
            m: 0,
            mt: 1.5,
            p: 1.5,
            borderRadius: 1,
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b0e13' : '#0e1117'),
            color: '#e6edf3',
        }}
    >
        <code>{children}</code>
    </Box>
);

const Mode: React.FC<{
    icon: React.ReactNode;
    title: string;
    badge?: string;
    children: React.ReactNode;
}> = ({icon, title, badge, children}) => (
    <Paper elevation={0} sx={{p: 3, height: '100%'}}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 1.5}}>
            <Box sx={{color: 'primary.main', display: 'flex'}}>{icon}</Box>
            <Typography variant="h6" component="h3" sx={{fontWeight: 600}}>
                {title}
            </Typography>
            {badge ? <Chip size="small" label={badge} color="secondary" variant="outlined"/> : null}
        </Stack>
        {children}
    </Paper>
);

const HowToPlay: React.FC = () => (
    <Box component="section" id="how-to-play" sx={{py: 2}}>
        <Typography variant="h4" component="h2" sx={(theme) => sectionHeaderStyle(theme)}>
            How to play
        </Typography>
        <Grid container spacing={{xs: 2, md: 3}}>
            <Grid item xs={12} md={4}>
                <Mode icon={<DesktopWindowsIcon/>} title="Desktop">
                    <Typography variant="body2" color="text.secondary">
                        Download a build above, launch it, and start roaming. Move around the
                        world, gather wood and stone, craft tools, and keep yourself fed. The full
                        control list is shown in-game and in the{' '}
                        <a href={`${REPO_URL}#getting-started`} target="_blank" rel="noopener noreferrer">
                            README
                        </a>
                        .
                    </Typography>
                </Mode>
            </Grid>
            <Grid item xs={12} md={4}>
                <Mode icon={<TerminalIcon/>} title="Terminal (text mode)">
                    <Typography variant="body2" color="text.secondary">
                        No display? Roam ships a built-in text mode with full gameplay parity — great
                        for SSH, a Chromebook, or anything headless. From a source checkout:
                    </Typography>
                    <Command>python src/roam.py --text</Command>
                </Mode>
            </Grid>
            <Grid item xs={12} md={4}>
                <Mode icon={<PublicIcon/>} title="In your browser" badge="Planned">
                    <Typography variant="body2" color="text.secondary">
                        A play-in-the-browser build, running entirely client-side with no download
                        needed, is on the roadmap. Want to help make it happen?{' '}
                        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                            Follow along on GitHub
                        </a>
                        .
                    </Typography>
                </Mode>
            </Grid>
        </Grid>
    </Box>
);

export default HowToPlay;
