export type CareEssential = {
  label: string;
  product: string;
};

export const ESSENTIALS: Record<string, CareEssential[]> = {
  "ball-python": [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Heat mat", product: "ExoTerra Heat Mat" },
    { label: "Humidity hide", product: "Humidity Hut" },
    { label: "Eco Earth", product: "ZM Eco Earth" },
    { label: "Sphagnum", product: "ZM Sphagnum Moss" },
    { label: "Frozen mice", product: "Frozen Mice" },
  ],
  "corn-snake": [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Heat mat", product: "ExoTerra Heat Mat" },
    { label: "Aspen bedding", product: "ZM Aspen Snake Bedding" },
    { label: "Enclosure", product: "ZooMed Terrariums & Screen Cages" },
    { label: "Frozen mice", product: "Frozen Mice" },
  ],
  kingsnake: [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Heat mat", product: "ExoTerra Heat Mat" },
    { label: "Aspen bedding", product: "ZM Aspen Snake Bedding" },
    { label: "Enclosure", product: "ZooMed Terrariums & Screen Cages" },
    { label: "Frozen mice", product: "Frozen Mice" },
  ],
  boa: [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Heat mat", product: "ExoTerra Heat Mat" },
    { label: "Cypress bedding", product: "ZM Forest Floor Cypress Bedding" },
    { label: "Humidity hide", product: "Humidity Hut" },
    { label: "Frozen mice", product: "Frozen Mice" },
  ],
  hognose: [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Heat mat", product: "ExoTerra Heat Mat" },
    { label: "Aspen bedding", product: "ZM Aspen Snake Bedding" },
    { label: "Frozen mice", product: "Frozen Mice" },
  ],
  "bearded-dragon": [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Basking lamp", product: "ZM Repti Basking Spot Lamp" },
    { label: "Desert UVB", product: "ExoTerra Reptile UVB 150 Desert" },
    { label: "Calcium / vitamins", product: "Vitamin And Mineral Suppliments" },
    { label: "Dubia roaches", product: "Dubia Roaches On Line Purchasing" },
    { label: "Enclosure", product: "ZooMed Terrariums & Screen Cages" },
  ],
  "leopard-gecko": [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Heat mat", product: "ExoTerra Heat Mat" },
    { label: "Moist hide", product: "Humidity Hut" },
    { label: "ReptiSoil", product: "ZM ReptiSoil" },
    { label: "Mealworms", product: "Mealworms" },
    { label: "Calcium / vitamins", product: "Vitamin And Mineral Suppliments" },
  ],
  "giant-day-gecko": [
    { label: "Tall enclosure", product: "ExoTerra Terrariums" },
    { label: "Plant light", product: "Arcadia Jungle Dawn LED Light Bar" },
    { label: "Tropical UVB", product: "ZM Reptisun T5 5.0 UVB Bulbs" },
    { label: "Gecko diet", product: "Pangea Diet Papaya" },
    { label: "Sprayer", product: "ExoTerra Hand Sprayers" },
    { label: "Vines", product: "ExoTerra Jungle And Moss Vines" },
  ],
  "frilled-lizard": [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Basking lamp", product: "ZM Repti Basking Spot Lamp" },
    { label: "High-output UVB", product: "ZM ReptiSun T5 10.0 UVB Bulbs" },
    { label: "Tall enclosure", product: "ExoTerra Terrariums" },
    { label: "Dubia roaches", product: "Dubia Roaches On Line Purchasing" },
    { label: "Calcium / vitamins", product: "Vitamin And Mineral Suppliments" },
  ],
  "blue-tongue": [
    { label: "Thermostat", product: "Thermostats" },
    { label: "Basking lamp", product: "ZM Repti Basking Spot Lamp" },
    { label: "UVB", product: "Arcadia Shade Dweller ProT5 7% UVB" },
    { label: "Cypress bedding", product: "ZM Forest Floor Cypress Bedding" },
    { label: "Specialty diet", product: "Reptile Specialty Diets" },
    { label: "Calcium / vitamins", product: "Vitamin And Mineral Suppliments" },
  ],
  "red-foot": [
    { label: "Tropical UVB", product: "ZM Reptisun T5 5.0 UVB Bulbs" },
    { label: "Basking lamp", product: "ZM Repti Basking Spot Lamp" },
    { label: "Cypress bedding", product: "ZM Forest Floor Cypress Bedding" },
    { label: "Sphagnum", product: "ZM Sphagnum Moss" },
    { label: "Sprayer", product: "ExoTerra Hand Sprayers" },
    { label: "Tortoise diet", product: "Reptile Specialty Diets" },
  ],
  "whites-frog": [
    { label: "Enclosure", product: "ExoTerra Terrariums" },
    { label: "Hydro balls", product: "ZM Hydro Balls VC-10" },
    { label: "Eco Earth", product: "ZM Eco Earth" },
    { label: "Frog moss", product: "ZM Frog Moss 80 cu in CF3-FM" },
    { label: "Sprayer", product: "ExoTerra Hand Sprayers" },
    { label: "Vines", product: "ExoTerra Jungle And Moss Vines" },
    { label: "Feeders", product: "Mealworms" },
  ],
  "horned-frog": [
    { label: "Enclosure", product: "ExoTerra Terrariums" },
    { label: "Eco Earth", product: "ZM Eco Earth" },
    { label: "Frog moss", product: "ZM Frog Moss 80 cu in CF3-FM" },
    { label: "Sprayer", product: "ExoTerra Hand Sprayers" },
    { label: "Feeders", product: "Mealworms" },
  ],
  "red-eyed": [
    { label: "Tall enclosure", product: "ExoTerra Terrariums" },
    { label: "Hydro balls", product: "ZM Hydro Balls VC-10" },
    { label: "Eco Earth", product: "ZM Eco Earth" },
    { label: "Frog moss", product: "ZM Frog Moss 80 cu in CF3-FM" },
    { label: "Sprayer", product: "ExoTerra Hand Sprayers" },
    { label: "Vines", product: "ExoTerra Jungle And Moss Vines" },
    { label: "Plant light", product: "Arcadia Jungle Dawn LED Light Bar" },
  ],
  "dart-frog": [
    { label: "Glass enclosure", product: "ExoTerra Terrariums" },
    { label: "Hydro balls / LECA", product: "ZM Hydro Balls VC-10" },
    { label: "Coco husk", product: "ExoTerra Coco Husk" },
    { label: "Frog moss", product: "ZM Frog Moss 80 cu in CF3-FM" },
    { label: "Vines", product: "ExoTerra Jungle And Moss Vines" },
    { label: "Plant light", product: "Arcadia Jungle Dawn LED Light Bar" },
    { label: "Sprayer", product: "ExoTerra Hand Sprayers" },
    { label: "Micro feeders", product: "Other Feeders" },
  ],
};

export function essentialsFor(id: string) {
  return ESSENTIALS[id] ?? [];
}
