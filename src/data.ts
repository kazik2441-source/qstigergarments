// Corporate and operational configurations for Q.S TIGER GARMENTS

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  price?: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  images?: string[];
}

export interface ManufacturingStat {
  value: string;
  label: string;
  description: string;
}

export interface UnitInfo {
  name: string;
  location: string;
  type: string;
}

export const COMPANY_NAME = "Q.S TIGER GARMENTS";
export const TAGLINE = "FREEDOM LIFE";
export const ESTABLISHED_YEAR = 2010;

export const CONTACT_INFO = {
  email: "qstigergarments2010@gmail.com",
  phone: "+91 9836240310",
  phoneRaw: "9836240310",
  whatsappLink: "https://wa.me/919836240310",
  headquarters: "KOLKATA, ABM HAAT, PIN-700024",
};

export const MANUFACTURING_UNITS: UnitInfo[] = [
  {
    name: "Headquarters & Showroom",
    location: "Kolkata, ABM Haat, PIN-700024",
    type: "Corporate Office & DistributionHub"
  },
  {
    name: "Manufacturing Unit - Makalhati",
    location: "Kolkata, Makal Hati, Molla Para",
    type: "Primary Cutting & Sewing Facility"
  },
  {
    name: "Manufacturing Unit - Sontoshpur",
    location: "New Sontoshpur Road, Kolkata",
    type: "Quality Finishing & Packaging Unit"
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "knitwear-tshirts",
    name: "Premium Knitwear T-Shirts",
    category: "Knitwear",
    subcategory: "T-Shirts",
    description: "Ultra-soft, breathable round-neck and polo t-shirts crafted from 100% fine-combed organic cotton. Available in vibrant reactive dyes and customizable weights (140-220 GSM).",
    features: ["100% Organic Cotton", "Anti-pilling treatment", "Eco-friendly dyes", "GSM customization"],
    price: "₹190 only per pc"
  },
  {
    id: "knitwear-shirts",
    name: "Semi-Formal Comfort Shirts",
    category: "Knitwear",
    subcategory: "Shirts",
    description: "Lightweight, soft-knit shirts offering absolute flexibility and professional cuts. Tailored for dynamic urban life with excellent sweat-wicking properties.",
    features: ["High durability fibers", "Freedom fit engineering", "Wrinkle-resistant", "Breathable weave"],
    price: "₹190 only per pc"
  },
  {
    id: "knitwear-baba-suits",
    name: "Cozy Cotton Baba Suits",
    category: "Knitwear",
    subcategory: "Baba Suits",
    description: "Premium matching top & bottom sets for energetic infants and toddlers. Stitched with custom flatlock seams to ensure zero skin-irritation during active play.",
    features: ["Super-soft interlock cotton", "Flatlock comfort stitching", "Exciting patterns", "Elastic waistband"],
    price: "₹190 only per pc"
  },
  {
    id: "knitwear-girls-dresses",
    name: "Vibrant Summer Girls Dresses",
    category: "Knitwear",
    subcategory: "Girls Dresses",
    description: "Charming, skin-safe dresses made from premium lightweight organic linens and cotton jerseys. Tailored to withstand high-active playtime while remaining delightfully stylish.",
    features: ["Azo-free certified dyes", "Hypoallergenic fabric", "Adorable breathable design", "Easy wash & wear"],
    price: "₹190 only per pc"
  },
  {
    id: "baby-denim-shirts",
    name: "Classic Baby Denim Shirts",
    category: "Baby Collection",
    subcategory: "Denim Shirts",
    description: "Lightweight, enzyme-washed soft denim shirts matching adult styles but optimized for baby skin. Heavy-duty look with super soft, breathable touch.",
    features: ["Enzyme pre-washed for softness", "Metal-free secure snap buttons", "100% sustainable linen-denim blend", "Sturdy double-stitch accents"],
    price: "₹190 only per pc"
  },
  {
    id: "baby-casual-shirts",
    name: "Contemporary Kids Casual Shirts",
    category: "Baby Collection",
    subcategory: "Casual Shirts",
    description: "Lightweight cotton-linen shirts featuring playful miniature prints and premium button finishes. Perfectly soft for everyday lounging and special occasions.",
    features: ["Organic blended cotton", "Easy-to-open buttons", "Moisture-wicking dry technology", "Unmatched comfort"],
    price: "₹190 only per pc"
  }
];

export const STATS: ManufacturingStat[] = [
  {
    value: "1.2 Lakh+",
    label: "Monthly Capacity",
    description: "Ready-Made Garments (RMG) produced monthly matching world-class tolerances"
  },
  {
    value: "20+",
    label: "High-Speed Machinery",
    description: "Industrial Juki, Brother & Siruba machinery configurations"
  },
  {
    value: "50-60",
    label: "Skilled Artisans",
    description: "Dedicated master pattern-makers, tailors, and quality controllers"
  },
  {
    value: "100%",
    label: "Quality Checked",
    description: "Multipoint inspection ensuring zero-defect dispatches to clients"
  }
];

export const SUSTAINABILITY_PILLARS = [
  {
    title: "100% Organic Cotton",
    description: "Sourced strictly from certified sustainable agricultural initiatives, which consume 91% less water during growing phases."
  },
  {
    title: "Zero-Waste Fabric Program",
    description: "All post-production scrap materials and cutting clippings are recycled, remade into functional industrial cleaning rags or insulated fillers."
  },
  {
    title: "Sustainable Linen & Recycled Poly",
    description: "By integrating sustainable flax yarn and plastic-diverted recycled polyesters, we minimize fossil impact while maximizing long-term garments lifetime."
  }
];
