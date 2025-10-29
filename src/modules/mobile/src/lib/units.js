export const UNITS = [
  "g","ml","adet","dilim","kase","porsiyon",
  "yemek_kaşığı","tatlı_kaşığı","çay_kaşığı","su_bardağı"
];

export const unitToGramDefault = {
  g: 1, ml: 1, adet: 50, dilim: 25, kase: 250, porsiyon: 200,
  yemek_kaşığı: 15, tatlı_kaşığı: 5, çay_kaşığı: 2.5, su_bardağı: 200,
};

export const ingredientOverrides = {
  "zeytinyağı": { yemek_kaşığı: 13.5, tatlı_kaşığı: 4.5, çay_kaşığı: 3 },
  "tam buğday ekmek": { dilim: 25 },
  "pirinç (pişmiş)": { kase: 180 },
  "yoğurt (sade)": { kase: 200, su_bardağı: 200 },
  "yumurta": { adet: 50 },
};

export function gramsFor(stdName, quantity, unit){
  const ov = ingredientOverrides[stdName]?.[unit];
  const per = ov ?? unitToGramDefault[unit] ?? 100;
  return Math.max(0, quantity * per);
}
