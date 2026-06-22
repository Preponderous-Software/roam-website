import {Box, Chip, Grid, Stack, Typography} from '@mui/material';
import React from 'react';
import DownloadCard from './DownloadCard';
import {buildDownloads} from '../utils/downloads';
import {LATEST_VERSION, RELEASES_URL} from '../utils/site';
import {sectionHeaderStyle} from '../styles/styles';

// The download grid. The version label and direct asset links are derived from
// LATEST_VERSION (utils/site.ts) — the single value to bump per Roam release.
const DownloadSection: React.FC = () => {
    const downloads = buildDownloads(LATEST_VERSION);
    return (
        <Box component="section" id="download" sx={{py: 2}}>
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={1.5}
                alignItems={{xs: 'flex-start', sm: 'center'}}
                sx={{mb: 1}}
            >
                <Typography variant="h4" component="h2" sx={(theme) => ({...sectionHeaderStyle(theme), mb: 0})}>
                    Download Roam
                </Typography>
                <Chip
                    label={`Latest: v${LATEST_VERSION}`}
                    color="primary"
                    variant="outlined"
                    component="a"
                    href={RELEASES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                />
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{mb: 3, maxWidth: 720}}>
                Roam is free and source-available. Grab a build for your platform below — all
                releases and changelogs live on GitHub.
            </Typography>
            <Grid container spacing={{xs: 2, md: 3}}>
                {downloads.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <DownloadCard item={item}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DownloadSection;
