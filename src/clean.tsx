import {createContext, useContext} from 'react';

// When true, the composition renders a "clean plate": no added text overlays
// (scene-title captions, logo kicker/subtitle, outro tagline) and the whole
// screenshots section becomes a plain white screen — narration + music stay.
export const CleanContext = createContext(false);
export const useClean = () => useContext(CleanContext);
