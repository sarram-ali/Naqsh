// ALL photo paths, written out one by one. Nothing is built from a pattern: change any single path to point that spot at any file or folder inside public/.
// To use your own photo, either replace the file at that path, or change the path here.
export const IMG = {
  home: { eidBanner: "/images/home/eid-banner.jpg" },
  men: {
    banner: "/images/men/banner.jpg", // poster behind the Home toggle
    boxes: ["/images/men/box-1.jpg", "/images/men/box-2.jpg", "/images/men/box-3.jpg"], // 3 boxes on the Home hero
    categories: { // tile photo + 3 product photos for each category
      "kurta": { tile: "/images/men/categories/kurta/tile.jpg", photos: ["/images/men/categories/kurta/1.jpg", "/images/men/categories/kurta/2.jpg", "/images/men/categories/kurta/3.jpg"] },
      "polo-tee": { tile: "/images/men/categories/polo-tee/tile.jpg", photos: ["/images/men/categories/polo-tee/1.jpg", "/images/men/categories/polo-tee/2.jpg", "/images/men/categories/polo-tee/3.jpg"] },
      "shalwar-kameez": { tile: "/images/men/categories/shalwar-kameez/tile.jpg", photos: ["/images/men/categories/shalwar-kameez/1.jpg", "/images/men/categories/shalwar-kameez/2.jpg", "/images/men/categories/shalwar-kameez/3.jpg"] },
      "shawl": { tile: "/images/men/categories/shawl/tile.jpg", photos: ["/images/men/categories/shawl/1.jpg", "/images/men/categories/shawl/2.jpg", "/images/men/categories/shawl/3.jpg"] },
      "sherwani": { tile: "/images/men/categories/sherwani/tile.jpg", photos: ["/images/men/categories/sherwani/1.jpg", "/images/men/categories/sherwani/2.jpg", "/images/men/categories/sherwani/3.jpg"] },
      "trousers": { tile: "/images/men/categories/trousers/tile.jpg", photos: ["/images/men/categories/trousers/1.jpg", "/images/men/categories/trousers/2.jpg", "/images/men/categories/trousers/3.jpg"] },
      "unstitched": { tile: "/images/men/categories/unstitched/tile.jpg", photos: ["/images/men/categories/unstitched/1.jpg", "/images/men/categories/unstitched/2.jpg", "/images/men/categories/unstitched/3.jpg"] },
      "waistcoat": { tile: "/images/men/categories/waistcoat/tile.jpg", photos: ["/images/men/categories/waistcoat/1.jpg", "/images/men/categories/waistcoat/2.jpg", "/images/men/categories/waistcoat/3.jpg"] },
    },
  },
  women: {
    banner: "/images/women/banner.jpg", // poster behind the Home toggle
    boxes: ["/images/women/box-1.jpg", "/images/women/box-2.jpg", "/images/women/box-3.jpg"], // 3 boxes on the Home hero
    categories: { // tile photo + 3 product photos for each category
      "abaya": { tile: "/images/women/categories/abaya/tile.jpg", photos: ["/images/women/categories/abaya/1.jpg", "/images/women/categories/abaya/2.jpg", "/images/women/categories/abaya/3.jpg"] },
      "dupatta": { tile: "/images/women/categories/dupatta/tile.jpg", photos: ["/images/women/categories/dupatta/1.jpg", "/images/women/categories/dupatta/2.jpg", "/images/women/categories/dupatta/3.jpg"] },
      "formal": { tile: "/images/women/categories/formal/tile.jpg", photos: ["/images/women/categories/formal/1.jpg", "/images/women/categories/formal/2.jpg", "/images/women/categories/formal/3.jpg"] },
      "gown": { tile: "/images/women/categories/gown/tile.jpg", photos: ["/images/women/categories/gown/1.jpg", "/images/women/categories/gown/2.jpg", "/images/women/categories/gown/3.jpg"] },
      "hijab": { tile: "/images/women/categories/hijab/tile.jpg", photos: ["/images/women/categories/hijab/1.jpg", "/images/women/categories/hijab/2.jpg", "/images/women/categories/hijab/3.jpg"] },
      "kurti": { tile: "/images/women/categories/kurti/tile.jpg", photos: ["/images/women/categories/kurti/1.jpg", "/images/women/categories/kurti/2.jpg", "/images/women/categories/kurti/3.jpg"] },
      "shawl": { tile: "/images/women/categories/shawl/tile.jpg", photos: ["/images/women/categories/shawl/1.jpg", "/images/women/categories/shawl/2.jpg", "/images/women/categories/shawl/3.jpg"] },
      "three-piece": { tile: "/images/women/categories/three-piece/tile.jpg", photos: ["/images/women/categories/three-piece/1.jpg", "/images/women/categories/three-piece/2.jpg", "/images/women/categories/three-piece/3.jpg"] },
      "trousers": { tile: "/images/women/categories/trousers/tile.jpg", photos: ["/images/women/categories/trousers/1.jpg", "/images/women/categories/trousers/2.jpg", "/images/women/categories/trousers/3.jpg"] },
      "unstitched": { tile: "/images/women/categories/unstitched/tile.jpg", photos: ["/images/women/categories/unstitched/1.jpg", "/images/women/categories/unstitched/2.jpg", "/images/women/categories/unstitched/3.jpg"] },
    },
  },
  brands: { // one photo per brand (brand card on the Brands page)
    "alkaram-studio": "/images/brands/alkaram-studio/photo.jpg",
    "amir-adnan": "/images/brands/amir-adnan/photo.jpg",
    "asim-jofa": "/images/brands/asim-jofa/photo.jpg",
    "bareeze": "/images/brands/bareeze/photo.jpg",
    "baroque": "/images/brands/baroque/photo.jpg",
    "beechtree": "/images/brands/beechtree/photo.jpg",
    "bonanza-satrangi": "/images/brands/bonanza-satrangi/photo.jpg",
    "breakout": "/images/brands/breakout/photo.jpg",
    "cambridge": "/images/brands/cambridge/photo.jpg",
    "charcoal": "/images/brands/charcoal/photo.jpg",
    "charizma": "/images/brands/charizma/photo.jpg",
    "deepak-perwani": "/images/brands/deepak-perwani/photo.jpg",
    "diners": "/images/brands/diners/photo.jpg",
    "edenrobe": "/images/brands/edenrobe/photo.jpg",
    "elan": "/images/brands/elan/photo.jpg",
    "ethnic": "/images/brands/ethnic/photo.jpg",
    "generation": "/images/brands/generation/photo.jpg",
    "gul-ahmed": "/images/brands/gul-ahmed/photo.jpg",
    "j": "/images/brands/j/photo.jpg",
    "khaadi": "/images/brands/khaadi/photo.jpg",
    "limelight": "/images/brands/limelight/photo.jpg",
    "maria-b": "/images/brands/maria-b/photo.jpg",
    "naqsh-modest": "/images/brands/naqsh-modest/photo.jpg",
    "nishat-linen": "/images/brands/nishat-linen/photo.jpg",
    "outfitters": "/images/brands/outfitters/photo.jpg",
    "republic": "/images/brands/republic/photo.jpg",
    "sana-safinaz": "/images/brands/sana-safinaz/photo.jpg",
    "sapphire": "/images/brands/sapphire/photo.jpg",
    "zellbury": "/images/brands/zellbury/photo.jpg",
  },
};
