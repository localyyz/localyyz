const cssColors = {
  aliceblue: true,
  antiquewhite: true,
  aqua: true,
  aquamarine: true,
  azure: true,
  beige: true,
  bisque: true,
  black: true,
  blanchedalmond: true,
  blue: true,
  blueviolet: true,
  brown: true,
  burlywood: true,
  cadetblue: true,
  chartreuse: true,
  chocolate: true,
  coral: true,
  cornflowerblue: true,
  cornsilk: true,
  crimson: true,
  cyan: true,
  darkblue: true,
  darkcyan: true,
  darkgoldenrod: true,
  darkgray: true,
  darkgreen: true,
  darkgrey: true,
  darkkhaki: true,
  darkmagenta: true,
  darkolivegreen: true,
  darkorange: true,
  darkorchid: true,
  darkred: true,
  darksalmon: true,
  darkseagreen: true,
  darkslateblue: true,
  darkslategrey: true,
  darkturquoise: true,
  darkviolet: true,
  deeppink: true,
  deepskyblue: true,
  dimgray: true,
  dimgrey: true,
  dodgerblue: true,
  firebrick: true,
  floralwhite: true,
  forestgreen: true,
  fuchsia: true,
  gainsboro: true,
  ghostwhite: true,
  gold: true,
  goldenrod: true,
  gray: true,
  green: true,
  greenyellow: true,
  grey: true,
  honeydew: true,
  hotpink: true,
  indianred: true,
  indigo: true,
  ivory: true,
  khaki: true,
  lavender: true,
  lavenderblush: true,
  lawngreen: true,
  lemonchiffon: true,
  lightblue: true,
  lightcoral: true,
  lightcyan: true,
  lightgoldenrodyellow: true,
  lightgray: true,
  lightgreen: true,
  lightgrey: true,
  lightpink: true,
  lightsalmon: true,
  lightseagreen: true,
  lightskyblue: true,
  lightslategrey: true,
  lightsteelblue: true,
  lightyellow: true,
  lime: true,
  limegreen: true,
  linen: true,
  magenta: true,
  maroon: true,
  mediumaquamarine: true,
  mediumblue: true,
  mediumorchid: true,
  mediumpurple: true,
  mediumseagreen: true,
  mediumslateblue: true,
  mediumspringgreen: true,
  mediumturquoise: true,
  mediumvioletred: true,
  midnightblue: true,
  mintcream: true,
  mistyrose: true,
  moccasin: true,
  navajowhite: true,
  navy: true,
  oldlace: true,
  olive: true,
  olivedrab: true,
  orange: true,
  orangered: true,
  orchid: true,
  palegoldenrod: true,
  palegreen: true,
  paleturquoise: true,
  palevioletred: true,
  papayawhip: true,
  peachpuff: true,
  peru: true,
  pink: true,
  plum: true,
  powderblue: true,
  purple: true,
  rebeccapurple: true,
  red: true,
  rosybrown: true,
  royalblue: true,
  saddlebrown: true,
  salmon: true,
  sandybrown: true,
  seagreen: true,
  seashell: true,
  sienna: true,
  silver: true,
  skyblue: true,
  slateblue: true,
  slategray: true,
  snow: true,
  springgreen: true,
  steelblue: true,
  tan: true,
  teal: true,
  thistle: true,
  tomato: true,
  turquoise: true,
  violet: true,
  wheat: true,
  white: true,
  whitesmoke: true,
  yellow: true,
  yellowgreen: true
}

const isCssColor = color => {
  return cssColors[color] || false
}

export default isCssColor