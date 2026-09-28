import type { ReactNode } from 'react'

// As 22 ilustrações de comida do design, em traço: 64 × 64, sem preenchimento,
// na cor do texto (currentColor). A ordem segue a prancha do design, linha por linha.
export const FOOD_ILLUSTRATIONS = {
  pasta: (
    <>
      <path d="M9 29h46c0 13-10.3 23-23 23S9 42 9 29Z" />
      <path d="M17 29c1.5-7.5 5-11.5 9.5-12" />
      <path d="M27 29c-.5-9.5 3-14.5 8-16" />
      <path d="M37 29c1-8 4.5-12.5 9-14" />
      <circle cx="25.5" cy="15.5" r="2.2" />
      <circle cx="35" cy="11.5" r="2.2" />
      <path d="M6 52h52" />
    </>
  ),
  chicken: (
    <>
      <path d="M47 11c6.5 3.8 7.5 13.5 1.8 18.8-3.6 3.4-8 3.6-11.4 5.4-3 1.6-4.6 4.2-6.2 7" />
      <path d="M39 13c-4 1.6-6.6 4.8-8 8.6-1.3 3.5-3 6.3-6 8.6" />
      <circle cx="22" cy="42" r="8.5" />
      <circle cx="30" cy="50" r="6.5" />
      <path d="M27 37.5 40 25" />
    </>
  ),
  bowl: (
    <>
      <path d="M8 30h48c0 12.7-10.7 23-24 23S8 42.7 8 30Z" />
      <path d="M6 30h52" />
      <path d="M22 21c2-3 2-5.5 0-8.5" />
      <path d="M32 19c2-3.5 2-6.5 0-10" />
      <path d="M42 21c2-3 2-5.5 0-8.5" />
    </>
  ),
  soup: (
    <>
      <path d="M10 28h44c0 12-9.8 21-22 21s-22-9-22-21Z" />
      <path d="M54 32h4a5 5 0 0 1 0 10h-6" />
      <path d="M6 53h52" />
      <path d="M24 18c2-3 2-5.5 0-8.5" />
      <path d="M36 18c2-3 2-5.5 0-8.5" />
    </>
  ),
  chocolate: (
    <>
      <rect x="12" y="16" width="40" height="32" rx="4" />
      <path d="M12 27h40M12 37h40M25.5 16v32M38.5 16v32" />
      <path d="M12 22 20 16" />
    </>
  ),
  fish: (
    <>
      <path d="M8 32c7-11 18-17 28-17 9 0 16 6 20 17-4 11-11 17-20 17-10 0-21-6-28-17Z" />
      <path d="M56 32c3-2.5 5.5-4 8-4.5v9c-2.5-.5-5-2-8-4.5Z" />
      <circle cx="24" cy="27" r="2.2" />
      <path d="M33 22c3 6 3 14 0 20" />
      <path d="M42 24c2.5 5 2.5 11 0 16" />
    </>
  ),
  pancakes: (
    <>
      <ellipse cx="32" cy="40" rx="22" ry="7" />
      <path d="M10 40v-6c0-3.9 9.8-7 22-7s22 3.1 22 7v6" />
      <path d="M10 31v-6c0-3.9 9.8-7 22-7s22 3.1 22 7v6" />
      <path d="M25 20.5c1.5 2.5 5 2.5 7 0s5.5-2.5 7 0" />
      <rect x="27" y="10" width="10" height="7" rx="2" />
    </>
  ),
  cheese: (
    <>
      <path d="M8 42 44 14c7 2.5 11 7.5 12 14L22 50c-8-1-12-4-14-8Z" />
      <circle cx="24" cy="38" r="3" />
      <circle cx="38" cy="30" r="2.4" />
      <circle cx="46" cy="38" r="2" />
    </>
  ),
  bacon: (
    <>
      <path d="M8 22c6-6 12 6 18 0s12 6 18 0 8-3 12 0" />
      <path d="M8 34c6-6 12 6 18 0s12 6 18 0 8-3 12 0" />
      <path d="M8 46c6-6 12 6 18 0s12 6 18 0 8-3 12 0" />
    </>
  ),
  potato: (
    <>
      <path d="M20 16c10-5 22-3 27 5s3 20-5 27-20 8-27 1-5-28 5-33Z" />
      <circle cx="26" cy="30" r="1.8" />
      <circle cx="36" cy="26" r="1.6" />
      <circle cx="38" cy="38" r="1.8" />
      <circle cx="28" cy="42" r="1.6" />
    </>
  ),
  // Folha curva com o traço da nervura e o cabinho, como na prancha
  leaf: (
    <>
      <path d="M16 50c0-18 14-34 38-38-2 20-16 34-36 38" />
      <path d="M20 47c8-12 18-22 30-30" />
      <path d="M12 54c4-2 8-2 12-4" />
    </>
  ),
  pan: (
    <>
      <circle cx="28" cy="32" r="18" />
      <path d="M46 32h12" />
      <path d="M58 28v8" />
      <ellipse cx="26" cy="30" rx="8" ry="6.5" />
      <circle cx="26" cy="30" r="3" />
    </>
  ),
  wrap: (
    <>
      <path d="M14 46 44 14c6 1.5 9.5 5 11 11L25 57c-6-1.5-9.5-5-11-11Z" />
      <path d="M22 44c5 1 8 4 9 9" />
      <path d="M30 36c5 1 8 4 9 9" />
      <path d="M38 28c5 1 8 4 9 9" />
    </>
  ),
  flatbread: (
    <>
      <circle cx="32" cy="32" r="21" />
      <path d="M32 11c-8 6-12 13-12 21s4 15 12 21" />
      <circle cx="41" cy="26" r="2" />
      <circle cx="44" cy="36" r="1.8" />
      <circle cx="38" cy="43" r="1.6" />
    </>
  ),
  salad: (
    <>
      <path d="M8 32h48c0 12-10.7 21-24 21S8 44 8 32Z" />
      <path d="M6 32h52" />
      <path d="M20 30c-2-7 2-12 8-13" />
      <path d="M32 29c-3-6 0-12 6-14" />
      <path d="M42 30c0-6 3-9 8-10" />
    </>
  ),
  steak: (
    <>
      <path d="M16 18c12-6 26-5 32 3s3 22-8 28-25 5-30-3 1-23 6-28Z" />
      <path d="M24 24c8 2 14 8 16 16" />
      <path d="M32 20c8 3 13 9 15 17" />
    </>
  ),
  pot: (
    <>
      <rect x="12" y="26" width="40" height="24" rx="5" />
      <path d="M8 26h48" />
      <path d="M12 32H7a4 4 0 0 0 0 8h5" />
      <path d="M52 32h5a4 4 0 0 1 0 8h-5" />
      <path d="M24 18c2-3 2-5.5 0-8.5" />
      <path d="M36 18c2-3 2-5.5 0-8.5" />
    </>
  ),
  pudding: (
    <>
      <path d="M14 26h36l-6 22H20L14 26Z" />
      <ellipse cx="32" cy="26" rx="18" ry="6" />
      <path d="M24 20c0-4 4-4 4-8" />
      <path d="M38 20c0-4 4-4 4-8" />
      <path d="M12 52h40" />
    </>
  ),
  glass: (
    <>
      <path d="M18 16h28l-4 16a10 10 0 0 1-20 0L18 16Z" />
      <path d="M32 42v10" />
      <path d="M22 54h20" />
      <path d="M22 24h20" />
    </>
  ),
  cake: (
    <>
      <path d="M12 34h40v16H12z" />
      <path d="M12 34c0-5 9-8 20-8s20 3 20 8" />
      <path d="M32 26v-8" />
      <circle cx="32" cy="14" r="3" />
      <path d="M8 50h48" />
    </>
  ),
  bread: (
    <>
      <path d="M12 40c-4-10 2-22 14-22h12c12 0 18 12 14 22-2 6-8 8-20 8s-18-2-20-8Z" />
      <path d="M24 22c-2 8-2 16 0 24" />
      <path d="M34 22c-2 8-2 16 0 24" />
    </>
  ),
  carrot: (
    <>
      <path d="M22 26 38 42 24 50c-6 2-10-2-8-8l6-16Z" />
      <path d="M38 26c2-6 6-9 12-9-1 5-4 8-9 9" />
      <path d="M38 26c-1-6 1-10 5-13 2 5 1 9-2 12" />
      <path d="M27 33l8 8" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type FoodIllustrationName = keyof typeof FOOD_ILLUSTRATIONS
