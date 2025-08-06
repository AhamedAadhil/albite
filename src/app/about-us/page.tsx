"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../css/AboutusPage.module.css";

const chefs = [
  {
    id: 1,
    name: "Chef 1",
    description:
      "A passionate culinary expert with a vision for quality and consistency.",
    image: "/chefs/chef1.jpg",
  },
  {
    id: 2,
    name: "Chef 2",
    description:
      "A passionate culinary expert with a vision for quality and consistency.",
    image: "/chefs/chef2.jpg",
  },
];

const AboutusPage: React.FC = () => {
  const [hoveredChef, setHoveredChef] = useState<number | null>(null);

  return (
    <main
      style={{
        backgroundColor: "#f9fafb",
        fontFamily:
          "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        lineHeight: 1.6,
      }}
    >
      {/* Hero Section */}
      <div className={styles.backgroundPattern}>
        <section className={styles.heroSection} aria-label="Hero Section">
          <div className={styles.heroOverlay} />
          <Image
            src="/logo/logo.png"
            alt="Albite Cloud Kitchen Logo"
            width={280}
            height={80}
            className={styles.heroLogo}
            priority
          />

          <h1 className={styles.heroTitle}>Welcome to Albite Cloud Kitchen</h1>
          <p className={styles.heroSubtitle}>
            Since 2006, we’ve been delivering passion, flavor, and innovation
            from our kitchen to your doorstep.
          </p>
        </section>
      </div>
      {/* Who We Are */}
      <section className={styles.container} aria-labelledby="who-we-are-title">
        <h2 className={styles.sectionTitle} id="who-we-are-title">
          Who We Are
        </h2>
        <p className={styles.sectionText}>
          Albite Cloud Kitchen is more than just a food business. We're a
          culinary movement built on quality, consistency, and creativity.
          Operating without a physical restaurant, we optimize our resources to
          focus entirely on what matters most—your experience.
        </p>
      </section>
      {/* Objectives, Aims & Goals */}

      <div className={styles.backgroundDiagonalStripes}>
        <section
          className={styles.container}
          aria-labelledby="objectives-title"
        >
          <h2 className={styles.sectionSubTitle} id="objectives-title">
            Our Objectives
          </h2>
          <ul className={styles.objectivesList}>
            <li>Deliver high-quality meals consistently</li>
            <li>Maintain strong customer satisfaction and trust</li>
            <li>Innovate continuously in recipes and food delivery</li>
          </ul>

          <h2 className={styles.sectionSubTitle}>Our Aims</h2>
          <p className={styles.sectionText}>
            To become the most trusted name in cloud kitchens by redefining how
            food reaches and pleases customers.
          </p>

          <h2 className={styles.sectionSubTitle}>Our Goals</h2>
          <p className={styles.sectionText}>
            Expand across regions, introduce more verticals like healthy meals
            and corporate catering, and elevate food standards without
            compromising efficiency.
          </p>
        </section>
      </div>
      {/* History */}
      <section
        className={styles.historySection}
        aria-labelledby="journey-title"
      >
        <h2 className={styles.sectionSubTitle} id="journey-title">
          Our Journey
        </h2>
        <p>
          Since 2006, Albite has evolved from a small family-run delivery
          kitchen into a modern, scalable cloud kitchen solution. From handling
          10 orders a day to now serving hundreds, our growth is fueled by love,
          loyalty, and feedback from our cherished customers.
        </p>
      </section>
      {/* Meet Our Chefs */}
      <section className={styles.container} aria-labelledby="chefs-title">
        <h2 className={styles.sectionTitle} id="chefs-title">
          Meet Our Chefs
        </h2>
        <div className={styles.chefsContainer}>
          {chefs.map(({ id, name, description, image }) => (
            <div
              key={id}
              className={`${styles.chefCard} ${
                hoveredChef === id ? styles.chefCardHover : ""
              }`}
              onMouseEnter={() => setHoveredChef(id)}
              onMouseLeave={() => setHoveredChef(null)}
              onFocus={() => setHoveredChef(id)}
              onBlur={() => setHoveredChef(null)}
              tabIndex={0}
              role="article"
              aria-label={`${name} - ${description}`}
            >
              <Image
                src={image}
                alt={name}
                width={300}
                height={200}
                className={styles.chefImage}
                priority={id === 1} // preload first image for better UX
              />
              <h3 className={styles.chefName}>{name}</h3>
              <p className={styles.chefDescription}>{description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Vision */}
      <section className={styles.visionSection} aria-labelledby="vision-title">
        <h2 className={styles.sectionSubTitle} id="vision-title">
          Our Vision
        </h2>
        <p>
          To become a national leader in cloud kitchen services, enabling food
          lovers everywhere to experience culinary excellence from the comfort
          of their homes.
        </p>
      </section>
      {/* Why Choose Us */}
      <section className={styles.container} aria-labelledby="why-choose-title">
        <h2 className={styles.sectionSubTitle} id="why-choose-title">
          Why Choose Albite?
        </h2>
        <ul className={styles.whyChooseList}>
          <li>Authentic taste & consistent quality</li>
          <li>Years of industry experience since 2006</li>
          <li>Fast, safe, and fresh delivery</li>
          <li>Transparent, customer-first service</li>
        </ul>
      </section>

      {/* Contact & Partnerships */}
      <div className={styles.backgroundCheckerDots}>
        <section
          className={styles.contactSection}
          aria-labelledby="contact-title"
        >
          <h2 className={styles.contactTitle} id="contact-title">
            Let’s Work Together
          </h2>
          <p className={styles.contactText}>
            Whether you're a vendor, chef, partner, or customer—we’d love to
            hear from you. Let’s build the future of food together.
          </p>
          <Link href="/contact" className={styles.contactButton}>
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
};

export default AboutusPage;
