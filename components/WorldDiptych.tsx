import {Box, IconButton, Link, Typography} from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React from 'react';
import {PLAY_3D_URL} from '../utils/site';

// One Roam world shown twice, side by side: drawn by the game's own 2D room
// renderer, and exported by roam-usd and rendered in 3D by Strata. Both are
// pre-rendered files (scripts/hero/); nothing here runs the game or loads a 3D
// engine. The 3D side starts as a still and becomes a day-and-night loop (a
// short muted video, VP9 WebM or H.264 MP4) only once the page has loaded, the
// box is on screen, and the visitor has not asked for reduced motion or reduced
// data; the video element is not in the page until then, so it never autoplays
// for them. A loop that never ends can be paused (WCAG 2.2.2).

export const HERO_2D = '/hero/roam-2d.png';
export const HERO_3D_POSTER = '/hero/roam-3d.jpg';
export const HERO_3D_LOOP_WEBM = '/hero/roam-3d.webm';
export const HERO_3D_LOOP_MP4 = '/hero/roam-3d.mp4';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const prefersStill = (): boolean => {
    try {
        if (window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches) return true;
    } catch {
        return true;
    }
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection;
    return Boolean(connection?.saveData);
};

// Plain <img> elements, so width and height reach the markup as attributes
// (MUI's Box would read them as CSS) and the browser reserves the space.
const frame: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: 'auto',
    aspectRatio: '1 / 1',
    borderRadius: 16,
    background: '#0b0e13',
};

const WorldDiptych: React.FC = () => {
    const box = React.useRef<HTMLDivElement>(null);
    const [canPlay, setCanPlay] = React.useState(false); // the still until the browser says otherwise
    const [paused, setPaused] = React.useState(false);
    const video = React.useRef<HTMLVideoElement | null>(null);

    // Pausing holds the current frame; playing resumes it. play() rejects if the
    // browser refuses autoplay, and the poster (the still) then stays on show.
    React.useEffect(() => {
        const element = video.current;
        if (!element) return;
        try {
            if (paused) element.pause();
            else void element.play()?.catch?.(() => undefined);
        } catch {
            // A browser without media playback keeps the poster.
        }
    }, [paused, canPlay]);

    React.useEffect(() => {
        if (prefersStill()) return undefined;
        let query: MediaQueryList | null = null;
        try {
            query = window.matchMedia?.(REDUCED_MOTION_QUERY) ?? null;
        } catch {
            query = null;
        }
        const onMotionChange = (event: MediaQueryListEvent) => {
            if (event.matches) setCanPlay(false);
        };
        query?.addEventListener?.('change', onMotionChange);

        let observer: IntersectionObserver | null = null;
        const watch = () => {
            const element = box.current;
            if (!element || typeof IntersectionObserver === 'undefined') return;
            observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setCanPlay(!query?.matches);
                    observer?.disconnect();
                }
            });
            observer.observe(element);
        };
        // After the load event, so the loop never competes with the page itself.
        if (document.readyState === 'complete') watch();
        else window.addEventListener('load', watch, {once: true});
        return () => {
            window.removeEventListener('load', watch);
            observer?.disconnect();
            query?.removeEventListener?.('change', onMotionChange);
        };
    }, []);

    
    return (
        <Box
            ref={box}
            component="section"
            aria-label="One Roam world in 2D and in 3D"
            data-testid="world-diptych"
            sx={{maxWidth: 880, mx: 'auto', mt: {xs: 5, md: 6}, textAlign: 'left'}}
        >
            <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, gap: {xs: 2, sm: 3}}}>
                <Box component="figure" sx={{m: 0}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={HERO_2D}
                        width={408}
                        height={408}
                        alt="A Roam world from above in 2D: a small home walled with wood in a grassy clearing, apple trees and stones around it, a jungle to the north and west, and chickens and rabbits about."
                        style={{...frame, imageRendering: 'pixelated'}}
                    />
                    <Typography component="figcaption" variant="body2" color="text.secondary" sx={{mt: 1}}>
                        <strong>2D</strong>: the game&apos;s own room renderer.
                    </Typography>
                </Box>
                <Box component="figure" sx={{m: 0}}>
                    <Box sx={{position: 'relative'}}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={HERO_3D_POSTER}
                            width={640}
                            height={640}
                            alt="The same world in 3D, seen from the south: the home's wooden walls, the apple trees and the jungle canopy stand up from the ground and cast shadows as the sun crosses the sky and night falls."
                            data-testid="world-diptych-3d"
                            // Hidden under the loop, so its noon edge does not show
                            // round the loop's evening.
                            style={{...frame, opacity: canPlay ? 0 : 1}}
                        />
                        {canPlay ? (
                            // Laid over the still, a pixel inside its edge, rather than
                            // swapped into it: a later paint is a new "largest contentful
                            // paint" only when it is larger, so the loop never is. Its
                            // poster is the same still, so nothing changes until it plays.
                            <video
                                ref={(element) => {
                                    video.current = element;
                                    // React sets muted as a property only; autoplay needs it
                                    // before the first play.
                                    if (element) element.muted = true;
                                }}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                poster={HERO_3D_POSTER}
                                width={640}
                                height={640}
                                aria-hidden
                                tabIndex={-1}
                                data-testid="world-diptych-3d-loop"
                                style={{
                                    ...frame,
                                    position: 'absolute',
                                    top: 1,
                                    left: 1,
                                    width: 'calc(100% - 2px)',
                                    height: 'calc(100% - 2px)',
                                    borderRadius: 15,
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={HERO_3D_LOOP_WEBM} type="video/webm"/>
                                <source src={HERO_3D_LOOP_MP4} type="video/mp4"/>
                            </video>
                        ) : null}
                        {canPlay ? (
                            <IconButton
                                size="small"
                                onClick={() => setPaused((was) => !was)}
                                aria-label={paused ? 'Play the 3D day-and-night loop' : 'Pause the 3D day-and-night loop'}
                                aria-pressed={paused}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    bottom: 8,
                                    width: 40,
                                    height: 40,
                                    color: '#fff',
                                    bgcolor: 'rgba(0, 0, 0, 0.55)',
                                    '&:hover': {bgcolor: 'rgba(0, 0, 0, 0.75)'},
                                }}
                            >
                                {paused ? <PlayArrowIcon fontSize="small"/> : <PauseIcon fontSize="small"/>}
                            </IconButton>
                        ) : null}
                    </Box>
                    <Typography component="figcaption" variant="body2" color="text.secondary" sx={{mt: 1}}>
                        <strong>3D</strong>: the same world, exported by{' '}
                        <Link href="https://github.com/Preponderous-Software/roam-usd" target="_blank" rel="noopener noreferrer">roam-usd</Link>
                        {' '}and rendered by{' '}
                        <Link href="https://github.com/Preponderous-Software/strata" target="_blank" rel="noopener noreferrer">Strata</Link>.{' '}
                        <Link href={PLAY_3D_URL}>Try the 3D view in your browser</Link>.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default WorldDiptych;
