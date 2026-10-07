import { useEffect, useState } from "react";
import "./App.css";
import CinematicHero from "./CinematicHero";
import LiveTracking from "./LiveTracking";
import ServiceDetailPage from "./ServiceDetailPage";

/* ── Images ─────────────────────────────────────────── */
const IMG = {
  hero:  "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1400&q=85",
  road:  "https://images.openai.com/static-rsc-4/j3pF0qLv8qaHNLZqV7sYhTMxnUD0Vk-DeTKfy95v3oQveBCquQ9bEM4lH7dTCjESkeCHcHPscV7DWnr9Otf5rtPUfubMOvRasvyp3U6pPCzKVcz2mfaVpge7SbqSesthA5qNbjxuU_1f5TFLg-tXJIcosvlReUgwdfHhJQZURqtbcB8gnCha8seGgv1bbYo3?purpose=fullsize",
  air:   "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=900&q=85",
  train: "/assets/services/vande-bharat.jpg",
  about: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",
  g1:    "https://images.unsplash.com/photo-1619025873875-59dfdd2bbbd6?auto=format&fit=crop&w=600&q=80",
  g2:    "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=600&q=80",
  g3:    "/assets/services/vande-bharat.jpg",
  g4:    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
  g5:    "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=600&q=80",
  g6:    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80",
};

const THREE_SERVICES = [
  { key: "road",  icon: "🚑", title: "Road Ambulance",  short: "Reliable ground medical transportation for emergency response, patient transfers, and hospital transportation.", image: IMG.road  },
  { key: "air",   icon: "✈",  title: "Air Ambulance",   short: "Rapid medical transportation by air for critical and long-distance patient transfers.",                        image: IMG.air   },
  { key: "train", icon: "🚆", title: "Train Ambulance", short: "Specialised medical transportation for patients requiring long-distance journeys by rail.",                    image: IMG.train },
];

const HOME_SERVICES = [
  {
    key: "road",
    label: "GROUND TRANSPORT",
    icon: "🚑",
    title: "Road Ambulance",
    desc: "Rapid emergency medical transportation with coordinated care from pickup to hospital.",
    image: "https://images.unsplash.com/photo-1619025873875-59dfdd2bbbd6?auto=format&fit=crop&w=800&q=85",
  },
  {
    key: "air",
    label: "AIR TRANSPORT",
    icon: "✈",
    title: "Air Ambulance",
    desc: "Fast medical transportation for critical patients when distance matters.",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=85",
  },
  {
    key: "train",
    label: "RAIL TRANSPORT",
    icon: "🚆",
    title: "Train Ambulance",
    desc: "Long-distance medical transportation with dedicated patient care during the journey.",
    image: "/assets/services/vande-bharat.jpg",
  },
];

const allServices = [
  { icon: "🚑", title: "Road Ambulance",          text: "Ground transfers for emergencies, hospital transfers and home pickups.",              detailKey: "road"  },
  { icon: "✈",  title: "Air Ambulance",            text: "Time-sensitive patient transfers with coordinated medical support.",                  detailKey: "air"   },
  { icon: "🚆", title: "Train Ambulance",          text: "Long-distance medical transfers with escort and continuous patient support.",         detailKey: "train" },
  { icon: "🚁", title: "Helicopter Ambulance",     text: "Rapid access for remote locations, short-distance transfers and difficult terrain."                    },
  { icon: "🛫", title: "Commercial Air Escort",    text: "Medical escort and stretcher coordination for suitable commercial flights."                            },
  { icon: "🕊",  title: "Dead Body Transportation", text: "Respectful, coordinated transportation by road, rail or air."                                         },
  { icon: "👨‍⚕️", title: "Medical Escort",           text: "Doctors, nurses and paramedics coordinated according to patient needs."                              },
  { icon: "🏥", title: "Hospital Transfer",        text: "End-to-end transfer coordination between hospitals and specialised care centres."                      },
];

const cities = [
  "Hyderabad","Bengaluru","Chennai","Mumbai","Delhi","Kolkata","Pune","Visakhapatnam","Vijayawada","Bhopal",
  "Ahmedabad","Jaipur","Lucknow","Kochi","Nagpur","Patna","Guwahati","Indore","Coimbatore","Thiruvananthapuram",
  "Dubai","Abu Dhabi","Muscat","Doha","Singapore","Bangkok","Kathmandu","Sharjah","Riyadh","Bahrain"
];

