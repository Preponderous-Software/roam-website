import {Box, Grid, Paper, Typography} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import BoltIcon from '@mui/icons-material/Bolt';
import BuildIcon from '@mui/icons-material/Build';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PetsIcon from '@mui/icons-material/Pets';
import TerminalIcon from '@mui/icons-material/Terminal';
import React from 'react';
import {infoCardStyle, infoCardIconStyle, infoCardIconSizeStyle, sectionHeaderStyle} from '../styles/styles';
import featuresData from '../pages/data/features.json';

// Map the JSON icon keys to MUI icons so feature content stays data-driven
// (pages/data/features.json) while the rendering lives here.
const ICONS: Record<string, React.ElementType> = {
    public: PublicIcon,
    bolt: BoltIcon,
    build: BuildIcon,
    agriculture: AgricultureIcon,
    pets: PetsIcon,
    terminal: TerminalIcon,
};

interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
}

const FeatureCard: React.FC<{ feature: Feature }> = ({feature}) => {
    const Icon = ICONS[feature.icon] ?? PublicIcon;
    return (
        <Paper elevation={0} sx={(theme) => infoCardStyle(theme)}>
            <Box sx={(theme) => infoCardIconStyle(theme)}>
                <Icon sx={infoCardIconSizeStyle}/>
            </Box>
            <Typography variant="h6" component="h3" gutterBottom sx={{fontWeight: 600}}>
                {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {feature.description}
            </Typography>
        </Paper>
    );
};

const FeaturesSection: React.FC = () => {
    const features = featuresData.features as Feature[];
    return (
        <Box component="section" id="features" sx={{py: 2}}>
            <Typography variant="h4" component="h2" sx={(theme) => sectionHeaderStyle(theme)}>
                What you do in Roam
            </Typography>
            <Grid container spacing={{xs: 2, md: 3}}>
                {features.map((feature) => (
                    <Grid item xs={12} sm={6} md={4} key={feature.id}>
                        <FeatureCard feature={feature}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FeaturesSection;
