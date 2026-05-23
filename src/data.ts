/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServicePlan, Testimonial, GalleryItem } from './types';

export const SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'plan-basic-pristine',
    name: 'Standard Brooks Clean',
    tagline: 'Ideal for busy households needing quick, premium upkeep.',
    price: 149,
    features: [
      'Complete dusting of all surfaces, picture frames & light fixtures',
      'Thorough vacuuming and sanitizing of all hard floor areas',
      'Essential kitchen cleanup (wipe counters, sink & appliance exteriors)',
      'Bathroom sterilization (sink, mirror, toilet, tub, and shower)',
      'Emptying of all trash cans and replacing liners',
      'Silverbrook Certified eco-friendly standard cleaning materials'
    ],
    badge: 'Popular',
    type: 'residential'
  },
  {
    id: 'plan-deep-elite',
    name: 'Deep Clean Elite',
    tagline: 'A comprehensive, top-to-bottom meticulous restoration.',
    price: 289,
    features: [
      'All features of the Standard Brooks Clean',
      'Detail scrubbing of baseboards, door frames, and window sills',
      'Sanitizing inside microwave and stove grates',
      'Intense scale and grime removal in showers & bathtubs',
      'Dusting and wiping behind reachable furniture and appliances',
      'High-reach ceiling fan & light fixture hand-wiped detailing',
      'Exterior cabinet surface polishing and sterilization'
    ],
    badge: 'Most Comprehensive',
    popular: true,
    type: 'deep'
  },
  {
    id: 'plan-commercial-sparkle',
    name: 'Commercial Sparkle Premium',
    tagline: 'Tailored for professional and elite office environments.',
    price: 499,
    features: [
      'Complete sanitization of desks, computer surfaces, and peripherals',
      'Sanitizing high-touch areas (elevator buttons, door handles, light switches)',
      'Detailed window glass and glass partition smudgeless polishing',
      'Commercial grade disinfection of restrooms, sinks, and breakrooms',
      'Advanced floor buffing, vacuuming, and mopping',
      'Custom flexible schedule frequency options (daily/weekly/monthly)',
      'Dedicated on-site Silverbrook Quality Supervisor'
    ],
    badge: 'Pro Business',
    type: 'commercial'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Emily Henderson',
    role: 'Homeowner, Silverbrook Estate',
    rating: 5,
    comment: 'The team at Silverbrook has elevated our home cleaning to a luxury experience. Every corner is immaculate, they are incredibly respectful, and the eco-friendly materials leave a subtle, fresh scent. Highly recommend Deep Clean Elite!',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    serviceType: 'Deep Clean Elite'
  },
  {
    id: 't-2',
    name: 'Arthur Sterling',
    role: 'Facilities Director, Sterling Group',
    rating: 5,
    comment: 'Maintaining an pristine office is critical to our corporate reputation. Silverbrook Cleaning Solutions has delivered flawless commercial service every single time. They work around our working hours and their crew is top tier.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    serviceType: 'Commercial Sparkle'
  },
  {
    id: 't-3',
    name: 'Sarah & Michael Vance',
    role: 'Townhouse Residents',
    rating: 5,
    comment: 'With two active toddlers, our apartment gets chaotic fast. Silverbrook’s bi-weekly plan is an absolute lifesaver. The calculator price is transparent, the online booking is super convenient, and the checkout process was seamless.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    serviceType: 'Standard Brooks Clean'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Executive Living Room Restoration',
    category: 'residential',
    beforeImage: '/src/assets/images/residential_result_1_1779511174736.png',
    afterImage: '/src/assets/images/residential_result_1_1779511174736.png',
    description: 'A luxurious open-concept living space completely restored with detailed hardwood polish, allergen extraction, and complete window washing.'
  },
  {
    id: 'g-2',
    title: 'High-Rise Corporate Office Suite',
    category: 'commercial',
    beforeImage: '/src/assets/images/commercial_result_1_1779511192785.png',
    afterImage: '/src/assets/images/commercial_result_1_1779511192785.png',
    description: 'Post-event deep sanitization of an executive suite including sanitization of desks, chrome metal detailing, and custom glass polishing.'
  },
  {
    id: 'g-3',
    title: 'Premium Kitchen Countertops & Detailing',
    category: 'detailed',
    beforeImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    description: 'Rigorous grease extraction and restoration on deluxe marble countertops, stove grates, and stainless-steel premium appliance fittings.'
  },
  {
    id: 'g-4',
    title: 'Luxury Estate Master Bedroom Refresh',
    category: 'residential',
    beforeImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    description: 'Complete bedding configuration, heavy duster treatment, curtain steaming, and complete floor steam sterilization.'
  },
  {
    id: 'g-5',
    title: 'Deluxe Bathroom Steam & Descaling',
    category: 'detailed',
    beforeImage: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800',
    description: 'Chemical-free steam sanitation of tile grouts, crystal glass doors scale elimination, and absolute chrome fixtures polishing.'
  },
  {
    id: 'g-6',
    title: 'Sterling Tech Open Space Headquarters',
    category: 'commercial',
    beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    description: 'Corporate cleanliness of a dynamic layout with dust free electronics cleaning, high-touch sanitization, and heavy floor scrub machine polishing.'
  },
  {
    id: 'g-7',
    title: 'Sunlit Living Room Allergen Extraction',
    category: 'residential',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    description: 'Vacuum sanitation of high-pile carpets, fine fabric upholstery shampooing, and baseboard fine detail hand wipes.'
  },
  {
    id: 'g-8',
    title: 'Gleaming Marble Foyer Entryway',
    category: 'detailed',
    beforeImage: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&q=80&w=800',
    description: 'Specialist diamond pad marble polish, complete entryway dust removal, and high-visibility glass fixture luster recovery.'
  },
  {
    id: 'g-9',
    title: 'Boardroom Glass Partition Polishing',
    category: 'commercial',
    beforeImage: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800',
    description: 'Meticulous streak-free finish on high boardroom glass walls, leather upholstery care, and boardroom custom tech dust control.'
  },
  {
    id: 'g-10',
    title: 'Gourmet Kitchen Island Deep Oil Wipe',
    category: 'detailed',
    beforeImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    description: 'Organic citrus grease breakdown on premium range hoods, cabinetry polishing, and heavy-duty sink scale calcification wipe.'
  },
  {
    id: 'g-11',
    title: 'Modern Minimalist Loft Organization',
    category: 'residential',
    beforeImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    description: 'Immaculate reorganization of a minimal loft space featuring microfiber couch duster treatment and high sash window polishing.'
  },
  {
    id: 'g-12',
    title: 'Gleaming Office Cubicles & Corridor Rescue',
    category: 'commercial',
    beforeImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
    description: 'HEPA vacuums on corporate carpet corridors, workstation surface biological sanitization, and trash bin steam refresh.'
  },
  {
    id: 'g-13',
    title: 'Hardwood Dining Room Dust Extraction',
    category: 'residential',
    beforeImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800',
    description: 'Fine wood dining table wax treatment, heavy velvet dining chair vacuum shampooing, and elaborate light fixture crystal wiping.'
  },
  {
    id: 'g-14',
    title: 'Bespoke Poolside Glass Window Finish',
    category: 'detailed',
    beforeImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    description: 'Post-construction water stain elimination, patio glass pressure restoration, and outer aluminum frame detailed scrub.'
  },
  {
    id: 'g-15',
    title: 'Immaculate Glass Railings & Balcony Polish',
    category: 'residential',
    beforeImage: 'https://images.unsplash.com/photo-1527359353441-11d58d790dca?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1527359353441-11d58d790dca?auto=format&fit=crop&q=80&w=800',
    description: 'Intense outdoor atmospheric scale scrubbing, modern railing track debris extraction, and spotless glass polishing.'
  }
];