const GALLERY_ITEMS = [
  {
    key: "road",
    img: IMG.g1,
    label: "Road Ambulance",
    description: "Coordinated ground transport for emergency response and planned patient transfers, with medical support throughout the journey.",
    photos: [
      { img: "/medical-journey/patient-stretcher.jpg", label: "Patient preparation", description: "The team prepares the patient for movement and checks that the stretcher and transfer plan suit their condition." },
      { img: "/medical-journey/ambulance-interior.jpg", label: "Care inside the ambulance", description: "Medical staff can monitor and support the patient during the road journey using the ambulance's onboard equipment." },
      { img: "/medical-journey/hospital-arrival.jpg", label: "Hospital arrival", description: "At the destination, the patient is transferred to the receiving care team to support a clear handover." },
    ],
  },
  {
    key: "air",
    img: IMG.g2,
    label: "Air Ambulance",
    description: "Long-distance air medical transfers coordinated with a suitable medical crew, aircraft, and receiving facility.",
    photos: [
      { img: "/assets/services/air-ambulance.jpg", label: "Air ambulance aircraft", description: "An aircraft is arranged for suitable long-distance transfers when ground travel may take too long." },
      { img: "/medical-journey/air-patient-loading.jpg", label: "Patient boarding", description: "The patient is carefully prepared and loaded with the medical crew coordinating safe boarding." },
      { img: "/assets/services/air-medical-interior.jpg", label: "Medical care in flight", description: "The onboard care setup allows the medical team to monitor and support the patient during the flight." },
    ],
  },
  {
    key: "train",
    img: IMG.g3,
    label: "Train Ambulance",
    description: "Long-distance rail transfers with a medical escort and a dedicated patient-care setup for the journey.",
    photos: [
      { img: "/assets/services/vande-bharat.jpg", label: "Train transport", description: "Rail travel can be a practical option for suitable patients making long journeys between cities." },
      { img: "/medical-journey/train-patient-loading.jpg", label: "Patient boarding", description: "The transfer is coordinated at the station so the patient can board with the required assistance." },
      { img: "/medical-journey/train-medical-compartment.jpg", label: "Medical care on board", description: "A medical escort and arranged compartment support the patient's needs during the train journey." },
    ],
  },
  {
    key: "team",
    img: IMG.g4,
    label: "Medical Team",
    description: "Medical personnel are coordinated according to each patient's condition and the care needed during transfer.",
    photos: [
      { img: IMG.about, label: "Care team coordination", description: "The patient's needs help determine which medical personnel should accompany the transfer." },
      { img: "/assets/services/medical-care.jpg", label: "Patient care", description: "The medical team provides appropriate support and monitoring as the patient is prepared to travel." },
      { img: "/assets/services/patient-care.jpg", label: "Support during transfer", description: "Care continues through movement and handover, helping reduce gaps between transport stages." },
    ],
  },
  {
    key: "response",
    img: IMG.g5,
    label: "Emergency Response",
    description: "Our coordination process helps organize transport, medical support, and destination readiness for urgent transfers.",
    photos: [
      { img: "/assets/services/road-ambulance.jpg", label: "Ground response", description: "Road transport can support urgent local journeys and transfers between nearby care facilities." },
      { img: "/assets/services/air-ambulance.jpg", label: "Air response", description: "For suitable long-distance cases, air transport may help reduce travel time between locations." },
      { img: "/assets/services/hospital.jpg", label: "Destination coordination", description: "Planning with the receiving facility helps prepare for the patient's arrival and handover." },
    ],
  },
  {
    key: "patient-transport",
    img: IMG.g6,
    label: "Patient Transportation",
    description: "Patient journeys are planned around safe movement, suitable transport, and clear handover at the destination.",
    photos: [
      { img: "/assets/services/patient-stretcher.jpg", label: "Patient preparation", description: "The patient and required equipment are prepared for the planned mode of transport." },
      { img: "/assets/services/patient-care.jpg", label: "Medical support", description: "Appropriate support during travel helps address the patient's care needs along the route." },
      { img: "/assets/services/hospital.jpg", label: "Care destination", description: "A planned arrival and handover connect the transport journey with care at the destination." },
    ],
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📋",
    title: "Book Your Ambulance",
    body: "Select the transport type — Road, Air or Train — and share your basic requirements with our team.",
    detail: "Our coordination team confirms the service type, patient condition, and pickup requirements before moving to the next step.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
  },
  {
    step: "02",
    icon: "📍",
    title: "Share Location & Patient Details",
    body: "Provide pickup location, destination, patient condition and any specific medical needs.",
    detail: "We collect the exact route, care requirements, and destination details so the transport can be planned safely and efficiently.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    step: "03",
    icon: "🤝",
    title: "Medical Team Coordination",
    body: "We coordinate the right medical personnel, equipment and transport for your journey.",
    detail: "Doctors, nurses, and paramedics are matched to the patient requirement to keep care aligned with the medical plan.",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80",
  },
  {
    step: "04",
    icon: "🚑",
    title: "Safe Transportation",
    body: "Your patient is transported safely with continuous medical support from pickup to destination.",
    detail: "The journey remains monitored from the pickup point to arrival, with clear communication and support throughout transit.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
  },
];

