import {Box, Button, Card, CardActions, CardContent, Stack, Typography} from '@mui/material';
import WindowIcon from '@mui/icons-material/Window';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import TerminalIcon from '@mui/icons-material/Terminal';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React from 'react';
import {PlatformDownload} from '../utils/downloads';

// MUI ships Material Design glyphs, not OS brand logos, so each platform maps to
// the closest-reading Material icon.
const ICONS: Record<PlatformDownload['icon'], React.ElementType> = {
    windows: WindowIcon,
    apple: LaptopMacIcon,
    linux: TerminalIcon,
};

const DownloadCard: React.FC<{ item: PlatformDownload }> = ({item}) => {
    const Icon = ICONS[item.icon];
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.12)'},
            }}
        >
            <CardContent sx={{flexGrow: 1}}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 1}}>
                    <Icon color="primary" sx={{fontSize: 32}}/>
                    <Typography variant="h6" component="h3" sx={{fontWeight: 600}}>
                        {item.platform}
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    {item.requirement}
                </Typography>
            </CardContent>
            <CardActions sx={{flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 2, pt: 0}}>
                {item.links.map((link) => {
                    const isExternal = link.href.startsWith('http');
                    return (
                        <Button
                            key={link.label}
                            fullWidth
                            variant={link.primary ? 'contained' : 'outlined'}
                            href={link.href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            startIcon={link.download ? <DownloadIcon/> : <OpenInNewIcon/>}
                        >
                            {link.label}
                        </Button>
                    );
                })}
            </CardActions>
        </Card>
    );
};

export default DownloadCard;