export const BIOGRAPHY = {
  ownerName: 'Marcus Silverbrook',
  ownerTitle: 'Founder, Proprietor & Lead Standards Quality Auditor',
  ownerQuote: 'Cleanliness is not just about aesthetics—it is about restoring mental space, creating healthy breathing environments, and delivering unmatched peace of mind.',
  ownerImage: '/src/assets/images/owner_portrait_1779511210845.png',
  ownerBio: 'Marcus founded Silverbrook Cleaning Solutions in 2018 with a singular vision: to bring premium, white-glove residential and commercial cleaning of uncompromising quality to the region. Having started as a sole practitioner, Marcus hand-designed our 55-point Elite Care checking standard and personally trains each specialist. Today, he continues to oversee client accounts to ensure the family-owned standard never wavers.',
  companyStory: 'Silverbrook Cleaning Solutions has earned its status as the most trusted premium service provider by merging meticulous old-school cleaning craftsmanship with modern, eco-friendly green chemicals. We understand that our clientele expects an exceptional level of detail, absolute reliability, and highly vetted personnel. Every member of our cleaning guild is fully licensed, insured, double-background checked, and certified in the Silverbrook Care program. We back our results with an unconditional 24-Hour Sparkle Guarantee: if you are not entirely overawed by our clean, we will return and re-clean it immediately.',
  stats: [
    { label: 'Premium Accounts', value: '1,200+' },
    { label: 'Sparkle Rate', value: '99.8%' },
    { label: 'Guild Specialists', value: '28' },
    { label: 'Eco Chemicals used', value: '100%' }
  ],
  detailedCEOStory: 'Marcus Silverbrook brings a lifetime of quality-driven operations management to the service industry. After a decade managing luxury boutique hotel properties where cleanliness and presentation dictate extreme guest luxury standards, he noticed a major gap in the market: residential or corporate cleaning agencies were inconsistent, hurried, and rarely treated customer properties with white-glove fidelity. He established Silverbrook to solve this. Marcus still guarantees that his personalized 55-point checklist is followed on every sweep, ensuring your home is respected with the ultimate care.',
  companyMilestones: [
    { year: '2018', title: 'The Genesis', desc: 'Founded by Marcus with 2 teammates, immediately launching the organic green chemical protocol.' },
    { year: '2020', title: 'Commercial Expansion', desc: 'Selected as the leading boutique service partner for the region\'s prominent tech headquarters & elite financial floors.' },
    { year: '2022', title: 'The Cleaning Guild', desc: 'Co-created the elite professional Silverbrook Guild Academy, certifying full background-tested personnel.' },
    { year: '2024', title: 'Carbon Neutral Standard', desc: 'Achieved complete 100% green supply pipeline certification with custom biological deodorants.' }
  ]
};