const WHY_CHOOSE = [
  {
    icon: "🕐",
    title: "24/7 Emergency Support",
    body: "Our coordination desk is available around the clock for emergency and planned transfers.",
    detail: "We stay available at every hour to help with urgent requests, planned transfer planning, and last-minute updates.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "👨‍⚕️",
    title: "Trained Medical Teams",
    body: "Doctors, nurses and paramedics coordinated based on the patient's specific requirements.",
    detail: "Every transfer is matched with qualified medical professionals who can provide the right level of support during travel.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🚑",
    title: "Reliable Transportation",
    body: "Air, Road and Train ambulance services to match every patient need and distance.",
    detail: "The chosen mode of travel is selected around patient comfort, urgency, and route efficiency for a smoother journey.",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "⚡",
    title: "Fast Response",
    body: "Quick coordination and dispatch to minimise delays during critical medical situations.",
    detail: "Our team focuses on rapid response and clear communication so patients can move without unnecessary delay.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🛡️",
    title: "Patient Safety",
    body: "Every journey is planned with patient safety and comfort as the primary consideration.",
    detail: "Safety checks, patient preparation, and route planning are built into the process for every transfer.",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🏥",
    title: "Modern Medical Equipment",
    body: "Vehicles and aircraft equipped with essential medical equipment for patient monitoring.",
    detail: "The transport setup includes essential care equipment to support stable monitoring and patient comfort during transit.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
  },
];

/* ── App ─────────────────────────────────────────────── */
export default function App() {
  const [page, setPage]               = useState("home");
  const [serviceDetail, setServiceDetail] = useState(null);
  const [galleryDetail, setGalleryDetail] = useState(null);
  const [gallerySource, setGallerySource] = useState("home");
  const [menu, setMenu]               = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [now, setNow]                 = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [page, serviceDetail]);

  const go = (p) => { setPage(p); setServiceDetail(null); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goDetail = (key) => { setServiceDetail(key); setPage("serviceDetail"); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openGalleryDetail = (key) => { setGalleryDetail(key); setGallerySource(page); setPage("galleryDetail"); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const backFromGalleryDetail = () => { setPage(gallerySource); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 5000); };

  const NAV_ITEMS = [
    { key: "home",         label: "Home"           },
    { key: "services",     label: "Services"       },
    { key: "howitworks",   label: "How It Works"   },
    { key: "livetracking", label: "Live Tracking"  },
    { key: "whychoose",    label: "Why Choose Us"  },
    { key: "about",        label: "About"          },
    { key: "contact",      label: "Contact"        },
  ];

  return (
    <div className="app">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbarLeft">
          <span className="liveDot"></span>
          <span>Live coordination · 24/7</span>
        </div>
        <div className="topbarRight">
          <span>✆ +91 90000 00000</span>
          <span>✉ support@ambulancefirst.in</span>
          <span>IST {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
        </div>
      </div>

      {/* NAVBAR */}
      <header className={`navbar${scrolled ? " scrolled" : ""}`}>
        <button className="navBrand" onClick={() => go("home")} aria-label="Ambulance First home">
          <span className="navLogo">✚</span>
          <span className="navBrandText">Ambulance <strong>First</strong></span>
        </button>

        <button className="hamburger" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <nav className={`navLinks${menu ? " open" : ""}`}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`navLink${page === item.key ? " active" : ""}`}
              onClick={() => go(item.key)}
            >
              {item.label}
            </button>
          ))}
          <button className="navLoginBtn" onClick={() => go("login")}>Login</button>
          <button className="navBookBtn" onClick={() => go("booking")}>Book Ambulance</button>
        </nav>
      </header>

      {/* PAGES */}
      {page === "home"        && <HomePage       go={go} goDetail={goDetail} openGalleryDetail={openGalleryDetail} submit={submit} submitted={submitted} />}
      {page === "howitworks"  && <HowItWorksPage go={go} />}
      {page === "whychoose"   && <WhyChoosePage  go={go} />}
      {page === "serviceDetail" && serviceDetail && <ServiceDetailPage serviceKey={serviceDetail} go={go} />}
      {page === "about"       && <AboutPage      go={go} />}
      {page === "services"    && <ServicesPage   go={go} goDetail={goDetail} />}
      {page === "presence"    && <PresencePage   cities={cities} />}
      {page === "gallery"     && <GalleryPage    openGalleryDetail={openGalleryDetail} />}
      {page === "galleryDetail" && galleryDetail && <GalleryDetailPage item={GALLERY_ITEMS.find(item => item.key === galleryDetail)} go={go} back={backFromGalleryDetail} backLabel={gallerySource === "gallery" ? "Gallery" : "Home"} />}
      {page === "contact"     && <ContactPage    go={go} submit={submit} submitted={submitted} />}
      {page === "booking"     && <BookAmbulancePage submit={submit} submitted={submitted} />}
      {page === "livetracking" && <LiveTrackingPage go={go} />}
      {page === "login"       && <LoginPage      go={go} />}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <div className="footerLogo"><span className="navLogo">✚</span><span>Ambulance <strong>First</strong></span></div>
            <p>Reliable medical transportation across Air, Road and Rail — coordinated around patients and families.</p>
            <div className="footerContact">
              <span>✆ +91 90000 00000</span>
              <span>✉ support@ambulancefirst.in</span>
              <span>⌖ India</span>
            </div>
          </div>
          <div className="footerCol">
            <h4>Quick Links</h4>
            <button onClick={() => go("home")}>Home</button>
            <button onClick={() => go("services")}>Services</button>
            <button onClick={() => go("about")}>About</button>
            <button onClick={() => go("contact")}>Contact</button>
          </div>
          <div className="footerCol">
            <h4>Services</h4>
            <button onClick={() => goDetail("road")}>Road Ambulance</button>
            <button onClick={() => goDetail("air")}>Air Ambulance</button>
            <button onClick={() => goDetail("train")}>Train Ambulance</button>
            <button onClick={() => go("services")}>All Services</button>
          </div>
          <div className="footerCol">
            <h4>Emergency</h4>
            <p className="footerEmergency">For immediate assistance call:</p>
            <span className="footerPhone">+91 90000 00000</span>
            <button className="footerBookBtn" onClick={() => go("booking")}>Book Now</button>
          </div>
        </div>
        <div className="footerBottom">
          <span>© 2026 Ambulance First. All rights reserved.</span>
          <span>Medical transportation coordination services.</span>
        </div>
      </footer>
    </div>
  );
}

