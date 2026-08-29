export const SITE = {
  name: "Harris in Wonderland",
  shortName: "Harris",
  tagline: "Reptile specialty shop, Canton CT",
  description:
    "A working herp collection in Canton — captive-bred snakes, lizards, frogs, and feeders, run by people who breed the animals and will talk you out of the wrong one.",
  address: {
    street: "364 Albany Turnpike",
    city: "Canton",
    region: "CT",
    postal: "06019",
    country: "US",
    line: "364 Albany Turnpike, Canton, CT 06019",
  },
  phones: {
    shop: { display: "(860) 674-0160", href: "tel:+18606740160" },
    booking: { display: "(860) 888-5130", href: "tel:+18608885130" },
  },
  emails: {
    adam: "Adam@harrisinwonderland.com",
    seth: "Seth@harrisinwonderland.com",
  },
  links: {
    collection: "https://my-hiwsite-6573.square.site/available-animals",
    feeders: "https://my-hiwsite-6573.square.site/shop/feeders-for-pick-up/17",
    maps: "https://maps.google.com/?q=364+Albany+Turnpike+Canton+CT+06019",
    mapsEmbed:
      "https://maps.google.com/maps?q=364%20Albany%20Turnpike%20Canton%20CT%2006019&z=15&output=embed",
    facebook: "https://www.facebook.com/profile.php?id=100063473713270",
    instagram: "https://www.instagram.com/harris_in_wonderland_pets/",
  },
  timezone: "America/New_York",
} as const;

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collection", label: "Collection" },
  { to: "/care", label: "Care" },
  { to: "/story", label: "Story" },
  { to: "/visit", label: "Visit" },
] as const;

export const MARQUEE = [
  "Ball pythons",
  "Hognose",
  "Corns",
  "Dragons",
  "Dart frogs",
  "Red-foots",
  "Feeders",
  "Birthday programs",
  "Captive-bred",
  "Care sheets",
  "Giant day gecko",
  "White's",
] as const;

export const KEEPERS = [
  {
    role: "Founder",
    name: "Seth Harris",
    bio: "UConn biology. 31 years at Granby Memorial. Fifty years of fish. He built the first shop as a house of tanks.",
  },
  {
    role: "Reptiles",
    name: "Adam Harris",
    bio: "Hartwick biology. Two decades breeding. Field time in Costa Rica, Thailand, Australia, South Africa, and the Bahamas.",
  },
  {
    role: "Husbandry",
    name: "Ashlee Carlson",
    bio: "The person keepers ask whether that animal is actually a good fit. She will shrink a ticket if the setup is not ready.",
  },
] as const;

export const TIMELINE = [
  {
    when: "1940s · West Hartford",
    title: "Seth starts with fish",
    body: "A breeding hobby, then New Britain Avenue, then a teaching career and the military closed the first shop.",
  },
  {
    when: "1999 · Bloomfield",
    title: "Reopened next to a bar",
    body: "Four hundred square feet, then 1,800 next door. Six years of the modern shop.",
  },
  {
    when: "Avon",
    title: "Two village rooms",
    body: "Old Avon Village, then street level. The collection outgrew both.",
  },
  {
    when: "Now · Canton",
    title: "364 Albany Turnpike",
    body: "Parking, access, road frontage, and room for the live collection. The snake-handle door is on Route 44.",
  },
] as const;

export const CONTACT_TOPICS = [
  "General question",
  "Looking for an animal",
  "Birthday / program",
  "Care sheet / husbandry",
  "Supplies / feeders",
  "Fish room / ponds",
] as const;