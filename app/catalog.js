import { IMG } from "./images";
// DEMO DATA. Brand names and which categories each brand makes are approximate: check them for every shop and list only brands it really stocks.
const PAL = [["Charcoal","#2b2f36"],["Ivory","#efe9dc"],["Olive","#5b6b3a"],["Maroon","#7a1f2b"],["Navy","#1f2f4f"],["Sand","#d9c7a3"],["Rose","#d98a9a"],["Emerald","#1f6b57"],["Powder Blue","#9db8d6"],["Mustard","#d6a62c"],["Black","#1d1d1d"],["Teal","#2a7a82"]];
// [slug, label, shape, base price in Rs, fabrics]
export const CATS = {
  men: [["kurta","Kurtas","top",4900,["Cotton","Wash and Wear","Linen","Khaddar"]],["shalwar-kameez","Shalwar Kameez","set",6900,["Wash and Wear","Cotton","Karandi"]],["waistcoat","Waistcoats","top",8900,["Cotton Blend","Jamawar","Wool Blend"]],["sherwani","Sherwanis","top",24000,["Jamawar","Velvet","Raw Silk"]],["polo-tee","Polo Tees","top",2900,["Cotton","Pique"]],["trousers","Trousers","bottom",3900,["Cotton","Denim","Chino"]],["unstitched","Unstitched Suit Fabric","wrap",3900,["Wash and Wear","Cotton","Karandi"]],["shawl","Shawls","wrap",7500,["Pashmina","Wool"]]],
  women: [["kurti","Kurtis","top",5400,["Lawn","Cotton","Khaddar","Linen"]],["three-piece","Three Piece","set",8900,["Lawn","Cambric","Chiffon","Khaddar"]],["unstitched","Unstitched Fabric","wrap",6500,["Lawn","Cambric","Khaddar","Karandi","Linen"]],["dupatta","Dupattas","wrap",3200,["Chiffon","Net","Cotton","Organza"]],["trousers","Trousers","bottom",3300,["Cotton","Cambric","Grip"]],["formal","Formal Wear","set",19000,["Chiffon","Net","Organza","Raw Silk"]],["shawl","Shawls","wrap",6900,["Pashmina","Wool","Khaddar"]],["abaya","Abayas","long",12000,["Nida","Crepe","Chiffon"]],["gown","Gowns","long",18000,["Chiffon","Net","Organza"]],["hijab","Hijabs","wrap",1500,["Chiffon","Georgette","Jersey"]]],
};
const MEN = { k:"kurta", s:"shalwar-kameez", w:"waistcoat", h:"sherwani", p:"polo-tee", t:"trousers", u:"unstitched", l:"shawl" };
const WOM = { k:"kurti", t:"three-piece", u:"unstitched", d:"dupatta", r:"trousers", f:"formal", l:"shawl", a:"abaya", g:"gown", j:"hijab" };
// [slug, name, price multiplier, men codes, women codes]
export const BRANDS = [
  ["khaadi","Khaadi",1,"kslu","ktudrl"],["j","J.",1.1,"kswupt","ktuf"],["outfitters","Outfitters",0.8,"kspt","kr"],["edenrobe","Edenrobe",1,"kswhut",""],
  ["amir-adnan","Amir Adnan",1.8,"kwhs","kf"],["republic","Republic by Omer Farooq",2,"hwk",""],["diners","Diners",0.9,"kstpw",""],["bonanza-satrangi","Bonanza Satrangi",0.85,"ksptu","ktudr"],
  ["breakout","Breakout",0.8,"pt","kr"],["charcoal","Charcoal",0.9,"kpt",""],["cambridge","Cambridge",0.85,"kspt",""],["deepak-perwani","Deepak Perwani",2.2,"hwk",""],
  ["gul-ahmed","Gul Ahmed",0.9,"ksulp","ktudrl"],["alkaram-studio","Alkaram Studio",0.9,"ksul","ktudrl"],["sapphire","Sapphire",1.15,"kul","ktudrf"],["nishat-linen","Nishat Linen",1,"ku","ktudrl"],
  ["maria-b","Maria B",2,"","ktufdg"],["sana-safinaz","Sana Safinaz",1.9,"","ktufdg"],["zellbury","Zellbury",0.8,"","ktudr"],["generation","Generation",1.1,"","ktrd"],
  ["limelight","Limelight",0.85,"","ktrdl"],["beechtree","Beechtree",1,"","ktudr"],["bareeze","Bareeze",0.9,"","ktuf"],["asim-jofa","Asim Jofa",2.2,"","tfg"],
  ["baroque","Baroque",1.9,"","tfu"],["elan","Elan",2.2,"","tfg"],["charizma","Charizma",0.85,"","tul"],["ethnic","Ethnic",0.8,"","ktdr"],["naqsh-modest","Naqsh Modest",1,"","ajg"],
].map(([slug, name, m, a, b]) => {
  const cats = { men: [...a].map((c) => MEN[c]), women: [...b].map((c) => WOM[c]) };
  return { slug, name, m, cats, g: ["men", "women"].filter((x) => cats[x].length) };
});
export const fabricsFor = (g, cat) => [...new Set((g ? CATS[g] : [...CATS.men, ...CATS.women]).filter((c) => !cat || c[0] === cat).flatMap((c) => c[4]))];
export const SEASONS = ["Summer","Spring","Autumn","Winter"];
// Fabric to season (simplified: check per shop).
const SEASON = { Lawn:"Summer", Cotton:"Summer", Linen:"Summer", Pique:"Summer", Chino:"Summer", Cambric:"Spring", Chiffon:"Spring", Net:"Spring", Organza:"Spring", "Raw Silk":"Spring", "Wash and Wear":"Autumn", "Cotton Blend":"Autumn", Denim:"Autumn", Grip:"Autumn", Khaddar:"Winter", Karandi:"Winter", "Wool Blend":"Winter", Wool:"Winter", Pashmina:"Winter", Velvet:"Winter", Jamawar:"Winter", Nida:"Autumn", Crepe:"Autumn", Georgette:"Spring", Jersey:"Winter" };
const ADJ = ["Classic","Textured","Embroidered","Slim Fit","Relaxed","Printed"];
export const pkr = (n) => "Rs " + n.toLocaleString("en-PK");
export const PRODUCTS = [];
let k = 0;
for (const g of ["men","women"]) for (const b of BRANDS) for (const c of CATS[g]) if (b.cats[g].includes(c[0])) for (const n of [0,1,2]) {
  k++;
  const one = c[1].replace(/s$/, ""), fabric = c[4][(k + n) % c[4].length];
  const price = Math.round((c[3] * b.m * (1 + n * 0.18)) / 100) * 100, id = `${b.slug}-${g}-${c[0]}-${n + 1}`;
  const colors = [0,1,2].map((i) => PAL[(k * 5 + n * 3 + i * 4) % PAL.length]);
  PRODUCTS.push({
    slug: `${b.slug}-${g}-${c[0]}-${n + 1}`, name: `${ADJ[(k + n) % 6]} ${one}`, brand: b, g, cat: c[0], catName: c[1], shape: c[2], fabric,
    season: SEASON[fabric], img: IMG[g].categories[c[0]].photos[0], imgs: IMG[g].categories[c[0]].photos,
    stitch: c[0] === "unstitched" ? "Unstitched" : "Stitched",
    price, was: k % 5 === 0 ? Math.round((price * 1.25) / 100) * 100 : null, isNew: (k + n) % 6 === 0, colors,
    sizes: c[0] === "unstitched" ? ["Unstitched 3m"] : ["dupatta","shawl"].includes(c[0]) ? ["One size"] : ["S","M","L","XL"],
    desc: `${b.name} ${one.toLowerCase()} in ${colors[0][0].toLowerCase()}, made from ${fabric.toLowerCase()}. Clean stitching, a comfortable fit and easy care. Also available in ${colors[1][0].toLowerCase()} and ${colors[2][0].toLowerCase()}.`,
  });
}
export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug);
