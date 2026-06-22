import {Box} from '@mui/material';
import React from 'react';
import {sectionDividerStyle} from '../styles/styles';

// Hairline rule between page sections (presentational only).
const SectionDivider: React.FC = () => (
    <Box component="hr" aria-hidden sx={(theme) => sectionDividerStyle(theme)}/>
);

export default SectionDivider;
