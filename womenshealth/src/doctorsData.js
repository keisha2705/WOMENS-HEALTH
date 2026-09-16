
export const DOCTORS_DATA = [

  {
    id: "dr_johnson",
    name: "Dr. Yungmi Smith",
    title: "Pediatric Gynecology",
    credentials: "MD, FACOG, Pediatric Fellowship",
    consultationFee: 140,
    location: "Winchester Hills",
    address:
      "Winchester Hills Clinical Hub, 42 Swartgoud Street, Winchester Hills, Johannesburg, 2091, South Africa",
    rating: "4.7",
    experience: "5 years +",
    biography:
      "Dr. Smith focuses on adolescent reproductive maturation profiles, cycle optimization routines, and gentle endocrinology clinical metrics.",
    image: "/dct1.jpg"
  },

  {
    id: "dr_preeha_2",
    name: "Dr. Peter Johnson",
    title: "Gynecologist",
    credentials: "MD, Comprehensive Care Specialist",
    consultationFee: 125,
    location: "Glenanda",
    address:
      "Glenwood Health Center, 88 Letaba Road, Glenanda, Johannesburg, 2091, South Africa",
    rating: "4.9",
    experience: "6 years +",
    biography:
      "A secondary care hub focusing on continuous screening loops, preventative medicine, and cycle tracking analytics.",
    image: "/dct2.jpg"
  },

  {
    id: "dr_johnson_2",
    name: "Dr. Johnson Smith",
    title: "Pediatric Gynecology",
    credentials: "MD, Resident Pediatric Lead",
    consultationFee: 135,
    location: "Glenanda",
    address:
      "Medi-Cross Center, 55 Amanda Avenue, Glenanda, Johannesburg, 2091, South Africa",
    rating: "4.7",
    experience: "8 years +",
    biography:
      "Specialized diagnostics specializing in structural development coordinates and hormone mapping variables.",
    image: "/dct3.jpg"
  },

  {
    id: "dr_sarah_k",
    name: "Dr. Peter Patrelie",
    title: "Obstetrician & Gynecologist",
    credentials: "MBChB, FCOG (SA)",
    consultationFee: 130,
    location: "Oakdene",
    address:
      "Oakdene Medical & Dental, 78 Boundary Road, Oakdene, Johannesburg, 2190, South Africa",
    rating: "4.8",
    experience: "10 years +",
    biography:
      "Dr. Khumalo focuses on high-risk maternal healthcare loops and comprehensive physical parameter mapping.",
    image: "/dct4.jpg"
  },

  {
    id: "dr_amara",
    name: "Dr. Agmed Singh",
    title: "Reproductive Endocrinologist",
    credentials: "MD, PhD in Reproductive Science",
    consultationFee: 160,
    location: "Mondeor",
    address:
      "Mondeor Professional Suites, 114 Columbine Avenue, Mondeor, Johannesburg, 2091, South Africa",
    rating: "5.0",
    experience: "12 years +",
    biography:
      "Leading expert in PCOS metrics management, metabolic-driven cycle charting, and diagnostic tracking grids.",
    image: "/dct5.jpg"
  },

  {
    id: "dr_david_m",
    name: "Dr. David Miller",
    title: "Urogynaecologist",
    credentials: "MD, FRCOG",
    consultationFee: 150,
    location: "Winchester Hills",
    address:
      "Southern Suburbs Gynae Clinic, 19 Winchester Drive, Winchester Hills, Johannesburg, 2091, South Africa",
    rating: "4.6",
    experience: "15 years +",
    biography:
      "Specialized clinical therapy for pelvic platform rehabilitation, fluid dynamics, and long-form operational recoveries.",
    image: "/dct6.jpg"
  },

  {
    id: "dr_lisa_t",
    name: "Dr. Lisa Taylor",
    title: "Gynecologist",
    credentials: "MD, Minimally Invasive Surgery Lead",
    consultationFee: 145,
    location: "Glenanda",
    address:
      "The Linmed Consultation Chambers, 34 Glen Avenue, Glenanda, Johannesburg, 2091, South Africa",
    rating: "4.9",
    experience: "7 years +",
    biography:
      "Advanced keyhole surgical procedures, severe endometriosis management, and pain mapping tracking profiles.",
    image: "/dct7.jpg"
  },

  {
    id: "dr_thabo_m",
    name: "Dr. Thabo Mokoena",
    title: "Fertility Specialist",
    credentials: "MBChB, MMed (O&G)",
    consultationFee: 165,
    location: "Bassonia",
    rating: "4.8",
    experience: "9 years +",
    address:
      "Bassonia Estate Medical Rooms, 2 Comaro Wilderness Street, Bassonia, Johannesburg, 2061, South Africa",
    biography:
      "Assisted reproduction pipelines, egg quality tracking parameters, and comprehensive ovulation scheduling.",
    image: "/dct8.jpg"
  },

  // Automatically generating clean physical address lines for remaining dataset entries

  ...Array.from({ length: 21 }, (_, i) => {
    const locations = [
      { sub: "Glenanda", str: "102 Vorster Ave" },
      { sub: "Winchester Hills", str: "64 Swartgoud St" },
      { sub: "Oakdene", str: "12 Boundary Rd" },
      { sub: "Bassonia", str: "45 Comaro St" },
      { sub: "Mondeor", str: "201 Columbine Ave" }
    ][i % 5];

    return {
      id: `dr_generated_${i + 10}`,

      name: `Dr. ${
        [
          "Rachel Green",
          "Michael Chang",
          "Fatima Patel",
          "Chloe Dubois",
          "Nia Jones",
          "Oliver Smith",
          "Aisha Bello",
          "Yuki Sato"
        ][i % 8]
      } ${String.fromCharCode(65 + i)}`,

      title:
        i % 3 === 0
          ? "Pediatric Gynecology"
          : i % 3 === 1
          ? "Gynecologist"
          : "Fertility Specialist",
      credentials: "MD, Board Certified Specialist Profile",
      consultationFee: 110 + i * 2,
      location: locations.sub,
      address: `${locations.str}, ${locations.sub}, Johannesburg, South Africa`,
      rating: (4.5 + (i % 5) * 0.1).toFixed(1),
      experience: `${4 + (i % 5)} years +`,
      biography:
        "Comprehensive, transparent wellness provider dedicated to private isolation parameters and digital log integration configurations.",
      image: `/dct${9 + (i % 7)}.jpg`
    };
  })
];