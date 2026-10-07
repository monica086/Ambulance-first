import { useEffect, useState } from "react";
import "./ServiceDetailPage.css";

const SERVICE_DETAILS = {
  road: {
    eyebrow: "GROUND MEDICAL TRANSPORT",
    title: "Road Ambulance Services",
    subtitle: "Reliable medical transportation with continuous patient care from pickup to hospital handover.",
    heroImage: "/medical-journey-frames/road/04-road-ambulance-in-transit.jpg",
    introduction: "Road Ambulance service provides medically supported transportation for patients who need safe movement between a home, hospital, clinic, airport, or another healthcare facility. Each transfer can be planned around the patient's condition, route, and required level of support.",
    why: [
      ["Rapid Ground Response", "Road transport can reach local pickup points directly and connect patients with nearby or regional healthcare facilities."],
      ["Trained Medical Crew", "Medical personnel can be coordinated according to the patient's needs and the level of support planned for the transfer."],
      ["Patient Monitoring", "Monitoring during transit can help the accompanying team observe the patient's condition and respond according to the care plan."],
      ["Equipped Patient Compartment", "The vehicle setup is selected for the journey and patient requirements; equipment availability is confirmed during planning."],
      ["Hospital-to-Hospital Transfers", "Coordinated transfers help connect the sending and receiving care teams, especially when a different facility is needed."],
      ["Bed-to-Bed Coordination", "Pickup, loading, route, arrival, and handover can be arranged as parts of one planned transfer."],
    ],
    uses: [
      ["Emergency hospital transport", "When urgent ground transport is needed, the coordinator can confirm the pickup location and destination facility."],
      ["Inter-hospital transfers", "For moving a patient between hospitals or to a specialist centre with support planned for the journey."],
      ["Critical-care transfers", "For patients who may need higher-level care, when the treating team confirms road travel is medically appropriate."],
      ["Diagnostic facility visits", "For supported transfers to or from imaging, testing, or other healthcare appointments."],
      ["Airport coordination", "For medically supported pickup or drop-off connecting an airport journey with a hospital or residence."],
      ["Planned medical transportation", "For scheduled appointments, treatment visits, or other journeys where assistance during travel is needed."],
      ["Supported discharge", "For patients leaving hospital who still need supervised or assisted transport to their next destination."],
    ],
    support: [
      ["Patient Stretcher", "Supports assisted movement and positioning; the type is selected for the patient and transfer."],
      ["Oxygen Support", "May be arranged when indicated by the care plan and confirmed for the vehicle and journey."],
      ["Vital Signs Monitoring", "Monitoring equipment may be selected according to the patient's condition and medical team's instructions."],
      ["Emergency Medical Supplies", "Supplies are planned in line with the transfer requirements and crew arrangements."],
      ["IV / Infusion Support", "Can be coordinated when required and appropriate for the patient during transport."],
      ["Suction Support", "May be included when required, subject to clinical assessment and equipment availability."],
    ],
    process: [
      ["Request & Patient Assessment", "Share the patient's condition, pickup, destination, and timing so the transfer can be assessed."],
      ["Ambulance & Medical Team Preparation", "The vehicle, crew, and support plan are matched to the needs confirmed for the journey."],
      ["Patient Pickup & Safe Loading", "The team coordinates access, assisted movement, and safe loading at the pickup point."],
      ["Monitored Journey", "The patient travels by the planned route with the agreed medical support and communication."],
      ["Hospital Handover", "At arrival, the team coordinates transfer and shares relevant journey information with the receiving care team."],
    ],
    journey: [
      ["Patient Preparation", "The patient and transfer requirements are assessed before movement begins."],
      ["Ambulance Loading", "The team assists with safe loading into the road ambulance."],
      ["Medical Care Inside the Ambulance", "The planned crew and equipment support care during the journey."],
      ["Ambulance In Transit", "The patient travels by road toward the agreed destination."],
      ["Hospital Arrival", "Arrival coordination prepares the transfer to the receiving facility."],
      ["Patient Handover", "The patient is transferred to the receiving team with a clear care handover."],
    ],
    included: ["Transfer request review", "Pickup and destination coordination", "Vehicle and crew planning", "Journey communication", "Arrival and handover coordination"],
    safetyTitle: "A road transfer planned around the patient",
    safety: "The transfer plan should reflect the patient's current condition, travel distance, and instructions from the treating team. Medical crew and equipment are confirmed for each journey rather than assumed to be identical across vehicles.",
    gallery: [0, 2, 4],
    faqs: [
      ["Who can use a road ambulance?", "Road ambulance transport may suit patients who need assistance or medical support while travelling by road. The patient's condition and required level of care should be assessed before arranging the transfer."],
      ["Can a patient be transferred between hospitals?", "Yes. Hospital-to-hospital transfers can be coordinated, including pickup, destination, and the planned handover between care teams."],
      ["Can medical staff accompany the patient?", "Medical personnel can be coordinated according to the patient's condition and transfer plan. The required crew should be confirmed when booking."],
      ["What information is required before arranging a transfer?", "Share the patient's current location, destination, condition, mobility needs, treating-team guidance, preferred timing, and a contact person."],
    ],
  },
  air: {
    eyebrow: "MEDICAL AIR TRANSPORT",
    title: "Air Ambulance Services",
    subtitle: "Coordinated medical air transportation for time-sensitive and long-distance patient transfers.",
    heroImage: "/medical-journey-frames/air/04-air-ambulance-in-flight.jpg",
    introduction: "Air ambulance coordination connects a patient with a suitable medical aircraft and care team when the distance, urgency, or route makes air transport a practical option. Planning brings together the sending facility, airport access, flight arrangements, ground transfers, and the receiving hospital.",
    why: [
      ["Long-Distance Reach", "Air transport can connect distant cities and reduce the time spent covering long routes over land."],
      ["Medical Crew Coordination", "The medical team is selected for the patient's condition and the planned flight, rather than assumed to be the same for every transfer."],
      ["ICU-Level Transport Support", "For clinically appropriate cases, higher-acuity support may be planned with the medical crew and aircraft configuration."],
      ["Continuous Patient Monitoring", "The transfer plan accounts for monitoring and care needs during airport movement and the flight."],
      ["Ground-to-Air Coordination", "Road transfers to and from airports can be coordinated to connect the patient's bed with the aircraft."],
      ["Bed-to-Bed Transfer Planning", "The sending and receiving facilities, flight stages, and handovers are planned together."],
    ],
    uses: [
      ["Long-distance transfers", "When a patient needs to travel between locations separated by a substantial distance."],
      ["Time-sensitive transfers", "When the treating team considers a faster long-distance transfer important to the patient's care."],
      ["Transfers between cities", "For connecting hospitals or specialist facilities in different cities."],
      ["When road travel takes significantly longer", "Air transport may be considered when the ground route would require substantially more travel time."],
      ["Specialized medical transfers", "For cases requiring a coordinated medical crew and transport plan during flight."],
      ["Domestic and international coordination", "Domestic routes can be arranged; international coordination may be possible where route, permissions, aircraft, and receiving-facility availability allow."],
    ],
    support: [
      ["Patient Monitoring", "The monitoring plan is determined by the patient's condition and flight requirements."],
      ["Oxygen Support", "Oxygen arrangements are confirmed against the care plan and aircraft requirements."],
      ["Transport Ventilator", "May be coordinated where clinically required and compatible with the aircraft and crew."],
      ["Infusion / Syringe Pumps", "Can be arranged when required, with setup planned for the flight."],
      ["Emergency Medication Support", "Medication planning is guided by the treating team and the medical crew."],
      ["Specialized Medical Equipment", "Equipment and staffing are selected according to patient condition and transfer requirements; not every aircraft carries identical equipment."],
    ],
    process: [
      ["Medical Information & Initial Assessment", "The patient's clinical summary and transfer need are reviewed with the relevant care team."],
      ["Transfer Planning", "Route, receiving facility, aircraft availability, timing, and required permissions are coordinated."],
      ["Aircraft & Medical Team Coordination", "A suitable aircraft and medical crew are planned around the patient's support requirements."],
      ["Ground Pickup & Airport Transfer", "Ground transport links the sending facility, departure airport, and aircraft."],
      ["In-Flight Medical Support", "The crew provides the planned monitoring and care during the flight."],
      ["Receiving Hospital Handover", "Arrival ground transport and the handover to the receiving team are coordinated."],
    ],
    journey: [
      ["Patient Preparation", "The patient and medical information are reviewed before the air transfer is arranged."],
      ["Air Ambulance Boarding", "The patient is prepared and loaded with the coordinated air medical crew."],
      ["In-Flight Medical Care", "The planned team and equipment support monitoring during the flight."],
      ["Air Ambulance In Flight", "The aircraft travels along the planned route to the destination."],
      ["Destination Arrival", "Arrival and onward ground transfer are coordinated with the receiving facility."],
      ["Patient Handover", "The patient is transferred to the receiving medical team."],
    ],
    included: ["Initial transfer review", "Aircraft and route coordination", "Medical crew planning", "Airport and ground-transfer coordination", "Receiving-facility handover planning"],
    safetyTitle: "Flight planning starts with clinical suitability",
    safety: "Air travel is not suitable for every patient or condition. The treating team and medical transport coordinator should assess clinical stability, flight duration, equipment needs, and receiving-facility readiness before confirming a transfer.",
    gallery: [1, 2, 4],
    faqs: [
      ["When should air ambulance transportation be considered?", "It may be considered for time-sensitive or long-distance transfers when the treating team finds air travel suitable and a coordinated flight plan is available."],
      ["Can critically ill patients travel by air ambulance?", "Some critical-care transfers may be possible with appropriate clinical assessment, crew, aircraft, and equipment. Suitability must be confirmed for the individual patient."],
      ["Is ground ambulance coordination included?", "Ground pickup and destination transfers can be coordinated as part of a bed-to-bed plan. Confirm the route and arrangements when requesting a quote."],
      ["How is medical equipment selected?", "The equipment and medical staffing are selected according to the patient's condition, treating-team guidance, aircraft configuration, and transfer requirements."],
    ],
  },
  train: {
    eyebrow: "RAIL MEDICAL TRANSPORT",
    title: "Train Ambulance Services",
    subtitle: "Medically supported rail transportation designed for planned and long-distance patient transfers.",
    heroImage: "/medical-journey-frames/train/04-vande-bharat-in-transit.jpg",
    introduction: "Train ambulance coordination arranges a medically supported rail journey for patients who are suitable for train travel and need to move between cities. The plan can connect the patient's origin and destination facilities with station access, stretcher arrangements, medical accompaniment, and onward transport.",
    why: [
      ["Long-Distance Connectivity", "Rail routes connect many Indian cities and can provide a practical option for extended journeys."],
      ["Medical Supervision", "A medical attendant or trained personnel can be coordinated according to the patient's condition and planned support."],
      ["Patient Comfort", "A reserved and appropriately arranged space can support a more settled journey for suitable patients."],
      ["Planned Transfer Coordination", "Rail availability, station access, boarding, and onward travel are organized around the journey plan."],
      ["Stretcher-Based Transportation", "Stretcher arrangements can be assessed for patients who cannot travel seated, subject to rail and route arrangements."],
      ["Hospital-to-Hospital Coordination", "Origin and destination facilities can be connected with station transfers and handover planning."],
    ],
    uses: [
      ["Long-distance patient transfers", "For suitable patients travelling a significant distance between cities."],
      ["Planned inter-city transportation", "When journey timing can be arranged around train schedules and medical preparation."],
      ["Patients medically suitable for rail", "Rail travel should be considered only after the treating team confirms the patient can safely make the journey."],
      ["Cost-conscious long-distance travel", "Where clinically appropriate and available, rail may offer a practical alternative to air transport."],
      ["Journeys requiring medical supervision", "A medical attendant or trained personnel can be coordinated for support during the rail journey."],
    ],
    support: [
      ["Patient Stretcher", "Stretcher arrangements are planned for patients who need assisted positioning during rail travel."],
      ["Vital Monitoring", "Monitoring support is considered according to the patient's condition and the journey plan."],
      ["Oxygen Support", "May be arranged when clinically indicated and confirmed for the rail setup and duration."],
      ["Medication Support", "Medication needs are planned with the treating team and accompanying medical personnel."],
      ["IV / Infusion Support", "Can be assessed where required, with arrangements confirmed before booking."],
      ["Medical Attendant", "A medical attendant or trained medical personnel may accompany the patient as the transfer requires."],
    ],
    process: [
      ["Patient Assessment", "The patient's condition, mobility, and suitability for rail travel are reviewed."],
      ["Rail Journey Planning", "Route, train availability, schedule, station access, and compartment requirements are coordinated."],
      ["Medical Team & Equipment Preparation", "The accompanying personnel and support equipment are selected for the patient's needs."],
      ["Safe Boarding", "Station access, stretcher movement, and boarding assistance are planned ahead of departure."],
      ["Monitored Rail Journey", "The patient travels with the agreed medical accompaniment and support plan."],
      ["Destination Handover", "Arrival assistance and onward transport connect the station with the receiving facility."],
    ],
    journey: [
      ["Patient Preparation", "The patient is assessed and prepared for a medically supported rail journey."],
      ["Train Boarding", "Station and boarding assistance are coordinated for the patient and stretcher."],
      ["Onboard Medical Care", "The patient travels with the planned medical support and care arrangements."],
      ["Vande Bharat In Transit", "The train journey proceeds along the planned route; this visual highlights modern Indian rail transport."],
      ["Destination Arrival", "Arrival assistance and onward transport are coordinated at the destination station."],
      ["Patient Handover", "The patient is transferred to the receiving facility or next arranged transport."],
    ],
    included: ["Patient suitability review", "Rail route and schedule coordination", "Boarding and station assistance planning", "Medical accompaniment planning", "Arrival and onward-transfer coordination"],
    safetyTitle: "Rail journeys require careful suitability and access planning",
    safety: "Train ambulance travel is intended for patients assessed as suitable for rail. The patient's mobility, care needs, journey length, station access, rail arrangements, and onward transfer should all be confirmed before departure.",
    gallery: [1, 2, 3],
    faqs: [
      ["When is train ambulance transportation suitable?", "It may suit patients who need long-distance medical supervision and are considered stable and appropriate for rail travel by their treating team."],
      ["Can a patient travel on a stretcher?", "Stretcher arrangements may be possible depending on train, route, station access, and booking availability. These details must be confirmed before the journey."],
      ["Can medical personnel accompany the patient?", "A medical attendant or other trained personnel can be coordinated based on the patient's care needs and transfer plan."],
      ["How is the journey coordinated with the destination hospital?", "The plan can include arrival station assistance, onward ground transport, and communication with the receiving facility for handover."],
    ],
  },
};

