import {AppBar, Box, Button, Link, Toolbar, Typography, useTheme} from '@mui/material';
import React, {useContext} from 'react';
import {ColorModeToggleSwitch} from './ColorModeToggleSwitch';
import {ColorModeContext} from '../utils/ColorModeContext';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
// MUI ships Material Design glyphs, not brand logos, so the Discord invite uses
// the closest-reading Material icon rather than the Discord mark.
import ForumIcon from '@mui/icons-material/Forum';
import {DISCORD_URL, SITE_REPO_URL} from '../utils/site';

import {
    toolbarStyle,
    bottomAppBarStyle,
    footerButtonStyle,
    versionNumberStyle,
    toggleSwitchBoxStyle,
    flexContainerStyle
} from '../styles/styles';

const FooterButton: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({
    href,
    icon,
    children,
}) => (
    <Button color="inherit" href={href} target="_blank" rel="noopener noreferrer" startIcon={icon} sx={(theme) => footerButtonStyle(theme)}>
        {children}
    </Button>
);

const VersionNumber: React.FC<{ version: string }> = ({version}) => (
    <Typography variant="body1" color="inherit" component="div" sx={(theme) => versionNumberStyle(theme)}>
        v{version}
    </Typography>
);

// A quiet same-tab link back to the author's portfolio, shared across the author's sites.
const PortfolioLink: React.FC = () => (
    <Typography variant="body2" color="inherit" component="div" sx={{opacity: 0.8}}>
        More by Daniel Stephenson →{' '}
        <Link href="https://danielstephenson.dev" color="inherit">danielstephenson.dev</Link>
    </Typography>
);

interface BottomBarProps {
    version: string;
}

// The footer version is this website's version (from package.json); the game's
// own release version is shown on the download cards. Source Code / Report a Bug
// point at this website's repo so feedback about the site lands in the right place,
// while Discord points at the Preponderous community server shared by all the games.
const BottomBar: React.FC<BottomBarProps> = ({version}) => {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();

    return (
        <AppBar position="static" sx={(theme) => bottomAppBarStyle(theme)}>
            <Toolbar sx={(theme) => toolbarStyle(theme)}>
                <Box sx={(theme) => flexContainerStyle(theme)}>
                    <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5}}>
                        <VersionNumber version={version}/>
                        <PortfolioLink/>
                    </Box>

                    <Box sx={(theme) => flexContainerStyle(theme, {gap: 1})}>
                        <FooterButton href={SITE_REPO_URL} icon={<CodeIcon/>}>
                            Source Code
                        </FooterButton>
                        <FooterButton href={`${SITE_REPO_URL}/issues/new`} icon={<BugReportIcon/>}>
                            Report a Bug
                        </FooterButton>
                        <FooterButton href={DISCORD_URL} icon={<ForumIcon/>}>
                            Discord
                        </FooterButton>
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

export default BottomBar;
