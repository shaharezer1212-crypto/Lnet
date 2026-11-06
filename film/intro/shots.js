// t (s), composition centre x,y (world), z zoom (1 = whole room), r roll (deg), f follow weight
export const CAM = [
  { t: 0.0, x: 900, y: -12, z: 3.2, r: 0, f: .8 },     // close on the nib entering from the right
  { t: 1.3, x: 700, y: -330, z: 2.6, r: -2, f: .65 },  // crane up the shelf post to the lamp
  { t: 2.3, x: 120, y: -380, z: 2.2, r: 0, f: .75 },   // run along the beam
  { t: 3.1, x: -390, y: -360, z: 2.4, r: 2, f: .5 },   // the left lamp
  { t: 4.2, x: -720, y: -170, z: 1.85, r: 0, f: .45 }, // window wall, composed
  { t: 5.2, x: -700, y: 220, z: 1.9, r: 0, f: .5 },    // desk and chair
  { t: 5.9, x: -280, y: 260, z: 1.8, r: 0, f: .55 },   // the flight trail loops and climbs to the centre
  { t: 6.45, x: 0, y: -90, z: 2.3, r: 0, f: .12 },      // butterfly: composed, slow push-in
  { t: 7.5, x: 0, y: -100, z: 2.55, r: 0, f: .08 },
  { t: 8.45, x: 0, y: 0, z: 1.0, r: 0, f: 0 },         // continuous pull-back: it was one room
  { t: 9.4, x: 0, y: 0, z: 1.0, r: 0, f: 0 },          // hold, then the site cross-fades to the colour image
];