const JOURNEY_FRAMES = {
  road: [
    "01-patient-on-stretcher.jpg",
    "02-loading-into-road-ambulance.jpg",
    "03-inside-road-ambulance-medical-care.jpg",
    "04-road-ambulance-in-transit.jpg",
    "05-hospital-arrival.jpg",
    "06-patient-transfer-handover.jpg",
  ],
  air: [
    "01-patient-on-stretcher.jpg",
    "02-loading-into-air-ambulance.jpg",
    "03-inside-air-ambulance-medical-care.jpg",
    "04-air-ambulance-in-flight.jpg",
    "05-air-ambulance-arrival.jpg",
    "06-patient-transfer-handover.jpg",
  ],
  train: [
    "01-patient-on-stretcher.jpg",
    "02-boarding-train.jpg",
    "03-inside-train-medical-care.jpg",
    "04-vande-bharat-in-transit.jpg",
    "05-destination-arrival.jpg",
    "06-patient-transfer-handover.jpg",
  ],
};

function DetailCards({ items, className = "" }) {
  return (
    <div className={`sd-card-grid ${className}`}>
      {items.map(([title, description], index) => (
        <article className="sd-card" key={title}>
          <span className="sd-card-number">{String(index + 1).padStart(2, "0")}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}

function ServiceCinematicLayer({ service, serviceKey, frames, activeStage }) {
  const [visibleStage, setVisibleStage] = useState(activeStage);
  const [previousStage, setPreviousStage] = useState(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (activeStage === visibleStage) return undefined;

    setPreviousStage(visibleStage);
    setFading(true);
    const transition = window.setTimeout(() => {
      setVisibleStage(activeStage);
      setPreviousStage(null);
      setFading(false);
    }, 500);

    return () => window.clearTimeout(transition);
  }, [activeStage, visibleStage]);

  const imageUrl = (stage) => `/medical-journey-frames/${serviceKey}/${frames[stage]}`;

  return (
    <div className="sd-cinematic-layer" aria-label={`${service.title} cinematic journey`}>
      {previousStage !== null && (
        <div className="chBg chBgPrev" key={`previous-${previousStage}`}>
          <img src={imageUrl(previousStage)} alt="" aria-hidden="true" />
          <div className="chOverlay" />
        </div>
      )}
      <div className={`chBg chBgCur${fading ? " chBgFadeOut" : ""}`} key={`current-${visibleStage}`}>
        <img src={imageUrl(visibleStage)} alt="" aria-hidden="true" className="chBgImg" />
        <div className="chOverlay" />
      </div>
    </div>
  );
}

export default function ServiceDetailPage({ serviceKey, go }) {
  const service = SERVICE_DETAILS[serviceKey];
  const frames = JOURNEY_FRAMES[serviceKey] || [];
  const [activeStage, setActiveStage] = useState(0);
  const journeyTitle = serviceKey === "train"
    ? "A coordinated rail journey, stage by stage"
    : serviceKey === "air"
      ? "A coordinated air transfer, stage by stage"
      : "A coordinated road transfer, stage by stage";

  useEffect(() => {
    if (!service) return undefined;

    const page = document.querySelector(".service-detail");
    if (!page) return undefined;

    let frame = 0;
    const updateStage = () => {
      frame = 0;
      const pageTop = page.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(1, window.innerHeight * 2.2);
      const scrollProgress = Math.max(0, window.scrollY - pageTop) / scrollRange;
      const nextStage = Math.floor(scrollProgress * service.journey.length) % service.journey.length;
      setActiveStage(nextStage);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateStage);
    };

    setActiveStage(0);
    updateStage();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [service, serviceKey]);

  if (!service) return null;

  return (
    <main className={`service-detail service-detail-${serviceKey}`}>
      <ServiceCinematicLayer
        service={service}
        serviceKey={serviceKey}
        frames={frames}
        activeStage={activeStage}
      />
      <section className="sd-hero" data-cinematic-stage="0">
        <div className="sd-hero-inner">
          <button className="sd-back sd-back-hero" onClick={() => go("services")}>← Back to Services</button>
          <p className="sd-eyebrow">{service.eyebrow} <span>·</span> AMBULANCE FIRST</p>
          <h1>{service.title}</h1>
          <p className="sd-hero-subtitle">{service.subtitle}</p>
          <div className="sd-hero-actions">
            <button className="sd-primary-button" onClick={() => go("booking")}>Request Ambulance</button>
            <button className="sd-outline-button" onClick={() => go("contact")}>Contact Us</button>
          </div>
        </div>
        <div className="sd-hero-caption">{serviceKey === "train" ? "Vande Bharat · coordinated rail transfer" : serviceKey === "air" ? "Medical aircraft · coordinated in-flight care" : "Ground response · patient-centred transfer"}</div>
      </section>

      <div className="sd-content">
        <section className="sd-intro sd-section" data-cinematic-stage="0">
          <div>
            <p className="sd-kicker">THE SERVICE</p>
            <h2>Care planned around the whole transfer.</h2>
            <p className="sd-lead">{service.introduction}</p>
          </div>
          <div className="sd-intro-note">
            <span className="sd-note-icon">✚</span>
            <div>
              <strong>Every transfer is different</strong>
              <p>Transport, staffing, and equipment are confirmed against the patient's needs and journey.</p>
            </div>
          </div>
        </section>

        <section className="sd-section" data-cinematic-stage="1">
          <div className="sd-section-heading">
            <p className="sd-kicker">WHY CHOOSE THIS SERVICE</p>
            <h2>{serviceKey === "road" ? "Reliable support from pickup to handover." : serviceKey === "air" ? "Connect distance, medical care, and destination." : "Make a long-distance rail transfer manageable."}</h2>
          </div>
          <DetailCards items={service.why} className="sd-benefit-grid" />
        </section>

        <section className="sd-section sd-use-section" data-cinematic-stage="1">
          <div className="sd-section-heading">
            <p className="sd-kicker">WHEN IT MAY BE USEFUL</p>
            <h2>Choose transport to suit the patient and route.</h2>
            <p>Suitability depends on the patient's condition, treating-team guidance, route, and available arrangements.</p>
          </div>
          <DetailCards items={service.uses} className="sd-use-grid" />
        </section>

        <section className="sd-section" data-cinematic-stage="2">
          <div className="sd-section-heading">
            <p className="sd-kicker">MEDICAL CARE & EQUIPMENT</p>
            <h2>Support is planned for the individual journey.</h2>
            <p>Equipment and medical staffing are assessed for each patient. Availability and suitability should be confirmed before the transfer.</p>
          </div>
          <DetailCards items={service.support} className="sd-support-grid" />
        </section>

        <section className="sd-process-section" data-cinematic-stage="3">
          <div className="sd-section-heading">
            <p className="sd-kicker">HOW THE SERVICE WORKS</p>
            <h2>Clear steps. Coordinated care.</h2>
          </div>
          <ol className="sd-process">
            {service.process.map(([title, description], index) => (
              <li key={title}>
                <span className="sd-process-number">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="sd-section sd-journey-section">
          <div className="sd-section-heading">
            <p className="sd-kicker">PATIENT JOURNEY</p>
            <h2>{journeyTitle}</h2>
            <p>These are six separate stages of the journey, shown as still images in the correct order.</p>
          </div>
          <div className="sd-journey-grid">
            {service.journey.map(([title, description], index) => (
              <article
                className={`sd-journey-card${serviceKey === "train" && index === 3 ? " sd-journey-featured" : ""}`}
                key={title}
                data-cinematic-stage={index}
              >
                <div className="sd-journey-image">
                  <img
                    src={`/medical-journey-frames/${serviceKey}/${frames[index]}`}
                    alt={`${service.title}: ${title}`}
                    loading={index > 1 ? "lazy" : "eager"}
                  />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="sd-journey-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="sd-section sd-included-section" data-cinematic-stage="4">
          <div className="sd-included-copy">
            <p className="sd-kicker">WHAT IS INCLUDED</p>
            <h2>One coordinated transfer plan.</h2>
            <p>The exact arrangements depend on the patient's needs, route, and confirmed service plan.</p>
          </div>
          <ul className="sd-included-list">
            {service.included.map((item) => <li key={item}><span>✓</span>{item}</li>)}
          </ul>
        </section>

        <section className="sd-safety-section" data-cinematic-stage="4">
          <div className="sd-safety-image">
            <img src={`/medical-journey-frames/${serviceKey}/${frames[2]}`} alt={`${service.title} medical care`} loading="lazy" />
          </div>
          <div className="sd-safety-copy">
            <p className="sd-kicker">SAFETY & PATIENT CARE</p>
            <h2>{service.safetyTitle}</h2>
            <p>{service.safety}</p>
            <button className="sd-text-link" onClick={() => go("contact")}>Discuss a patient transfer <span>→</span></button>
          </div>
        </section>

        <section className="sd-section sd-gallery-section" data-cinematic-stage="5">
          <div className="sd-section-heading">
            <p className="sd-kicker">SERVICE VISUALS</p>
            <h2>{serviceKey === "train" ? "Rail transport and onboard care." : serviceKey === "air" ? "Aircraft, transfer, and medical care." : "Ground response and medical support."}</h2>
          </div>
          <div className="sd-gallery-grid">
            {service.gallery.map((frameIndex) => (
              <figure key={frames[frameIndex]}>
                <img src={`/medical-journey-frames/${serviceKey}/${frames[frameIndex]}`} alt={`${service.title} visual ${frameIndex + 1}`} loading="lazy" />
                <figcaption>{service.journey[frameIndex][0]}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="sd-section sd-faq-section" data-cinematic-stage="5">
          <div className="sd-section-heading">
            <p className="sd-kicker">FREQUENTLY ASKED QUESTIONS</p>
            <h2>Helpful answers before you arrange a transfer.</h2>
          </div>
          <div className="sd-faq-list">
            {service.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sd-cta" data-cinematic-stage="5">
          <p className="sd-kicker">24/7 COORDINATION</p>
          <h2>Need medical transportation?</h2>
          <p>Tell us what the patient needs and our team can help coordinate the appropriate transportation option.</p>
          <div className="sd-hero-actions">
            <button className="sd-primary-button" onClick={() => go("booking")}>Request Ambulance</button>
            <button className="sd-outline-button" onClick={() => go("contact")}>Contact Us</button>
          </div>
          <button className="sd-back sd-back-bottom" onClick={() => go("services")}>← Back to Services</button>
        </section>
      </div>
    </main>
  );
}