/* ── Shared small components ─────────────────────────── */
function SectionLabel({ children }) {
  return <p className="sectionLabel">{children}</p>;
}

function PageShell({ label, title, subtitle, children }) {
  return (
    <>
      <section className="pageHeroShell">
        <SectionLabel>{label}</SectionLabel>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </section>
      <div className="pageContent">{children}</div>
    </>
  );
}

function ExpandableInfoCard({ item, isOpen, onToggle, variant = "default" }) {
  return (
    <button
      type="button"
      className={`infoCard ${variant} ${isOpen ? "active" : ""}`}
      onClick={onToggle}
    >
      <div className="infoCardHeader">
        <div className="infoCardIcon">{item.icon}</div>
        <div className="infoCardText">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      </div>
      {isOpen && (
        <div className="infoCardExpanded">
          <img src={item.image} alt={item.title} />
          <p>{item.detail}</p>
        </div>
      )}
    </button>
  );
}

/* ── HomePage ────────────────────────────────────────── */
function HomePage({ go, goDetail, openGalleryDetail, submit, submitted }) {
  const [openInfo, setOpenInfo] = useState(null);

  return (
    <>
      {/* CINEMATIC HERO */}
      <CinematicHero go={go} />

      {/* EMERGENCY ACTION */}
      <section className="emergencyBand reveal">
        <div className="emergencyInner">
          <div className="emergencyText">
            <span className="emergencyPulse"></span>
            <div>
              <h2>Need an Ambulance?</h2>
              <p>Get reliable medical transportation quickly and safely.</p>
            </div>
          </div>
          <div className="emergencyActions">
            <button className="btnCoral" onClick={() => go("booking")}>Book Now</button>
            <button className="btnCoralOutline" onClick={() => go("contact")}>Emergency Assistance</button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section hsSectionWrap reveal" id="services">
        <div className="sectionHeader hsHeader">
          <SectionLabel>OUR MEDICAL TRANSPORT SERVICES</SectionLabel>
          <h2>Care that moves<br /><em className="hsHeadingEm">with the patient.</em></h2>
          <p className="sectionSubtitle">Choose the right medical transportation for every situation — ground, air or rail.</p>
        </div>
        <div className="hsGrid">
          {HOME_SERVICES.map(svc => (
            <article
              className="hsCard"
              key={svc.key}
              role="button"
              tabIndex={0}
              onClick={() => goDetail(svc.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goDetail(svc.key);
                }
              }}
            >
              <div className="hsImgWrap">
                <img src={svc.image} alt={svc.title} className="hsImg" />
                <div className="hsImgOverlay" />
                <span className="hsLabel">{svc.label}</span>
              </div>
              <div className="hsBody">
                <span className="hsIcon">{svc.icon}</span>
                <h3 className="hsTitle">{svc.title}</h3>
                <p className="hsDesc">{svc.desc}</p>
                <button className="hsBtn" onClick={(e) => { e.stopPropagation(); goDetail(svc.key); }}>
                  Explore Service <span className="hsBtnArrow">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section howSection reveal">
        <div className="sectionHeader howSectionHeader">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2>Four simple steps to safe<br />medical transportation.</h2>
        </div>
        <div className="howGrid">
          {HOW_IT_WORKS.map((step, i) => (
            <div className="howCard" key={step.step}>
              <div className="howNum">{step.step}</div>
              <div className="howIcon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {i < HOW_IT_WORKS.length - 1 && <div className="howArrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="section reveal">
        <div className="sectionHeader">
          <SectionLabel>WHY CHOOSE AMBULANCE FIRST?</SectionLabel>
          <h2>Trusted by patients and families<br />across India.</h2>
        </div>
        <div className="whyGrid">
          {WHY_CHOOSE.map(item => (
            <ExpandableInfoCard
              key={item.title}
              item={item}
              isOpen={openInfo === item.title}
              onToggle={() => setOpenInfo(openInfo === item.title ? null : item.title)}
            />
          ))}
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="aboutStrip reveal">
        <div className="aboutStripImg">
          <img src={IMG.about} alt="Medical team coordination" />
        </div>
        <div className="aboutStripText">
          <SectionLabel>ABOUT AMBULANCE FIRST</SectionLabel>
          <h2>Reliable medical transportation, built around the patient.</h2>
          <p>Ambulance First provides coordinated medical transportation across Air, Road and Rail. Our focus is simple — make the movement from pickup to destination safe, timely and well-supported for every patient and family.</p>
          <p>We bring together transport coordination, medical personnel and destination planning into one clear experience.</p>
          <button className="btnPrimary" onClick={() => go("about")}>Learn More About Us</button>
        </div>
      </section>

      {/* SERVICE NETWORK */}
      <section className="section sectionCream reveal">
        <div className="sectionHeader">
          <SectionLabel>OUR SERVICE NETWORK</SectionLabel>
          <h2>Connecting major healthcare destinations<br />across India.</h2>
          <p className="sectionSubtitle">Sample service locations — our coordination network covers major cities and healthcare destinations.</p>
        </div>
        <div className="networkGrid">
          {cities.map(c => (
            <div className="networkCity" key={c}>
              <span className="networkDot">●</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="section reveal">
        <div className="sectionHeader">
          <SectionLabel>GALLERY</SectionLabel>
          <h2>Our services in action.</h2>
        </div>
        <div className="galleryGrid">
          {GALLERY_ITEMS.map(item => (
            <button className="galleryItem" key={item.key} type="button" onClick={() => openGalleryDetail(item.key)}>
              <img src={item.img} alt={item.label} />
              <div className="galleryItemOverlay"><span>{item.label}</span></div>
            </button>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="statsBand reveal">
        <div className="statItem"><strong>24/7</strong><span>Coordination Availability</span></div>
        <div className="statItem"><strong>3</strong><span>Core Transport Modes</span></div>
        <div className="statItem"><strong>10+</strong><span>Service Locations</span></div>
        <div className="statItem"><strong>100%</strong><span>Patient-Focused</span></div>
      </section>

      {/* FINAL CTA */}
      <section className="finalCta reveal">
        <div className="finalCtaInner">
          <SectionLabel>WHEN EVERY SECOND MATTERS</SectionLabel>
          <h2>When Every Second Matters,<br />Choose Ambulance First</h2>
          <p>Reliable medical transportation is just a booking away.</p>
          <div className="finalCtaActions">
            <button className="btnPrimary" onClick={() => go("booking")}>Book an Ambulance</button>
            <button className="btnOutlineLight" onClick={() => go("contact")}>Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── LiveTrackingPage ───────────────────────────────── */
function LiveTrackingPage({ go }) {
  return (
    <>
      <section className="pageHeroShell ltPageHero">
        <p className="sectionLabel">LIVE AMBULANCE TRACKING</p>
        <h1>Track Your Ambulance Journey</h1>
        <p>Monitor emergency transportation progress from pickup to hospital arrival in real time.</p>
        <div className="ltPageHeroBadges">
          <span><span className="ltPageLiveDot" />Live Simulation</span>
          <span>🚑 Mock Data Only</span>
          <span>📍 Hyderabad Network</span>
        </div>
      </section>
      <div className="pageContent ltPageContent">
        <LiveTracking />
      </div>
    </>
  );
}

/* ── HowItWorksPage ──────────────────────────────────── */
function HowItWorksPage({ go }) {
  const [openStep, setOpenStep] = useState(null);

  return (
    <PageShell label="HOW IT WORKS" title="Simple Steps to Safe Medical Transportation" subtitle="From your first call to safe arrival — here is how Ambulance First coordinates your journey.">
      <div className="howGrid reveal" style={{ marginBottom: "60px" }}>
        {HOW_IT_WORKS.map(step => (
          <ExpandableInfoCard
            key={step.step}
            item={{ ...step, icon: step.icon }}
            isOpen={openStep === step.step}
            onToggle={() => setOpenStep(openStep === step.step ? null : step.step)}
            variant="how"
          />
        ))}
      </div>
      <div className="ctaBox reveal">
        <h2>Ready to get started?</h2>
        <p>Book your ambulance service now and our team will coordinate the rest.</p>
        <button className="btnPrimary" onClick={() => go("booking")}>Book an Ambulance</button>
      </div>
    </PageShell>
  );
}

/* ── WhyChoosePage ───────────────────────────────────── */
function WhyChoosePage({ go }) {
  const [openReason, setOpenReason] = useState(null);

  return (
    <PageShell label="WHY CHOOSE US" title="Why Choose Ambulance First?" subtitle="We are committed to providing reliable, safe and coordinated medical transportation for every patient.">
      <div className="whyGrid reveal" style={{ marginBottom: "60px" }}>
        {WHY_CHOOSE.map(item => (
          <ExpandableInfoCard
            key={item.title}
            item={item}
            isOpen={openReason === item.title}
            onToggle={() => setOpenReason(openReason === item.title ? null : item.title)}
          />
        ))}
      </div>
      <div className="ctaBox reveal">
        <h2>Experience the Ambulance First difference.</h2>
        <p>Contact us to discuss your medical transportation requirements.</p>
        <button className="btnPrimary" onClick={() => go("contact")}>Contact Us</button>
      </div>
    </PageShell>
  );
}

/* ── AboutPage ───────────────────────────────────────── */
function AboutPage({ go }) {
  return (
    <PageShell label="ABOUT US" title="About Ambulance First" subtitle="Reliable medical transportation, built around the patient.">
      <div className="aboutGrid reveal">
        <div className="aboutImg">
          <img src={IMG.about} alt="Medical team" />
        </div>
        <div className="aboutText">
          <SectionLabel>WHO WE ARE</SectionLabel>
          <h2>A medical transportation service designed around the entire journey.</h2>
          <p>Ambulance First brings Air, Road and Rail medical transportation into one coordinated experience. The concept is built around a simple idea: transportation should not feel like a disconnected hand-off.</p>
          <p>Families, patients, medical teams and receiving facilities should have a clear path from pickup to destination — with communication and support at every stage.</p>
          <div className="aboutValues">
            <div><strong>Patient First</strong><p>Planning begins with comfort, medical requirements and the safest practical movement plan.</p></div>
            <div><strong>Connected Operations</strong><p>Transport, medical support and destination coordination treated as one journey.</p></div>
            <div><strong>Clear Communication</strong><p>Simple request flows help families understand what is happening at each stage.</p></div>
            <div><strong>India Focused</strong><p>A flexible network for city-to-city movement across major Indian healthcare destinations.</p></div>
          </div>
          <button className="btnPrimary" onClick={() => go("contact")}>Get in Touch</button>
        </div>
      </div>
    </PageShell>
  );
}

/* ── ServicesPage ────────────────────────────────────── */
function ServicesPage({ go, goDetail }) {
  return (
    <PageShell label="OUR SERVICES" title="Medical Transportation Services" subtitle="Air, Road and Rail ambulance services — coordinated around your needs.">
      <div className="servicesGrid reveal" style={{ marginBottom: "60px" }}>
        {THREE_SERVICES.map(svc => (
          <article className="svcCard" key={svc.key} style={{ cursor: "pointer" }} onClick={() => goDetail(svc.key)}>
            <div className="svcImg">
              <video
                className="svcJourneyVideo"
                src={`/videos/${svc.key}-ambulance-journey.mp4`}
                poster={svc.image}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${svc.title} patient journey video`}
              />
              <div className="svcImgOverlay"></div>
              <span className="svcBadge">{svc.icon} {svc.title}</span>
            </div>
            <div className="svcBody">
              <h3>{svc.title}</h3>
              <p>{svc.short}</p>
            </div>
          </article>
        ))}
      </div>
      <SectionLabel>ALL SERVICES</SectionLabel>
      <div className="allServicesGrid reveal">
        {allServices.map((s) => (
          <button className="allSvcCard" key={s.title} onClick={() => s.detailKey ? goDetail(s.detailKey) : go("booking")}>
            <span className="allSvcIcon">{s.icon}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
            <span className="allSvcArrow">→</span>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

/* ── PresencePage ────────────────────────────────────── */
function PresencePage({ cities }) {
  return (
    <PageShell label="OUR PRESENCE" title="Service Network Across India" subtitle="Ambulance First coordinates medical transportation across major cities and healthcare destinations.">
      <div className="networkGrid reveal">
        {cities.map(c => (
          <div className="networkCity" key={c}>
            <span className="networkDot">●</span>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ── GalleryPage ─────────────────────────────────────── */
function GalleryPage({ openGalleryDetail }) {
  return (
    <PageShell label="GALLERY" title="Our Services in Action" subtitle="A visual overview of Ambulance First medical transportation services.">
      <div className="galleryGrid reveal">
        {GALLERY_ITEMS.map(item => (
          <button className="galleryItem" key={item.key} type="button" onClick={() => openGalleryDetail(item.key)}>
            <img src={item.img} alt={item.label} />
            <div className="galleryItemOverlay"><span>{item.label}</span></div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

function GalleryDetailPage({ item, go, back, backLabel }) {
  if (!item) return null;

  return (
    <>
      <section className="detailHero" style={{ backgroundImage: `url(${item.img})` }}>
        <div className="detailHeroOverlay"></div>
        <div className="detailHeroContent">
          <button className="backBtn" onClick={back}>← Back to {backLabel}</button>
          <p className="detailTag">AMBULANCE FIRST / SERVICE GALLERY</p>
          <h1>{item.label}</h1>
          <p className="detailShort">{item.description}</p>
          <button className="btnPrimary" onClick={() => go("contact")}>Contact Us</button>
        </div>
      </section>
      <div className="pageContent">
        <section className="galleryDetailSection">
          <SectionLabel>MORE ABOUT THIS SERVICE</SectionLabel>
          <h2>{item.label}</h2>
          <p>{item.description}</p>
          <div className="galleryDetailPhotos">
            {item.photos.map(photo => (
              <figure key={photo.label}>
                <img src={photo.img} alt={photo.label} />
                <figcaption>
                  <strong>{photo.label}</strong>
                  <span>{photo.description}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

/* ── ContactPage ─────────────────────────────────────── */
function ContactPage({ go, submit, submitted }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pickup: "",
    destination: "",
    service: "Road Ambulance",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    submit(e);
    setFormData({
      fullName: "",
      phone: "",
      pickup: "",
      destination: "",
      service: "Road Ambulance",
      message: "",
    });
  };

  return (
    <PageShell label="CONTACT US" title="Contact Ambulance First" subtitle="Tell us about the medical journey and our team will coordinate the rest.">
      <div className="contactGrid reveal">
        <div className="contactInfo">
          <SectionLabel>24/7 COORDINATION</SectionLabel>
          <h2>Let us help plan the journey.</h2>
          <p>Use the form to send a request. Replace the sample contact details with your company's official information before launch.</p>
          <div className="contactCards">
            <div className="contactCard"><span className="contactCardIcon">✆</span><div><strong>Phone</strong><span>+91 90000 00000</span></div></div>
            <div className="contactCard"><span className="contactCardIcon">✉</span><div><strong>Email</strong><span>support@ambulancefirst.in</span></div></div>
            <div className="contactCard"><span className="contactCardIcon">⌖</span><div><strong>Service Area</strong><span>India &amp; major healthcare destinations</span></div></div>
          </div>
        </div>
        <form className="contactForm" onSubmit={handleSubmit}>
          <div className="formRow">
            <input required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
            <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
          </div>
          <div className="formRow">
            <input name="pickup" value={formData.pickup} onChange={handleChange} placeholder="Pickup City" />
            <input name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination" />
          </div>
          <select name="service" value={formData.service} onChange={handleChange}>
            <option>Road Ambulance</option>
            <option>Air Ambulance</option>
            <option>Train Ambulance</option>
            <option>Helicopter Ambulance</option>
            <option>Commercial Air Escort</option>
            <option>Dead Body Transportation</option>
          </select>
          <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Tell us about the journey or medical requirement"></textarea>
          <button className="btnPrimary" type="submit">Submit Request</button>
          {submitted && <div className="formSuccess">✓ Request received. Our team will be in touch shortly.</div>}
        </form>
      </div>
    </PageShell>
  );
}

/* ── BookAmbulancePage ───────────────────────────────── */
function BookAmbulancePage({ submit, submitted }) {
  const initialFormData = {
    patientName: "",
    phone: "",
    pickup: "",
    destination: "",
    ambulanceType: "Road Ambulance",
    date: "",
    preferredTime: "",
    assistance: "Basic Patient Transport",
    notes: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    submit(e);
    setFormData(initialFormData);
  };

  return (
    <main className="bookingPage">
      <section className="bookingHero">
        <div className="bookingHeroContent">
          <span className="bookingEyebrow"><span aria-hidden="true">✚</span> 24/7 MEDICAL TRANSPORT COORDINATION</span>
          <h1>Book an Ambulance</h1>
          <p>Get reliable medical transportation when you need it most.</p>
          <a className="bookingHeroCta" href="#booking-form">Request an ambulance <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="bookingContent" id="booking-form">
        <div className="bookingIntro">
          <SectionLabel>PLAN A SAFE JOURNEY</SectionLabel>
          <h2>Tell us what the patient needs.</h2>
          <p>Share the journey details and our coordination team will follow up to discuss the right transport and care.</p>
        </div>

        <div className="bookingLayout">
          <form className="bookingForm" onSubmit={handleSubmit}>
            <div className="bookingFormHeading">
              <span className="bookingFormIcon" aria-hidden="true">✚</span>
              <div>
                <h3>Ambulance request</h3>
                <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
              </div>
            </div>

            <div className="bookingFields">
              <label className="bookingField">
                <span>Patient Name <b aria-hidden="true">*</b></span>
                <input required name="patientName" value={formData.patientName} onChange={handleChange} autoComplete="name" placeholder="Enter patient's full name" />
              </label>
              <label className="bookingField">
                <span>Phone Number <b aria-hidden="true">*</b></span>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" inputMode="tel" placeholder="Best number to reach you" />
              </label>
              <label className="bookingField">
                <span>Pickup Location <b aria-hidden="true">*</b></span>
                <input required name="pickup" value={formData.pickup} onChange={handleChange} autoComplete="street-address" placeholder="Address, city or landmark" />
              </label>
              <label className="bookingField">
                <span>Destination Hospital <b aria-hidden="true">*</b></span>
                <input required name="destination" value={formData.destination} onChange={handleChange} placeholder="Hospital name or destination" />
              </label>
              <label className="bookingField">
                <span>Ambulance Type <b aria-hidden="true">*</b></span>
                <select required name="ambulanceType" value={formData.ambulanceType} onChange={handleChange}>
                  <option>Road Ambulance</option>
                  <option>Air Ambulance</option>
                  <option>Train Ambulance</option>
                </select>
              </label>
              <label className="bookingField">
                <span>Medical Assistance Required <b aria-hidden="true">*</b></span>
                <select required name="assistance" value={formData.assistance} onChange={handleChange}>
                  <option>Basic Patient Transport</option>
                  <option>ICU Support</option>
                  <option>Emergency Medical Care</option>
                  <option>Oxygen Support</option>
                  <option>Doctor / Medical Team</option>
                </select>
              </label>
              <label className="bookingField">
                <span>Date <b aria-hidden="true">*</b></span>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} />
              </label>
              <label className="bookingField">
                <span>Preferred Time <b aria-hidden="true">*</b></span>
                <input required type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} />
              </label>
              <label className="bookingField bookingFieldWide">
                <span>Additional Notes</span>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="Share any important patient or journey details" />
              </label>
            </div>

            <button className="bookingSubmit" type="submit">Request Ambulance <span aria-hidden="true">→</span></button>
            {submitted && <div className="formSuccess" role="status">✓ Request received. Our coordination team will be in touch shortly.</div>}
          </form>

          <aside className="bookingAside">
            <div className="bookingSupportCard">
              <span className="bookingAsideIcon" aria-hidden="true">♡</span>
              <h3>Coordinated around the patient</h3>
              <p>Our team will review your route, transport type, and requested medical assistance with you.</p>
              <div className="bookingSupportDetail"><span aria-hidden="true">◷</span><span><strong>Available around the clock</strong><small>Coordination support, 24/7</small></span></div>
              <div className="bookingSupportDetail"><span aria-hidden="true">⌖</span><span><strong>Road, air and rail</strong><small>Choose the transport that fits the journey</small></span></div>
            </div>
            <div className="bookingEmergency" role="note">
              <span className="bookingEmergencyIcon" aria-hidden="true">!</span>
              <div>
                <h3>Need help right now?</h3>
                <p>For an urgent or life-threatening emergency, contact your local emergency services immediately. Do not wait for an online request.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ── LoginPage ───────────────────────────────────────── */
function LoginPage({ go }) {
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo"><span className="navLogo">✚</span><span>Ambulance <strong>First</strong></span></div>
        <h2>Welcome Back</h2>
        <p>Sign in to your Ambulance First account.</p>
        {loginSubmitted ? (
          <div className="formSuccess">Login functionality requires backend integration. This is a UI demonstration.</div>
        ) : (
          <form className="loginForm" onSubmit={handleLogin}>
            <input required type="email" name="email" value={loginData.email} onChange={handleChange} placeholder="Email address" />
            <input required type="password" name="password" value={loginData.password} onChange={handleChange} placeholder="Password" />
            <button className="btnPrimary" type="submit">Sign In</button>
          </form>
        )}
        <button className="loginBack" onClick={() => go("home")}>← Back to Home</button>
      </div>
    </div>
  );
}
