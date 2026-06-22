import type {NextPage} from 'next';
import {Box, Container, Typography} from '@mui/material';
import React from 'react';
import Seo from '../components/Seo';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import DownloadSection from '../components/DownloadSection';
import HowToPlay from '../components/HowToPlay';
import SectionDivider from '../components/SectionDivider';
import {pageStyle} from '../styles/styles';

const version = require('../package.json').version;

const DownloadPage: NextPage = () => (
    <Box sx={(theme) => pageStyle(theme)}>
        <Seo
            title="Download"
            description="Download Roam for Windows, macOS, or build from source on Linux. Free and source-available."
        />
        <TopBar/>
        <Container component="main" id="main" maxWidth="lg" sx={{py: 4, flexGrow: 1}}>
            <Box sx={{py: {xs: 3, md: 5}}}>
                <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 700}}>
                    Get Roam
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{fontWeight: 400, maxWidth: 720}}>
                    Pick your platform and start exploring. Every release is published on GitHub
                    with notes on what changed.
                </Typography>
            </Box>
            <DownloadSection/>
            <SectionDivider/>
            <HowToPlay/>
        </Container>
        <BottomBar version={version}/>
    </Box>
);

export default DownloadPage;
