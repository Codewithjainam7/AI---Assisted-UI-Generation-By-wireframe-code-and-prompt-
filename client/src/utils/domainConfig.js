export function resolveDomainConfig(ir = {}, job = {}) {
  const domain = (ir.domain || '').toLowerCase();
  const rawText = [
    ir.sectionName,
    job.sectionName,
    ir.promptText,
    ir.content?.headlineMain,
    ir.content?.brandBadge,
    ir.navbar?.logoText,
    ir.formType,
    domain
  ].filter(Boolean).join(' ').toLowerCase();

  // 1. Restaurant / Dining / Bistro / Culinary
  if (/restaurant|dining|food|bistro|cafe|culinary|chef|menu|table|reservation/i.test(rawText)) {
    return {
      domainType: 'restaurant',
      brand: ir.navbar?.logoText || ir.brandBadge || 'L’Artisan Bistro',
      badge: 'Fine Dining & Seasonal Tasting Menus',
      heroHeadline: ir.content?.headlineMain || 'Culinary Artistry & Intimate Dining',
      heroSub: ir.content?.headlineSub || 'Reserve your private table or chef tasting counter.',
      heroDesc: ir.content?.description || 'Crafted with sustainably sourced ingredients, artisanal pairings, and world-class culinary hospitality.',
      heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Reserve Table',
      bookingPageName: 'Reservations',
      teamPageName: 'Chefs',
      specialistLabel: 'Executive Chef & Sommelier',
      specialists: [
        { name: 'Chef Jean-Luc Moreau', role: 'Executive Chef & Owner', specialty: 'French Nouvelle Cuisine', exp: '3 Michelin Stars', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80' },
        { name: 'Chef Elena Rostova', role: 'Head Pastry Chef', specialty: 'Artisanal Confections', exp: '14 yrs exp', rating: '4.8 ★', photo: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80' },
        { name: 'Marco Valenti', role: 'Master Sommelier', specialty: 'Old World Wine Pairings', exp: '18 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Seating & Atmosphere',
      categories: ['Main Dining Room', 'Chef’s Tasting Table', 'Rooftop Terrace', 'Private Wine Cellar'],
      timeSlots: ['05:30 PM', '06:30 PM', '07:45 PM', '08:30 PM', '09:15 PM', '10:00 PM'],
      formNotice: 'Reservations are held for 15 minutes past scheduled time.',
      confirmedTitle: 'Table Reserved Successfully!',
      confirmedSub: "Your reservation has been confirmed with our maitre d'."
    };
  }

  // 2. Fitness / Gym / Coaching / Athletic Club
  if (/fitness|gym|workout|trainer|crossfit|athletic|training|yoga/i.test(rawText)) {
    return {
      domainType: 'fitness',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Apex Athletic Club',
      badge: 'High-Performance Private Training',
      heroHeadline: ir.content?.headlineMain || 'Transform Your Strength & Athletic Longevity',
      heroSub: ir.content?.headlineSub || 'Book 1-on-1 private coaching sessions with elite coaches.',
      heroDesc: ir.content?.description || 'Custom biomechanical assessments, Olympic lifting, metabolic conditioning, and tailored nutritional recovery.',
      heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Book Training',
      bookingPageName: 'Book Session',
      teamPageName: 'Trainers',
      specialistLabel: 'Master Coach',
      specialists: [
        { name: 'Alex Rivera, CSCS', role: 'Director of Strength', specialty: 'Olympic Weightlifting', exp: '12 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80' },
        { name: 'Maya Lin', role: 'Head of Mobility', specialty: 'Functional Movement & Yoga', exp: '10 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80' },
        { name: 'Marcus Brody', role: 'Conditioning Specialist', specialty: 'HIIT & Speed Conditioning', exp: '8 yrs exp', rating: '4.8 ★', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Training Program / Focus',
      categories: ['1-on-1 Strength Training', 'HIIT & Athletic Conditioning', 'Biomechanical Assessment', 'Mobility & Recovery'],
      timeSlots: ['06:00 AM', '07:30 AM', '09:00 AM', '12:00 PM', '04:30 PM', '06:00 PM'],
      formNotice: 'Please arrive 10 minutes before your scheduled session.',
      confirmedTitle: 'Training Session Booked!',
      confirmedSub: 'Your private coaching session is confirmed in our training schedule.'
    };
  }

  // 3. Legal / Law / Attorney / Consultation
  if (/law|legal|attorney|lawyer|advocate|counsel/i.test(rawText)) {
    return {
      domainType: 'legal',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Vanguard Legal Partners',
      badge: 'Premier Corporate & Litigation Counsel',
      heroHeadline: ir.content?.headlineMain || 'Strategic Legal Counsel for High-Stakes Matters',
      heroSub: ir.content?.headlineSub || 'Schedule a confidential consultation with senior practice partners.',
      heroDesc: ir.content?.description || 'Protecting your corporate assets, intellectual property, and strategic interests with courtroom-tested excellence.',
      heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Schedule Consultation',
      bookingPageName: 'Consultation',
      teamPageName: 'Attorneys',
      specialistLabel: 'Senior Counsel / Partner',
      specialists: [
        { name: 'Eleanor Vance, JD', role: 'Managing Partner', specialty: 'Corporate M&A & Securities', exp: '22 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
        { name: 'David Sterling, Esq.', role: 'Senior Litigation Counsel', specialty: 'Commercial Dispute Resolution', exp: '18 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
        { name: 'Sophia Chen, LLM', role: 'Partner', specialty: 'Patent & Intellectual Property', exp: '14 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Practice Area / Matter',
      categories: ['Corporate & Commercial', 'Intellectual Property & Patents', 'Litigation & Arbitration', 'Regulatory Compliance'],
      timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
      formNotice: 'All consultations are protected by strict attorney-client privilege.',
      confirmedTitle: 'Consultation Confirmed!',
      confirmedSub: 'Your confidential legal appointment has been scheduled with counsel.'
    };
  }

  // 4. Real Estate / Property / Tours
  if (/real estate|property|realtor|homes|apartment|condo|villa/i.test(rawText)) {
    return {
      domainType: 'real-estate',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Aura Luxury Real Estate',
      badge: 'Curated Architectural Residences',
      heroHeadline: ir.content?.headlineMain || 'Exquisite Properties Tailored to Your Vision',
      heroSub: ir.content?.headlineSub || 'Book a private architectural tour with top regional advisors.',
      heroDesc: ir.content?.description || 'Exclusive access to premier private listings, waterfront estates, and modern urban penthouses.',
      heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Schedule Tour',
      bookingPageName: 'Schedule Tour',
      teamPageName: 'Agents',
      specialistLabel: 'Licensed Real Estate Advisor',
      specialists: [
        { name: 'Harrison Sterling', role: 'Principal Broker', specialty: 'Ultra-Luxury Waterfront Estates', exp: '16 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Claire Kensington', role: 'Senior Vice President', specialty: 'Penthouse & Architectural Properties', exp: '12 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Tour Experience Type',
      categories: ['Private In-Person Tour', 'VIP Virtual Video Walkthrough', 'Architectural Consultation', 'Investment Portfolio Review'],
      timeSlots: ['10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
      formNotice: 'Discreet transportation arrangements available upon request.',
      confirmedTitle: 'Private Tour Scheduled!',
      confirmedSub: 'Your private showing has been registered with our senior broker.'
    };
  }

  // 5. Healthcare / Medical / Doctors / Clinic
  if (/doctor|clinic|hospital|medical|patient|dentist|healthcare|pediatric|cardio/i.test(rawText)) {
    return {
      domainType: 'healthcare',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Apex Medical Center',
      badge: 'Board-Certified Specialists & Urgent Care',
      heroHeadline: ir.content?.headlineMain || 'Compassionate, World-Class Healthcare',
      heroSub: ir.content?.headlineSub || 'Schedule your visit with certified medical practitioners.',
      heroDesc: ir.content?.description || 'Comprehensive clinical care with modern diagnostic facilities, emergency services, and patient-first digital booking.',
      heroImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Book Appointment',
      bookingPageName: 'Appointments',
      teamPageName: 'Doctors',
      specialistLabel: 'Attending Physician & Surgeon',
      specialists: [
        { name: 'Dr. Sarah Jenkins, MD', role: 'Chief of Cardiology', specialty: 'Cardiovascular Care', exp: '15 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Marcus Vance, DO', role: 'Head of Neurology', specialty: 'Neuro-Diagnostics', exp: '18 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Elena Ramos, MD', role: 'Senior Pediatrician', specialty: 'Child & Adolescent Care', exp: '12 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Clinical Department',
      categories: ['General Medicine', 'Cardiovascular Clinic', 'Pediatrics & Adolescent', 'Neurology & Diagnostics', 'Dermatology & Skin'],
      timeSlots: ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:45 PM'],
      formNotice: 'Emergency triage services are available 24/7 without prior booking.',
      confirmedTitle: 'Appointment Confirmed!',
      confirmedSub: 'Your reservation has been locked in our clinical calendar.'
    };
  }

  // 6. Universal Default for any other industry/prompt (SaaS, Tech, Auto, Education, etc.)
  return {
    domainType: 'general',
    brand: ir.navbar?.logoText || ir.brandBadge || 'Apex Global Solutions',
    badge: 'Verified Professional Enterprise Services',
    heroHeadline: ir.content?.headlineMain || 'Precision Solutions Engineered for Your Success',
    heroSub: ir.content?.headlineSub || 'Book an appointment with dedicated industry specialists.',
    heroDesc: ir.content?.description || 'Tailored consulting, rapid onboarding, and premier customer care designed to deliver measurable results.',
    heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    actionLabel: 'Schedule Consultation',
    bookingPageName: 'Appointments',
    teamPageName: 'Specialists',
    specialistLabel: 'Senior Advisor & Specialist',
    specialists: [
      { name: 'Jordan Hayes', role: 'Principal Specialist', specialty: 'Strategic Advisory & Operations', exp: '14 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sophia Sterling', role: 'Lead Consultant', specialty: 'Solutions Architecture & Review', exp: '11 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' }
    ],
    categoriesTitle: 'Service / Department Selection',
    categories: ['Strategic Consultation', 'Technical Assessment', 'Comprehensive Review', 'Dedicated Support Session'],
    timeSlots: ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'],
    formNotice: 'A confirmation summary with calendar invite will be delivered instantly.',
    confirmedTitle: 'Booking Confirmed!',
    confirmedSub: 'Your consultation has been locked in our schedule.'
  };
}
