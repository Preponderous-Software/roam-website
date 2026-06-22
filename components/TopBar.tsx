import {AppBar, Box, Button, Link, Toolbar, Typography, useTheme} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {useRouter} from 'next/router';
import React, {useContext} from 'react';
import {ColorModeToggleSwitch} from './ColorModeToggleSwitch';
import {ColorModeContext} from '../utils/ColorModeContext';
import {isActiveNavLink} from '../utils/nav';
import {REPO_URL} from '../utils/site';

import {
    appBarStyle,
    navButtonStyle,
    brandNameStyle,
    toolbarStyle,
    toggleSwitchBoxStyle,
    flexContainerStyle
} from '../styles/styles';

// Internal routes navigate in the same tab; off-site links open in a new tab
// (with rel="noopener noreferrer") and carry an external-link icon so they are
// visually distinguishable from the in-site navigation they sit beside.
const NavButton: React.FC<{ href: string; active?: boolean; children: React.ReactNode }> = ({href, active = false, children}) => {
    const isExternal = href.startsWith('http');
    return (
        <Button
            color="inherit"
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            endIcon={isExternal ? <OpenInNewIcon fontSize="small"/> : undefined}
            aria-current={active ? 'page' : undefined}
            sx={(theme) => ({
                ...navButtonStyle(theme),
                // "You are here": highlight the link for the current page so the
                // user can tell where they are within the site.
                ...(active && {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    textUnderlineOffset: '6px',
                }),
            })}
        >
            {children}
        </Button>
    );
};

const BrandName: React.FC = () => (
    // The wordmark links home — the near-universal "click the logo to return to
    // the home page" convention. The game icon sits beside the name.
    <Link
        href="/"
        underline="none"
        color="inherit"
        sx={(theme) => ({...brandNameStyle(theme), display: 'inline-flex', alignItems: 'center', gap: 1})}
    >
        <Box component="img" src="/roam-icon.png" alt="" sx={{width: 28, height: 25, imageRendering: 'pixelated'}}/>
        <Typography variant="h6" color="inherit" component="span">
            Roam
        </Typography>
    </Link>
);

const TopBar: React.FC = () => {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const {pathname} = useRouter();

    return (
        <AppBar
            position="static"
            sx={(theme) => appBarStyle(theme)}
        >
            <Toolbar sx={(theme) => toolbarStyle(theme)}>
                <Box sx={(theme) => flexContainerStyle(theme, {flexWrap: 'wrap'})}>
                    <BrandName/>

                    <Box sx={(theme) => flexContainerStyle(theme, {gap: 1})}>
                        <NavButton href="/" active={isActiveNavLink(pathname, '/')}>Home</NavButton>
                        <NavButton href="/download" active={isActiveNavLink(pathname, '/download')}>Download</NavButton>
                        <NavButton href={REPO_URL}>GitHub</NavButton>
                    </Box>
                </Box>

                <Box sx={toggleSwitchBoxStyle}>
                    <ColorModeToggleSwitch
                        checked={theme.palette.mode === 'dark'}
                        onChange={colorMode.toggleColorMode}
                        inputProps={{'aria-label': 'Toggle dark mode'}}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
