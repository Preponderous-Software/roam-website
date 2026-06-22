import type {NextPage} from 'next';
import {Box, Container} from '@mui/material';
import React from 'react';
import Seo from '../components/Seo';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Hero from '../components/Hero';
import FeaturesSection from '../components/FeaturesSection';
import Showcase from '../components/Showcase';
import HowToPlay from '../components/HowToPlay';
import SectionDivider from '../components/SectionDivider';
import {pageStyle} from '../styles/styles';

const version = require('../package.json').version;

const Home: NextPage = () => (
    <Box sx={(theme) => pageStyle(theme)}>
        <Seo/>
        <TopBar/>
        <Container component="main" id="main" maxWidth="lg" sx={{py: 4, flexGrow: 1}}>
            <Hero/>
            <SectionDivider/>
            <FeaturesSection/>
            <SectionDivider/>
            <Showcase/>
            <SectionDivider/>
            <HowToPlay/>
        </Container>
        <BottomBar version={version}/>
    </Box>
);

export default Home;
