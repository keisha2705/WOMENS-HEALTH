import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Productspage.css";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("userWishlist")) || [];
    setWishlist(savedWishlist);
  }, []);
  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation(); // Stops the deep-dive modal from popping up when clicking the "+"

    const storedToken = localStorage.getItem("authToken");

    // Safety check guard clause
    if (!storedToken) {
      alert("No active session found. Please log back in to your account.");
      return;
    }

    // Capture whichever ID is currently present on the active product card node object
    const targetProductId = product._id || product.id;

    try {
      console.log(
        "Attempting to write wishlist choice to MongoDB database collection...",
        targetProductId,
      );

      
      const res = await fetch("http://32.198.180", {

        method: "POST",
        headers: {
          "Authorization": `Basic ${storedToken}`, 
  "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: targetProductId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Server endpoint could not register document insert.",
        );
      }

      alert(
        data.message ||
          `${product.name || product.label} saved successfully to your MongoDB account!`,
      );
    } catch (err) {
      console.warn(
        "Backend route rejected request or is unreachable. Diverting to local browser storage failsafe...",
        err,
      );
      const currentWishlist =
        JSON.parse(localStorage.getItem("userWishlist")) || [];
      const isAlreadySaved = currentWishlist.some(
        (item) => (item._id || item.id) === targetProductId,
      );

      if (isAlreadySaved) {
        alert(
          `${product.name || product.label} is already present in your saved collection.`,
        );
        return;
      }

      const updatedList = [...currentWishlist, product];
      localStorage.setItem("userWishlist", JSON.stringify(updatedList));

      alert(
        `${product.name || product.label} saved to your personal dashboard space!`,
      );
    }
  };

  return (
    <main className="homepage">
      <div className="homepage-container">
        <Navbar />

        <header className="page-section-header">
          <span className="hero-tagline">Health Literacy Catalog</span>
          <h1 className="homepage-hero-title">Reproductive Health Products</h1>
          <p className="homepage-hero-description">
            Objective, evidence-based details on menstrual and contraceptive
            care. Tap any item to inspect clinical benefits, side effects, and
            verified purchasing channels across South Africa.
          </p>
        </header>

        {/* 4 Items Per Row Grid Layout */}
        <section className="products-grid-layout">
          {PRODUCT_CATALOG.map((product) => (
            <div
              key={product.id}
              className="product-display-card"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Wishlist Add Plus Action Trigger */}
              <button
                type="button"
                className="wishlist-plus-badge"
                onClick={(e) => handleAddToWishlist(e, product)}
                title="Add to Wishlist"
              >
                +
              </button>

              <div className="product-card-image-box">
                <img src={product.imgSrc} alt={product.label} />
              </div>

              <div className="product-card-meta">
                <span className="product-category-tag">{product.category}</span>
                <h3 className="product-card-title">{product.label}</h3>
                <p className="product-card-snippet">{product.desc}</p>
                <div className="product-card-footer">
                  <span className="product-est-price">{product.saPricing}</span>
                  <span className="inspect-link-text">Read Analysis →</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Deep-Dive Knowledge Modal Overlay */}
      {selectedProduct && (
        <div
          className="modal-backdrop-blur"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-deep-dive-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-trigger"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <div className="modal-split-viewport">
              <div className="modal-hero-visual">
                <img src={selectedProduct.imgSrc} alt={selectedProduct.label} />
                <span className="modal-price-banner">
                  {selectedProduct.saPricing}
                </span>
              </div>

              <div className="modal-knowledge-content">
                <span className="modal-meta-tag">
                  {selectedProduct.category}
                </span>
                <h2>{selectedProduct.label}</h2>
                <p className="modal-lead-paragraph">{selectedProduct.desc}</p>

                <div className="knowledge-blocks-stack">
                  <div className="knowledge-block">
                    <h4>Clinical Efficacy & Material Profile</h4>
                    <p>{selectedProduct.detailedKnowledge.clinicalProfile}</p>
                  </div>

                  <div className="knowledge-block">
                    <h4>Health Considerations & Risks</h4>
                    <p>{selectedProduct.detailedKnowledge.risks}</p>
                  </div>

                  <div className="knowledge-block availability-highlight">
                    <h4>Where to Find it in South Africa</h4>
                    <ul>
                      {selectedProduct.detailedKnowledge.saAvailability.map(
                        (store, index) => (
                          <li key={index}> - {store}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

// Comprehensive verified regional product schema data
const PRODUCT_CATALOG = [
  {
    id: "prod-cup",
    label: "Menstrual Cups",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh30.jpg",
    saPricing: "From R160 - R350",
    desc: "Reusable bell-shaped catch devices made of premium medical-grade silicone.",
    detailedKnowledge: {
      clinicalProfile:
        "Crafted from 100% hypoallergenic medical-grade silicone. Can be worn safely for up to 12 consecutive hours. Reusable for up to 5–10 years, drastically lowering long-term personal costs and environmental waste footprints.",
      risks:
        "Requires proper sterilization via boiling water between menstrual cycles. Mild learning curve regarding manual insertion and structural vacuum-seal breaking configurations during removal.",
      saAvailability: [
        "Mina Cup variants are widely stocked at major national pharmacies like Clicks Group Stores.",
        "Faithful to Nature online stores (Goddess Cup and alternative eco-friendly options).",
        "Dis-Chem Pharmacies feminine hygiene aisles.",
      ],
    },
  },
  {
    id: "prod-iud",
    label: "Hormonal IUDs",
    category: "Contraception",
    imgSrc: "/WhImages/wh1.jpg",
    saPricing: "R2,000 - R3,500 upfront",
    desc: "Small T-shaped intrauterine devices releasing localized levonorgestrel progesterone.",
    detailedKnowledge: {
      clinicalProfile:
        "Over 99% effective at preventing pregnancy. Works continuously for 3 to 5 years depending on the selected hardware brand. Greatly lightens flow volumes and mitigates severe dysmenorrhea.",
      risks:
        "Must be inserted by a licensed gynaecologist or clinical health practitioner. May provoke benign irregular spotting cycles during the initial 3–6 months post-placement.",
      saAvailability: [
        "Mirena or Kyleena systems are accessible via consultation at Marie Stopes South Africa clinics.",
        "Available via prescription ordering patterns at Dis-Chem and Clicks dispensaries.",
        "Private obstetricians and gynaecologists countrywide.",
      ],
    },
  },
  {
    id: "prod-organic",
    label: "Organic Pads",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh2.jpg",
    saPricing: "From R35 per pack",
    desc: "Biodegradable, chemical-free sanitary pads made with certified pure organic cotton.",
    detailedKnowledge: {
      clinicalProfile:
        "Top-sheet woven using 100% organic cotton fabrics. Unbleached by chlorine and entirely free of synthetic fragrances, plastics, or wood pulps. Highly breathable and optimal for skin profiles prone to contact rashes.",
      risks:
        "Requires the same standard changing frequency as regular synthetic pads (every 4–6 hours) to prevent bacterial collection.",
      saAvailability: [
        "ANNA Pure Organic Pads are available at Pick n Pay supermarkets and Woolworths holdings.",
        "Organyc and Petallite pads are regularly stocked on Faithful to Nature's digital store platforms.",
        "Superbalist and online health apothecaries.",
      ],
    },
  },
  {
    id: "prod-fertility",
    label: "Fertility Tracking Kits",
    category: "Monitoring",
    imgSrc: "/WhImages/wh3.jpg",
    saPricing: "From R210 - R400",
    desc: "High-precision digital basal body thermometers combined with LH test strips.",
    detailedKnowledge: {
      clinicalProfile:
        "Thermometer records temperature to two decimal places (e.g., 36.55°C) to record the subtle resting temperature spike indicating that ovulation has successfully occurred.",
      risks:
        "Demands strict adherence—measurements must be recorded immediately upon waking up at the exact same hour every single morning before getting out of bed.",
      saAvailability: [
        "OvaTrack and Ovatract high-precision measurement kits are found on Home Insemination Solutions South Africa.",
        "FirstView Digital Basal Thermometers are available via Homedoc ZA or Takealot online logistics.",
        "Selected larger independent pharmaceutical outlets.",
      ],
    },
  },

  {
    id: "prod-cup-mina",
    label: "Mina Menstrual Cup",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh30.jpg",
    saPricing: "R250 - R320",
    desc: "Premium, locally manufactured medical-grade silicone bell cup.",
    detailedKnowledge: {
      clinicalProfile:
        "100% hypoallergenic, medical-grade silicone. Free from dyes, toxins, or bleaches. Can collect flow for up to 12 hours safely.",
      risks:
        "Requires accessible clean running water for sanitization cycles. Learning curve during initial placement.",
      saAvailability: [
        "Stocked across major Clicks Group stores nationally.",
        "Dis-Chem Pharmacies feminine hygiene aisles.",
        "Directly through Mina Cup SA online portals.",
      ],
    },
  },

  {
    id: "prod-cup-goddess",
    label: "Goddess Menstrual Cup",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh4.jpg",
    saPricing: "R280 - R350",
    desc: "South African designed reusable cup customized for varying cervix heights.",
    detailedKnowledge: {
      clinicalProfile:
        "FDA-approved medical silicone body. Flexible structural walls designed to minimize bladder pressure configurations.",
      risks:
        "Requires boiling for 5-7 minutes between cycles. Improper seal breaking may cause minor cramping.",
      saAvailability: [
        "Faithful to Nature online stores.",
        "Selected independent health shops in Gauteng and Western Cape.",
        "Takealot.com automated delivery.",
      ],
    },
  },

  {
    id: "prod-pads-anna",
    label: "ANNA Pure Organic Pads",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh5.jpg",
    saPricing: "R38 - R48 per pack",
    desc: "South Africa's first homegrown organic cotton eco-sanitary pad.",
    detailedKnowledge: {
      clinicalProfile:
        "Made from unbleached organic cotton fibers and sustainable tree pulp. 100% biodegradable and compostable.",
      risks:
        "Lacks synthetic absorbent polymers, requiring routine changes every 4 hours during heavy flows.",
      saAvailability: [
        "Woolworths Food and Beauty segments.",
        "Pick n Pay Supermarkets nationwide.",
        "Checkers Hyper wellness zones.",
      ],
    },
  },

  {
    id: "prod-tampons-flo",
    label: "Flo Organic Tampons",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh6.jpg",
    saPricing: "R65 - R80 per pack",
    desc: "Certified organic cotton tampons featuring sugarcane compact applicators.",
    detailedKnowledge: {
      clinicalProfile:
        "100% GOTS-certified organic cotton core. Avoids synthetic fibers like rayon to minimize Toxic Shock Syndrome (TSS) relative risks.",
      risks:
        "Must be changed every 4–8 hours strictly. Do not use overnight unless waking up within the timeframe limits.",
      saAvailability: [
        "Clicks Group online and flagship stores.",
        "Faithful to Nature retail branches.",
        "Wellness Warehouse channels.",
      ],
    },
  },

  {
    id: "prod-briefs-boody",
    label: "Boody Bamboo Period Briefs",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh7.jpg",
    saPricing: "R320 - R390 each",
    desc: "Ultra-absorbent leak-proof period panties woven from organic bamboo.",
    detailedKnowledge: {
      clinicalProfile:
        "Quad-layer technical textile matrix holds equivalent fluid capacity of up to 4 tampons. Odour-neutralizing organic fibers.",
      risks:
        "Demands careful cold-water rinse cycles and air-drying to maintain technical membrane integrity.",
      saAvailability: [
        "Boody South Africa official digital portal.",
        "Wellness Warehouse outlets countrywide.",
        "Selected organic lifestyle boutiques.",
      ],
    },
  },

  {
    id: "prod-pads-petallite",
    label: "Petallite Washable Cloth Pads",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh8.jpg",
    saPricing: "R120 - R200 per pack",
    desc: "Reusable, snaps-secured fleece and cotton cloth pads.",
    detailedKnowledge: {
      clinicalProfile:
        "Breathable polyester fleece backing with highly absorbent bamboo charcoal layers. Lifespan of up to 3 years.",
      risks:
        "Requires active soaking and washing regimens, presenting challenges in low-water environments.",
      saAvailability: [
        "Takealot.com online shipping.",
        "Independent green markets across Cape Town and Durban.",
        "Petallite digital portal.",
      ],
    },
  },

  {
    id: "prod-tampons-lillets",
    label: "Lil-lets Organic Cotton Tampons",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh9.jpg",
    saPricing: "R45 - R60 per pack",
    desc: "Fragrance-free organic core tampons expanding widthways to fit naturally.",
    detailedKnowledge: {
      clinicalProfile:
        "Completely elemental chlorine-free bleaching profiles. Wrapped in 100% recyclable paper wrappers.",
      risks:
        "Requires proper hand hygiene before applicator-free insertion configurations.",
      saAvailability: [
        "Dis-Chem Pharmacies.",
        "Shoprite and Checkers supermarket networks.",
        "Spar retail stores.",
      ],
    },
  },

  {
    id: "prod-disc-lumma",
    label: "Lumma Menstrual Disc",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh10.jpg",
    saPricing: "R550 - R700",
    desc: "Flat-fitting reusable medical silicone disc with a unique removal string.",
    detailedKnowledge: {
      clinicalProfile:
        "Sits comfortably within the vaginal fornix right underneath the cervix, allowing mess-free penetrative sexual intercourse during menstruation cycles.",
      risks:
        "Can result in messy extraction procedures if the disc tilts during removal.",
      saAvailability: [
        "Imported and distributed through selected online intimate wellness boutiques in South Africa.",
        "Amazon.co.za local delivery handles.",
      ],
    },
  },

  {
    id: "prod-pads-kotex-eco",
    label: "Kotex Natural Cotton Pads",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh11.jpg",
    saPricing: "R30 - R40 per pack",
    desc: "Hypoallergenic commercial pads featuring 0% plastic top-sheets.",
    detailedKnowledge: {
      clinicalProfile:
        "Dermatologically tested soft cotton top covering. Free from fragrances, artificial inks, and processing allergens.",
      risks:
        "Uses standard plastic backing barriers, reducing absolute biodegradability speeds compared to full organic alternatives.",
      saAvailability: [
        "Available at all major South African mass retail grocers (Pick n Pay, Checkers, Spar, Shoprite).",
        "Clicks and Dis-Chem storefronts.",
      ],
    },
  },

  {
    id: "prod-cup-saalt",
    label: "Saalt Menstrual Cup",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh12.jpg",
    saPricing: "R650 - R780",
    desc: "Premium soft-molded medical cup imported from the United States.",
    detailedKnowledge: {
      clinicalProfile:
        "Renowned for an incredibly smooth satin finish that simplifies insertion. Bulbous shape assists rapid wall seal deployments.",
      risks:
        "Higher initial upfront capital costs compared to local South African cup alternatives.",
      saAvailability: [
        "BeBare Hair and Skin boutique online distribution.",
        "Faithful to Nature channels.",
        "Takealot marketplace dealers.",
      ],
    },
  },

  {
    id: "prod-sponge-sea",
    label: "Premium Intimate Sea Sponges",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh13.jpg",
    saPricing: "R180 - R260 per pair",
    desc: "All-natural, sustainably harvested ocean sponges used as internal tampons.",
    detailedKnowledge: {
      clinicalProfile:
        "Entirely renewable organic material. Contains natural oceanic enzymes that resist odors. Free from chemicals.",
      risks:
        "Highly controversial clinically. Difficult to sterilize completely due to porous cell geometry. May harbor micro-bacterial colonies.",
      saAvailability: [
        "Selected holistic natural healing spaces.",
        "Alternative health e-commerce portals based in SA.",
      ],
    },
  },

  {
    id: "prod-liner-bamboo",
    label: "Cherub Tree Bamboo Pantyliners",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh14.jpg",
    saPricing: "R90 - R140 per pack",
    desc: "Washable, hyper-thin daily protection liners made of charcoal-infused bamboo.",
    detailedKnowledge: {
      clinicalProfile:
        "Super-soft microfleece layer prevents moisture accumulation, minimizing the development of recurrent candidiasis (thrush).",
      risks:
        "Must be changed frequently on heavy discharge days to prevent outer leakages.",
      saAvailability: [
        "Cherub Tree South Africa digital hub.",
        "Independent zero-waste grocery dispensaries.",
      ],
    },
  },

  {
    id: "prod-disc-nixit",
    label: "Nixit Menstrual Disc",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh15.jpg",
    saPricing: "R750 - R890",
    desc: "Premium rim-set circular suction-free period disc.",
    detailedKnowledge: {
      clinicalProfile:
        "Ultra-soft, ultra-pliable memory silicone structure that conforms to vaginal walls without requiring suction pressure.",
      risks:
        "Requires deep internal manual placement behind the pubic bone layout.",
      saAvailability: [
        "Specialty online pelvic health distributors.",
        "Selected boutique women's health clinics in Johannesburg and Cape Town.",
      ],
    },
  },

  {
    id: "prod-pads-subzpads",
    label: "Subz Pads Reusable Pack",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh16jpg",
    saPricing: "R150 - R220 complete kit",
    desc: "Eco-friendly, clipping sanitary pads designed for long-term school support initiatives.",
    detailedKnowledge: {
      clinicalProfile:
        "Hydrophobic fabrics hold the inner cotton mechanics in place. Durable up to 5 full calendar years with standard hand washing.",
      risks:
        "Slightly thicker profile layout structure compared to modern disposable ultra-thin variants.",
      saAvailability: [
        "Subz Org official NGO distributing platforms.",
        "Direct order lines for community upliftment projects.",
      ],
    },
  },

  {
    id: "prod-cup-sterilizer",
    label: "Clicks Electric Cup Sterilizer",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh17.jpg",
    saPricing: "R350 - R450",
    desc: "Compact steam-sterilization appliance built for internal medical devices.",
    detailedKnowledge: {
      clinicalProfile:
        "Utilizes high-temperature targeted steam to eliminate 99.9% of bacteria, molds, and viruses without structural chemical damage to silicone polymers.",
      risks: "Requires active electrical grid access to operate.",
      saAvailability: [
        "Clicks Group pharmacies nationwide (Larger super-store branches).",
        "Clicks.co.za digital inventory.",
      ],
    },
  },

  {
    id: "prod-wipes-fem",
    label: "Femagene Intimate Wipes",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh18.jpg",
    saPricing: "R35 - R45 per pack",
    desc: "pH-balanced, soap-free cleansing wipes for outer vulval freshness.",
    detailedKnowledge: {
      clinicalProfile:
        "Infused with soothing parameters like Aloe Vera and chamomile. Formulated at a target pH of 4.5 to protect local ecosystems.",
      risks:
        "Overuse can disrupt internal vaginal flora balances. Never use inside the canal structure.",
      saAvailability: [
        "Dis-Chem Pharmacies.",
        "Pick n Pay, Checkers, and major local supermarkets.",
      ],
    },
  },

  {
    id: "prod-wipes-yes",
    label: "Yes Water-Based Intimate Wipes",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh19.jpg",
    saPricing: "R110 - R150 per pack",
    desc: "Ultra-pure organic certified flushable intimate cloth structures.",
    detailedKnowledge: {
      clinicalProfile:
        "100% plant-based cloth materials. Zero parabens, petrochemicals, or glycerin compounding additions.",
      risks:
        "Significantly higher per-wipe unit costs compared to commercial offerings.",
      saAvailability: [
        "Faithful to Nature digital stores.",
        "Boutique medical dermatology networks across South Africa.",
      ],
    },
  },

  {
    id: "prod-cleanser-cup",
    label: "Saalt Wash Intimate Cleanser",
    category: "Menstrual Care",
    imgSrc: "/WhImages/wh20.jpg",
    saPricing: "R220 - R290",
    desc: "Premium, low-foaming cleanser for both silicone cups and body wash use.",
    detailedKnowledge: {
      clinicalProfile:
        "Formulated without harsh chemicals or artificial scents that could degrade medical-grade silicone properties or irritate skin.",
      risks:
        "Must be thoroughly rinsed off devices prior to internal re-insertion.",
      saAvailability: [
        "Boutique health distributors.",
        "Takealot.com online retail pipelines.",
      ],
    },
  },

  // ==========================================
  // SECTION 2: CONTRACEPTIVES & HORMONAL ROUTINES (17 Products)
  // ==========================================

  {
    id: "prod-pill-yasmin",
    label: "Yasmin Oral Contraceptive",
    category: "Contraception",
    imgSrc: "/WhImages/wh21.jpg",
    saPricing: "R280 - R380 per month",
    desc: "Combined low-dose oral contraceptive tablet strip containing drospirenone.",
    detailedKnowledge: {
      clinicalProfile:
        "Suppresses ovulation cycles reliably. Highly effective at treating moderate acne and reducing premenstrual water retention flags.",
      risks:
        "Slightly increased absolute risk profile for Deep Vein Thrombosis (blood clots). Strictly contraindicated for smokers over 35.",
      saAvailability: [
        "Requires a valid medical script (Doctor or Clinics). Accessible at all corporate pharmacy dispensaries (Clicks, Dis-Chem, MediRite).",
      ],
    },
  },

  {
    id: "prod-pill-mural",
    label: "Oralcon Combined Pill",
    category: "Contraception",
    imgSrc: "/WhImages/wh22.jpg",
    saPricing: "R20 - R50 (Often Free at State Clinics)",
    desc: "Widely utilized public and private sector low-cost daily birth control option.",
    detailedKnowledge: {
      clinicalProfile:
        "Contains levonorgestrel and ethinylestradiol. High baseline effectiveness when taken at the exact same hour daily.",
      risks:
        "Missing a dose window quickly reduces active efficacy. Can trigger initial temporary nausea.",
      saAvailability: [
        "Available free of charge at all South African public government clinics.",
        "Over-the-counter script fills at corporate pharmacies.",
      ],
    },
  },

  {
    id: "prod-patch-evra",
    label: "Evra Contraceptive Patch",
    category: "Contraception",
    imgSrc: "/WhImages/wh22.jpg",
    saPricing: "R290 - R390 per month",
    desc: "Transdermal hormone delivery patch applied weekly to the skin.",
    detailedKnowledge: {
      clinicalProfile:
        "Delivers a steady flow of estrogen and progestin through skin layers. Eliminated the need for a daily pill compliance rule.",
      risks:
        "Skin irritation at the application site. May peel off prematurely if exposed to heavy oils or prolonged friction.",
      saAvailability: [
        "Private pharmacy dispensaries countrywide via prescription channels.",
      ],
    },
  },

  {
    id: "prod-inject-depo",
    label: "Depo-Provera Injection",
    category: "Contraception",
    imgSrc: "/WhImages/wh23.jpg",
    saPricing: "R80 - R150 (Free at State Clinics)",
    desc: "Progestin-only contraceptive injection administered every 12 weeks.",
    detailedKnowledge: {
      clinicalProfile:
        "Inhibits follicular maturation loops. Provides highly private birth control protection that lasts for 3 full months per dose.",
      risks:
        "Associated with a temporary decline in bone mineral density with long-term use. May delay the return of fertility for up to 10 months after discontinuing.",
      saAvailability: [
        "Public health facilities across SA.",
        "Dis-Chem/Clicks clinic sisters via professional script validations.",
      ],
    },
  },

  {
    id: "prod-inject-nur",
    label: "Nur-Isterate Injection",
    category: "Contraception",
    imgSrc: "/WhImages/wh24.jpg",
    saPricing: "R90 - R160 (Free at State Clinics)",
    desc: "Progestin birth control injection variant administered every 8 weeks.",
    detailedKnowledge: {
      clinicalProfile:
        "Norethisterone enanthate base solution. Optimal alternative if the user runs into weight management issues on longer 3-month injections.",
      risks:
        "Requires more frequent clinical visits (every 2 months) compared to standard Depo methods.",
      saAvailability: [
        "State community health centers.",
        "Private pharmacy health clinics via nurse consultations.",
      ],
    },
  },

  {
    id: "prod-ring-nuva",
    label: "NuvaRing Vaginal Insertion",
    category: "Contraception",
    imgSrc: "/WhImages/wh25.jpg",
    saPricing: "R300 - R420 per month",
    desc: "Flexible, transparent vaginal ring releasing localized contraceptive hormones.",
    detailedKnowledge: {
      clinicalProfile:
        "Self-inserted directly by the user. Kept in place for 3 consecutive weeks, followed by 1 ring-free week. Highly localized, low systemic hormone exposure.",
      risks:
        "May cause increased localized vaginal discharge or minor irritation profiles.",
      saAvailability: [
        "Available via specialist script configurations at all major private pharmacy distribution lines.",
      ],
    },
  },

  {
    id: "prod-iud-copper",
    label: "Nova-T Non-Hormonal Copper IUD",
    category: "Contraception",
    imgSrc: "/WhImages/wh26.jpg",
    saPricing: "R1,200 - R2,200 upfront",
    desc: "100% hormone-free copper-wrapped intrauterine framework device.",
    detailedKnowledge: {
      clinicalProfile:
        "Copper ions act as a natural spermicide. Highly effective long-acting reversible contraceptive (LARC) providing protection for up to 5–10 years.",
      risks:
        "Often increases baseline menstrual bleeding duration and intensity during the first 3-6 months post-insertion.",
      saAvailability: [
        "Marie Stopes South Africa surgical centers.",
        "Public tertiary teaching hospitals.",
        "Private gynaecology practices.",
      ],
    },
  },

  {
    id: "prod-implant-implanon",
    label: "Implanon NXT Subdermal Implant",
    category: "Contraception",
    imgSrc: "/WhImages/wh27.jpg",
    saPricing: "R1,800 - R2,800 (Free at State Clinics)",
    desc: "Small, matchstick-sized rod implanted just under the skin of the upper arm.",
    detailedKnowledge: {
      clinicalProfile:
        "Releases etonogestrel continuously. Provides exceptionally high contraceptive security (>99.9% efficacy) for 3 full years.",
      risks:
        "Can result in highly unpredictable light tracking spotting intervals or amenorrhea.",
      saAvailability: [
        "All Department of Health public clinics.",
        "Reproductive health NGO clinics.",
        "Private gynaecologists.",
      ],
    },
  },

  {
    id: "prod-pill-escappelle",
    label: "Escapelle Emergency Contraceptive",
    category: "Contraception",
    imgSrc: "/WhImages/wh28.jpg",
    saPricing: "R90 - R150",
    desc: "Single-dose emergency morning-after pill containing 1.5mg levonorgestrel.",
    detailedKnowledge: {
      clinicalProfile:
        "Prevents or delays ovulation if taken within 72 hours (3 days) of unprotected intercourse. Efficacy peaks the sooner it is consumed.",
      risks:
        "Will not terminate an existing pregnancy. May temporarily shift the arrival date of the next period.",
      saAvailability: [
        "Available over-the-counter without a script to anyone at all South African pharmacies (Schedule 2 designation).",
      ],
    },
  },

  {
    id: "prod-pill-ellaone",
    label: "ellaOne Advanced Emergency Pill",
    category: "Contraception",
    imgSrc: "/WhImages/wh29.jpg",
    saPricing: "R280 - R360",
    desc: "High-efficacy emergency contraceptive tablet containing ulipristal acetate.",
    detailedKnowledge: {
      clinicalProfile:
        "Maintains high effectiveness for up to 120 hours (5 days) post-intercourse. Capable of delaying ovulation even right before it is about to occur.",
      risks:
        "Cannot be safely combined with regular progesterone birth control methods within the same cycle phase.",
      saAvailability: [
        "Behind-the-counter access at Dis-Chem and Clicks pharmacies upon pharmacist consultation.",
      ],
    },
  },

  {
    id: "prod-condom-lovers",
    label: "Lovers Plus Premium Condoms",
    category: "Contraception",
    imgSrc: "/WhImages/wh30.jpg",
    saPricing: "R40 - R60 per pack of 3",
    desc: "Locally popular lubricated latex barriers for dual protection.",
    detailedKnowledge: {
      clinicalProfile:
        "Provides highly reliable protection against both unplanned pregnancy and STIs (including HIV) when used correctly.",
      risks:
        "Can tear if exposed to oil-based lubricants or damaged by sharp edges during opening.",
      saAvailability: [
        "Everywhere: supermarkets, filling stations, taverns, and pharmacies across South Africa.",
      ],
    },
  },

  {
    id: "prod-gel-corgon",
    label: "Gynol II Spermicidal Jelly",
    category: "Contraception",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R180 - R250",
    desc: "Immobilizing chemical vaginal gel containing Nonoxynol-9.",
    detailedKnowledge: {
      clinicalProfile:
        "Chemically destroys sperm cell membranes upon contact. Must be paired with a mechanical barrier (like a diaphragm) for reliable birth control.",
      risks:
        "Frequent usage can irritate sensitive vaginal tissues, which can inadvertently increase the risk of STI transmission.",
      saAvailability: [
        "Special order desks at corporate private pharmacy networks.",
      ],
    },
  },

  {
    id: "prod-cap-caya",
    label: "Caya Contraceptive Diaphragm",
    category: "Contraception",
    imgSrc: "/WhImages/wh30.jpg",
    saPricing: "R600 - R750",
    desc: "One-size-fits-most contoured silicone vaginal barrier cap.",
    detailedKnowledge: {
      clinicalProfile:
        "Hormone-free mechanical barrier covering the cervix completely. Washable and reusable for up to 2 years.",
      risks:
        "Must always be paired with contraceptive gel. Must remain in place for at least 6 hours post-intercourse.",
      saAvailability: [
        "Specialist women's health clinics.",
        "Imported stock distribution lanes via online wellness pharmacies.",
      ],
    },
  },

  {
    id: "prod-pill-qaira",
    label: "Qlaira Oral Contraceptive",
    category: "Contraception",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R350 - R440 per month",
    desc: "Advanced multi-phasic pill delivering estradiol valerate matching natural cycles.",
    detailedKnowledge: {
      clinicalProfile:
        "Uses a dynamic four-phase hormone step-down dosing structure. Highly effective at treating heavy, prolonged menstrual bleeding (menorrhagia).",
      risks:
        "Demands strict, sequential daily compliance due to the variable dosing schedule across the pill pack.",
      saAvailability: [
        "Private dispensaries upon presenting a current doctor's prescription layout document.",
      ],
    },
  },

  {
    id: "prod-pill-microval",
    label: "Microval Progestin-Only Pill",
    category: "Contraception",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R30 - R70 (Free at State Clinics)",
    desc: "Estrogen-free mini-pill tailored for breastfeeding mothers.",
    detailedKnowledge: {
      clinicalProfile:
        "Contains levonorgestrel. Does not impact breastmilk production quality or volume during postpartum lactation phases.",
      risks:
        "Has an incredibly strict 3-hour daily consumption window. Missing this window compromises contraceptive protection.",
      saAvailability: [
        "Public health clinics.",
        "Clicks and Dis-Chem dispensary sections countrywide.",
      ],
    },
  },

  {
    id: "prod-test-clearblue",
    label: "Clearblue Digital Pregnancy Test",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R90 - R140",
    desc: "Rapid digital urine assay test detecting early hCG hormone levels.",
    detailedKnowledge: {
      clinicalProfile:
        "Over 99% accurate from the day of your expected period. Features a clear digital readout display screen ('Pregnant' or 'Not Pregnant').",
      risks:
        "Testing too early before your missed period can return a false-negative result due to low initial hormone concentrations.",
      saAvailability: [
        "Every major pharmacy (Clicks, Dis-Chem) and supermarket chain (Checkers, Pick n Pay, Woolworths).",
      ],
    },
  },

  {
    id: "prod-test-strip",
    label: "FirstView hCG Pregnancy Strips",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R150 - R200 per pack of 10",
    desc: "Affordable, high-sensitivity bulk dipping test strips.",
    detailedKnowledge: {
      clinicalProfile:
        "Detects hCG concentrations down to 25 mIU/ml. Cost-effective option for individuals tracking fertility treatments or undergoing regular testing cycles.",
      risks:
        "Requires manual timing interpretation. Faint evaporation lines can cause confusion if read past the 5-minute testing window.",
      saAvailability: [
        "Homedoc ZA online shop.",
        "Takealot.com bulk health deals.",
        "Independent pharmaceutical retailers.",
      ],
    },
  },

  {
    id: "prod-ovulation-clear",
    label: "Clearblue Digital Ovulation Test",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R350 - R450 per pack of 10",
    desc: "Urine tracking system pinpointing your 2 most fertile days.",
    detailedKnowledge: {
      clinicalProfile:
        "Measures Luteinizing Hormone (LH) surges with high accuracy. Displays a clear digital smiley face when peak fertility is reached.",
      risks:
        "Can return false readings for individuals diagnosed with Polycystic Ovary Syndrome (PCOS) due to naturally elevated baseline LH levels.",
      saAvailability: [
        "Clicks Group pharmacies.",
        "Dis-Chem outlets.",
        "Online health stores.",
      ],
    },
  },

  {
    id: "prod-therm-basal",
    label: "FirstView Digital Basal Thermometer",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R220 - R300",
    desc: "Two-decimal thermometer designed for Natural Family Planning charting.",
    detailedKnowledge: {
      clinicalProfile:
        "Measures basal body temperature to 1/100th of a degree (e.g., 36.45°C), allowing you to log the subtle thermal shift that follows ovulation.",
      risks:
        "Sickness, poor sleep, or alcohol intake can skew readings. Requires waking up at the exact same time every morning to measure.",
      saAvailability: [
        "Takealot.com local delivery platforms.",
        "Independent fertility consulting rooms.",
      ],
    },
  },

  {
    id: "prod-test-fertilo",
    label: "Fertilo Female Fertility FSH Test",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R180 - R240",
    desc: "Urine test card checking for indicators of ovarian reserve levels.",
    detailedKnowledge: {
      clinicalProfile:
        "Measures Follicle Stimulating Hormone (FSH) levels on Day 3 of the cycle. Elevated levels can serve as an early indicator of diminished ovarian reserve.",
      risks:
        "Should only be used for general screening; it does not replace a comprehensive clinical blood panel evaluation.",
      saAvailability: [
        "Homedoc South Africa digital pipelines.",
        "Larger private dispensary hubs.",
      ],
    },
  },

  {
    id: "prod-microscope-saliva",
    label: "Maybe Baby Ovulation Microscope",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R650 - R750",
    desc: "Mini re-usable pocket microscope tracking estrogen via saliva crystallization patterns.",
    detailedKnowledge: {
      clinicalProfile:
        "Identifies estrogen spikes by highlighting distinct 'ferning' crystallization patterns in dried saliva samples during fertile windows.",
      risks:
        "Eating, drinking, or brushing your teeth right before testing can compromise sample accuracy.",
      saAvailability: [
        "Online baby and fertility speciality stores in SA.",
        "Takealot catalog lines.",
      ],
    },
  },

  {
    id: "prod-test-sperm",
    label: "SwimCount Home Sperm Quality Test",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R850 - R990",
    desc: "Advanced home male fertility test measuring progressive motile sperm cells.",
    detailedKnowledge: {
      clinicalProfile:
        "Measures the actual concentration of motile sperm cells capable of reaching an egg, rather than just calculating a total count.",
      risks:
        "Requires strict adherence to manual timing and sample preparation guidelines.",
      saAvailability: [
        "Dis-Chem Pharmacies specialty counters.",
        "Homedoc.co.za delivery channels.",
      ],
    },
  },

  {
    id: "prod-lubrication-conceive",
    label: "Conceive Plus Fertility Lubricant",
    category: "Monitoring",
    imgSrc: "/WhImages/wh30.jpg",
    saPricing: "R240 - R320 tube",
    desc: "Sperm-friendly intimate lubricant formulated with essential ions.",
    detailedKnowledge: {
      clinicalProfile:
        "Matches natural fertile cervical mucus pH and osmolarity parameters exactly. Infused with calcium and magnesium ions to support sperm longevity.",
      risks:
        "Does not act as a contraceptive; designed specifically for couples attempting to conceive.",
      saAvailability: [
        "Clicks and Dis-Chem baby care aisles.",
        "Takealot online marketplace.",
      ],
    },
  },

  {
    id: "prod-test-ph",
    label: "GynaGuard Vaginal pH Test Strips",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R120 - R160 per pack",
    desc: "Self-test swab strips identifying disruptions in vaginal acidity profiles.",
    detailedKnowledge: {
      clinicalProfile:
        "Instantly color-maps localized pH levels. A pH level above 4.5 can indicate Bacterial Vaginosis (BV) or Trichomoniasis.",
      risks:
        "Testing too close to unprotected intercourse or during menstruation will skew color readouts.",
      saAvailability: [
        "Dis-Chem Pharmacies wellness aisles.",
        "Clicks online storefront channels.",
      ],
    },
  },

  {
    id: "prod-monitor-daysy",
    label: "Daysy Fertility Tracker Computer",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R4,500 - R5,500 upfront",
    desc: "High-end standalone fertility computer featuring an integrated basal sensor hook.",
    detailedKnowledge: {
      clinicalProfile:
        "Uses an intelligent data algorithm trained on millions of reference cycles to color-code your daily fertility status (Red = Fertile, Green = Infertile).",
      risks: "Significant upfront financial investment required.",
      saAvailability: [
        "Imported and supported through official Daysy South Africa regional agency portals.",
      ],
    },
  },

  {
    id: "prod-test-early-check",
    label: "Medic Pregnancy Test Strip",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R25 - R40",
    desc: "Classic affordable midstream plastic pregnancy test casing option.",
    detailedKnowledge: {
      clinicalProfile:
        "Standard lateral flow immunoassay system. Highly effective for testing on or after the first day of a missed period.",
      risks:
        "Does not provide automated digital text readouts; requires visual line interpretation.",
      saAvailability: [
        "Stocked at all local Spar pharmacy counters, Alpha Pharm, and independent drugstores.",
      ],
    },
  },

  {
    id: "prod-test-lh-bulk",
    label: "Fertility2u Ovulation Test Strips",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R180 - R250 per pack of 20",
    desc: "Bulk paper test strips tracking mid-cycle LH hormone surges.",
    detailedKnowledge: {
      clinicalProfile:
        "Allows users to test twice daily as their predicted ovulation window approaches, making it easier to accurately catch short LH surges.",
      risks:
        "Requires collecting urine samples in a clean cup container for each test cycle.",
      saAvailability: [
        "Specialty local fertility e-commerce platforms.",
        "Takealot delivery.",
      ],
    },
  },

  {
    id: "prod-test-menopause",
    label: "FirstView Menopause FSH Test Kit",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R130 - R180",
    desc: "Urine dip device screening for elevated menopause hormone markers.",
    detailedKnowledge: {
      clinicalProfile:
        "Detects sustained elevations in FSH, helping to screen for perimenopause and menopause stages in individuals experiencing irregular cycles.",
      risks:
        "Hormonal contraceptives can cross-react and distort test outcomes.",
      saAvailability: [
        "Homedoc ZA online catalog.",
        "Selected private pharmacies countrywide.",
      ],
    },
  },

  {
    id: "prod-test-uti",
    label: "Urikon Urinary Tract Infection Strips",
    category: "Monitoring",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R90 - R130 per pack",
    desc: "Rapid diagnostic test strips checking for nitrites and leukocytes in urine.",
    detailedKnowledge: {
      clinicalProfile:
        "Provides early screening for UTIs by checking for white blood cells and bacterial waste indicators within 2 minutes.",
      risks:
        "Positive screens should always be followed by a formal laboratory urine culture via a GP.",
      saAvailability: [
        "Over-the-counter access at Dis-Chem and Clicks dispensaries.",
      ],
    },
  },

  {
    id: "prod-gel-preseed",
    label: "Pre-Seed Fertility Lubricant",
    category: "Monitoring",
    imgSrc: "/WhImages/wh30.jpg",
    saPricing: "R320 - R390",
    desc: "Clinically cleared internal fertility lubricant supplied with internal applicators.",
    detailedKnowledge: {
      clinicalProfile:
        "Formulated to match the thin, slippery characteristics of natural fertile cervical mucus to support optimal sperm mobility.",
      risks:
        "Applicators are strictly single-use only to preserve product sterility.",
      saAvailability: [
        "Larger retail pharmacy baby segments.",
        "Online wellness portals based in SA.",
      ],
    },
  },

  {
    id: "prod-supp-pregnega",
    label: "Pregnaeon Fertility Support Caps",
    category: "Therapeutics",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R210 - R280",
    desc: "Daily pre-conception supplement containing active folic acid and zinc.",
    detailedKnowledge: {
      clinicalProfile:
        "Provides 400mcg of essential folic acid to support healthy neural tube development during early pregnancy.",
      risks: "Can cause mild iron-related constipation in sensitive users.",
      saAvailability: [
        "Stocked across Clicks Pharmacies.",
        "Dis-Chem health aisles.",
        "Independent vitamin dispensaries.",
      ],
    },
  },

  {
    id: "prod-oil-evening",
    label: "Vital Evening Primrose Oil 1000mg",
    category: "Therapeutics",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R130 - R180",
    desc: "Natural Gamma-Linolenic Acid (GLA) softgels used for cycle symptom relief.",
    detailedKnowledge: {
      clinicalProfile:
        "Helps regulate cyclical inflammatory markers, working to reduce pre-menstrual breast tenderness (mastalgia) and cyclic cramps.",
      risks:
        "May interact with blood-thinning medications. Discontinue use prior to surgeries.",
      saAvailability: [
        "Every major SA supermarket chain (Pick n Pay, Checkers, Spar) and pharmacy network.",
      ],
    },
  },

  {
    id: "prod-supp-inofolic",
    label: "Inofolic PCOS Supplement Powder",
    category: "Therapeutics",
    imgSrc: "/WhImages/organic.jpg",
    saPricing: "R380 - R460 per box",
    desc: "Myo-inositol and folic acid powder sachets tailored for PCOS cycle management.",
    detailedKnowledge: {
      clinicalProfile:
        "Clinically proven to improve insulin sensitivity, promote regular ovulation patterns, and manage metabolic symptoms associated with PCOS.",
      risks:
        "May cause mild, temporary gastrointestinal bloating during the initial week of use.",
      saAvailability: [
        "Behind-the-counter script counters at Dis-Chem and Clicks (No prescription needed).",
      ],
    },
  },

  {
    id: "prod-patch-cramp",
    label: "Lelive Mood & Cramp Heating Patches",
    category: "Therapeutics",
    imgSrc: "/WhImages/organic.jpg",
    saPricing: "R90 - R130 per pack",
    desc: "Air-activated targeted heating patches designed for lower abdominal comfort.",
    detailedKnowledge: {
      clinicalProfile:
        "Provides up to 8 hours of continuous, soothing heat therapy (40°C) to relax pelvic muscles and increase blood flow.",
      risks:
        "Never apply patches directly to bare skin to prevent low-temperature thermal burns.",
      saAvailability: [
        "Lelive African Botanics online storefront.",
        "Selected Woolworths beauty counters.",
      ],
    },
  },

  {
    id: "prod-wash-gynaguard",
    label: "GynaGuard Essential Intimate Wash",
    category: "Therapeutics",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R55 - R75",
    desc: "Daily external cleansing wash infused with protective lactic acid.",
    detailedKnowledge: {
      clinicalProfile:
        "Soap-free, fragrance-free formula designed to support and protect the vulva's natural protective moisture barrier.",
      risks:
        "For external use only. Internal douching will alter healthy vaginal flora balances.",
      saAvailability: [
        "Universal availability at Clicks, Dis-Chem, Shoprite, Pick n Pay, and Checkers stores.",
      ],
    },
  },

  {
    id: "prod-supp-pms",
    label: "FloraForce PMS Herbal Capsules",
    category: "Therapeutics",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R160 - R210",
    desc: "Natural Agnus Castus (Chasteberry) capsules for menstrual cycle support.",
    detailedKnowledge: {
      clinicalProfile:
        "Works to modulate pituitary prolactin secretion pathways, helping to mitigate premenstrual irritability, mood swings, and bloating.",
      risks:
        "Not recommended for use alongside oral hormonal contraceptives without consulting your physician.",
      saAvailability: [
        "Wellness Warehouse outlets.",
        "Faithful to Nature retail branches.",
        "Independent health shops.",
      ],
    },
  },

  {
    id: "prod-cream-progesterone",
    label: "NatPharma Natural Progesterone Cream",
    category: "Therapeutics",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R280 - R360 pump jar",
    desc: "Wild yam derivative transdermal cream for estrogen balance support.",
    detailedKnowledge: {
      clinicalProfile:
        "Delivers bio-identical progesterone through skin layers, helping to manage perimenopausal hot flushes and cycle irregularities.",
      risks:
        "Requires rotational skin application formatting to prevent localized tissue saturation.",
      saAvailability: [
        "Independent compounding pharmacies across SA.",
        "Takealot e-commerce platform stores.",
      ],
    },
  },

  {
    id: "prod-probiotic-v",
    label: "Vagiforte Plus Oral & Vaginal Combo",
    category: "Therapeutics",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R140 - R190 pack",
    desc: "Targeted lactic acid bacilli probiotic strain capsules for intimate flora health.",
    detailedKnowledge: {
      clinicalProfile:
        "Delivers concentrated columns of Lactobacillus rhamnosus to actively colonize and defend against vaginal thrush and BV recurrences.",
      risks:
        "Store in a cool, dry place underneath 25°C to preserve live bacterial cultures.",
      saAvailability: [
        "Over-the-counter access at Clicks, Dis-Chem, and independent pharmacies nationwide.",
      ],
    },
  },

  {
    id: "prod-tea-raspberry",
    label: "Phyto-Force Red Raspberry Leaf Tea",
    category: "Therapeutics",
    imgSrc: "/WhImages/organic.jpg",
    saPricing: "R65 - R85 loose pack",
    desc: "Traditional loose-leaf herbal tea used as a uterine tonic.",
    detailedKnowledge: {
      clinicalProfile:
        "Contains fragarine, an alkaloid compound that helps tone and strengthen uterine wall muscle layouts, working to soothe pelvic cramps.",
      risks:
        "Should be avoided during early first-trimester pregnancy phases due to active toning properties.",
      saAvailability: [
        "Wellness Warehouse showrooms.",
        "Faithful to Nature online portal.",
        "Selected local herbalists.",
      ],
    },
  },

  {
    id: "prod-magnesium-spray",
    label: "BetterYou Magnesium Oil Joint Spray",
    category: "Therapeutics",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R190 - R260",
    desc: "High-absorption transdermal magnesium spray used for muscular relaxation.",
    detailedKnowledge: {
      clinicalProfile:
        "Absorbs directly through skin layers to rapidly bypass gut limitations, helping to relax smooth uterine muscles and calm menstrual cramps.",
      risks:
        "May trigger a temporary, benign tingling sensation on sensitive skin during early applications.",
      saAvailability: [
        "Dis-Chem Pharmacies health rows.",
        "Clicks online storefront lines.",
        "Takealot logistics.",
      ],
    },
  },

  {
    id: "prod-tens-ova",
    label: "Ova+ Period Pain Relief TENS Machine",
    category: "Therapeutics",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R850 - R1,100 unit",
    desc: "Compact, wearable micro-pulse unit designed to block menstrual pain signals.",
    detailedKnowledge: {
      clinicalProfile:
        "Utilizes Transcutaneous Electrical Nerve Stimulation (TENS) technology to block pain signals from reaching the brain while stimulating endorphin release.",
      risks:
        "Contraindicated for individuals fitted with cardiac pacemakers or diagnosed with epilepsy profiles.",
      saAvailability: [
        "Physiotherapy supply shops across SA.",
        "Takealot online catalog systems.",
      ],
    },
  },

  {
    id: "prod-iron-chelate",
    label: "Chela-Ferr Iron Supplement Tablets",
    category: "Therapeutics",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R110 - R160",
    desc: "Highly bioavailable ferrochel iron chelate tablets tailored for heavy cycle days.",
    detailedKnowledge: {
      clinicalProfile:
        "Formulated to prevent iron-deficiency anemia caused by heavy menstrual bleeding (menorrhagia) without causing gastric irritation.",
      risks:
        "Keep safely out of reach of young children; excessive iron intake can be toxic.",
      saAvailability: [
        "Universal distribution across Clicks, Dis-Chem, MediRite, and local supermarket pharmacies.",
      ],
    },
  },

  {
    id: "prod-supp-vitex",
    label: "Solal Vitex Chasteberry Extract",
    category: "Therapeutics",
    imgSrc: "/WhImages/iud.jpg",
    saPricing: "R210 - R280",
    desc: "Standardized herbal extract pills for prolactin and cycle balance management.",
    detailedKnowledge: {
      clinicalProfile:
        "Supports the body's natural luteal phase dynamics, working to reduce cyclical premenstrual anxiety and migraines.",
      risks:
        "May reduce the efficacy of fertility treatments or dopamine-related pharmaceutical configurations.",
      saAvailability: [
        "Dis-Chem Pharmacies nutritional rows.",
        "Wellness Warehouse storefronts.",
      ],
    },
  },

  {
    id: "prod-lubricant-astro",
    label: "Astroglide Water-Based Liquid Lubricant",
    category: "Therapeutics",
    imgSrc: "/WhImages/wh30.jpg",
    saPricing: "R140 - R190 tube",
    desc: "Premium water-soluble lubricant designed to manage vaginal dryness.",
    detailedKnowledge: {
      clinicalProfile:
        "Hypoallergenic, water-soluble, and safe to use with latex condoms or silicone menstrual devices. Helps reduce friction-induced micro-tears.",
      risks:
        "Contains small trace levels of glycerin; individuals prone to recurrent yeast infections should monitor usage.",
      saAvailability: [
        "Stocked at Clicks Group outlets, Dis-Chem pharmacies, and major adult retail outlets in South Africa.",
      ],
    },
  },

  {
    id: "prod-bottle-hot",
    label: "Clicks Luxury Fleece Hot Water Bottle",
    category: "Therapeutics",
    imgSrc: "/WhImages/tracking.jpg",
    saPricing: "R120 - R170",
    desc: "Thick natural rubber hot water bottle fitted with a plush insulation jacket.",
    detailedKnowledge: {
      clinicalProfile:
        "Provides targeted, sustained heat distribution across pelvic zones to encourage blood circulation and expand constricted smooth muscle frameworks.",
      risks:
        "Never fill with boiling water directly from a kettle to prevent structural seams from bursting under pressure.",
      saAvailability: [
        "Clicks Group pharmacies and retail counters nationwide.",
      ],
    },
  },
];
