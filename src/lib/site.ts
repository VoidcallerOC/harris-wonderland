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
  landmark:
    "Grey building on Route 44, attached to BreMar Rentals. Snake-handle door toward the right side of the building.",
  phones: {
    shop: { display: "(860) 674-0160", href: "tel:+18606740160" },
    booking: {
      display: "(860) 888-5130",
      href: "tel:+18608885130",
      note: "If you have trouble getting through, or to make an appointment.",
    },
  },
  emails: {
    adam: "Adam@harrisinwonderland.com",
    seth: "Seth@harrisinwonderland.com",
  },
  links: {
    collection: "https://my-hiwsite-6573.square.site/available-animals",
    feeders: "https://my-hiwsite-6573.square.site/shop/feeders-for-pick-up/17",
    // TODO: swap to the Square merch category URL once Adam stocks it.
    merch: "https://my-hiwsite-6573.square.site",
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
  { to: "/rentals", label: "Rentals" },
  { to: "/story", label: "Story" },
  { to: "/visit", label: "Visit" },
] as const;

export const MARQUEE = [
  "Ball pythons",
  "Hognose",
  "Corns",
  "Kings",
  "Dragons",
  "Dart frogs",
  "Red-foots",
  "Feeders they raise",
  "Birthday programs",
  "Pond installs",
  "Marine room",
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

export const REMEMBERING = {
  name: "Jim White",
  role: "Fish room",
  bio: "Jim worked the fish room for several years — African cichlids especially — and was an active member of the Pioneer Valley Aquarium Society. He passed unexpectedly. The shop still talks about his enthusiasm, and so do the people he helped.",
} as const;

export const TIMELINE = [
  {
    when: "1940s · West Hartford",
    title: "Seth starts with fish",
    body: "A breeding hobby out of the house, then a shop on New Britain Avenue while he studied biology at UConn. Military service and 31 years teaching at Granby Memorial closed the first shop.",
  },
  {
    when: "1999 · Bloomfield",
    title: "Reopened next to a bar",
    body: "October 1999: four hundred square feet adjacent to a bar, then 1,800 next door once the smoke got old. Six years of the modern shop.",
  },
  {
    when: "Avon",
    title: "Two village rooms",
    body: "Old Avon Village downstairs for seven years, then street level a quarter-mile away for four. The collection outgrew both.",
  },
  {
    when: "Now · Canton",
    title: "364 Albany Turnpike",
    body: "Parking, handicapped access, road frontage. Grey building attached to BreMar Rentals. The snake-handle door is the landmark.",
  },
] as const;

export const DIRECTIONS = [
  {
    from: "I-91 · Hartford",
    body: "Trumbull Street exit. Straight off the ramp, second right onto Route 44. Stay on 44 over Avon Mountain, through Avon center, into Canton — about nine miles. Grey building on the left, attached to BreMar Rentals.",
  },
  {
    from: "Granby / East Granby",
    body: "10/202 south to Route 44, turn right — O'Neill's Buick is the opposite corner. 4.7 miles on 44. Snake-handle door on the right side of the building.",
  },
  {
    from: "Farmington / Unionville",
    body: "Route 10 north to 44, left at Avon Old Farms Inn. Through Avon into Canton (the road becomes Albany Turnpike). Same grey building, attached to BreMar.",
  },
] as const;

export const PROGRAMS = [
  {
    title: "Birthday programs",
    body: "The animals are the event. About twenty creatures from around the world, a chance to hold a live reptile, a feeding demonstration if you want it. Not a bounce-house with a snake in the corner. Book ahead — these fill.",
  },
  {
    title: "Schools, libraries, scouts",
    body: "Adam will come to a classroom, library, or scouting event with the same collection and the same honest talk. Mention ages, group size, and whether anyone is new to reptiles.",
  },
] as const;

export const RENTAL_EVENTS = [
  {
    role: "Parties",
    title: "Birthdays & private events",
    body: "The animals are the entertainment — about twenty creatures, a chance to hold one, a feeding demo if you want it. Hands-on for the brave, observe-only for the rest.",
  },
  {
    role: "Photo & content",
    title: "Photoshoots",
    body: "Reptiles for portrait, editorial, brand, and social shoots. Calm, camera-tested animals with a keeper just off-frame.",
  },
  {
    role: "Film & TV",
    title: "Movies & production",
    body: "On-set animal talent for film, television, music video, and commercial work. A handler stays with the animals the whole day.",
  },
  {
    role: "Education",
    title: "Schools, libraries, scouts",
    body: "Biology-forward programs from trained teachers — the science is real, not a script. Mention ages and group size.",
  },
  {
    role: "Production",
    title: "Corporate, expo & events",
    body: "Booth draws, product launches, festivals, team events — a rack of animals people line up to meet.",
  },
] as const;

export const MERCH_CATEGORIES = [
  {
    role: "Apparel",
    title: "Tees & hoodies",
    body: "The wordmark and the snake-handle door on soft cotton. Keeper and kid sizes.",
    ships: "Ships anywhere",
  },
  {
    role: "Wall",
    title: "Prints & posters",
    body: "Looking-glass animals and specimen plates, framed for the reptile room.",
    ships: "Ships anywhere",
  },
  {
    role: "Small goods",
    title: "Stickers & patches",
    body: "Day gecko, ball python, the mark. The cheap way to fly the flag.",
    ships: "Ships anywhere",
  },
  {
    role: "Give it",
    title: "Gift cards",
    body: "For the person building a first enclosure. Any amount, spend in store or online.",
    ships: "Store & online",
  },
  {
    role: "Drinkware",
    title: "Mugs & bottles",
    body: "Route 44 enamel. Coffee for the morning feed.",
    ships: "Ships anywhere",
  },
  {
    role: "Keepers",
    title: "Hats",
    body: "Low-profile shop caps. The Saturday feeder-run uniform.",
    ships: "Ships anywhere",
  },
] as const;

export const RENTAL_EVENT_TYPES = [
  "Birthday / private party",
  "Photoshoot / content",
  "Film / TV / production",
  "Educational program",
  "Corporate / expo / event",
  "Something else",
] as const;

export const CONTACT_TOPICS = [
  "General question",
  "Looking for an animal",
  "Birthday / program",
  "Care sheet / husbandry",
  "Supplies / feeders",
  "Fish room / marine",
  "Pond estimate",
  "Sugar glider / mammal",
] as const;
