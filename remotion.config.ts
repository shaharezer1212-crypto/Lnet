import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setConcurrency(2);
// Higgsfield clips are streamed from the CDN over the network during render.
Config.setChromiumOpenGlRenderer('angle');
