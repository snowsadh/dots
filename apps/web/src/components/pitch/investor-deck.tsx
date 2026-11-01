"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { investorLabels, investorSlides } from "@/data/investor";
import { siteContent } from "@/data/site";
import styles from "./investor-deck.module.css";

export function InvestorDeck() {
  const [current, setCurrent] = useState(0);
  const slide = investorSlides[current];

  const move = useCallback((direction: -1 | 1) => {
    setCurrent((index) =>
      Math.min(Math.max(index + direction, 0), investorSlides.length - 1)
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  return (
    <main className={styles.deck}>
      <section className={`${styles.slide} ${styles[`slide${current}`]}`} aria-label={`${investorLabels.slide} ${current + 1} ${investorLabels.of} ${investorSlides.length}`}>
        <div className={styles.copy}>
          <header className={styles.topline}>
            <span className={styles.brand}>{siteContent.title}</span>
            <span>{slide.section}</span>
          </header>
          <div className={styles.story}>
            <span className={styles.index}>{String(current + 1).padStart(2, "0")}</span>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.body}>{slide.body}</p>
            <p className={styles.takeaway}>{slide.takeaway}</p>
          </div>
          <footer className={styles.footer}>
            <span className={styles.kicker}>{investorLabels.kicker}</span>
            <div className={styles.controls} aria-label={investorLabels.controls}>
              <button className={styles.control} type="button" onClick={() => move(-1)} disabled={current === 0} aria-label={investorLabels.previous}>
                <ChevronLeft aria-hidden="true" size={22} />
              </button>
              <span className={styles.counter} aria-live="polite">{current + 1} / {investorSlides.length}</span>
              <button className={styles.control} type="button" onClick={() => move(1)} disabled={current === investorSlides.length - 1} aria-label={investorLabels.next}>
                <ChevronRight aria-hidden="true" size={22} />
              </button>
            </div>
          </footer>
        </div>
        {"photo" in slide ? (
          <div className={styles.visual}>
            <Image
              src={slide.photo.src}
              alt={slide.photo.alt}
              fill
              priority={current === 0}
              sizes="(max-width: 800px) 100vw, 45vw"
              className={slide.photo.fit === "contain" ? styles.contain : styles.cover}
            />
            <span className={styles.photoCaption}>{slide.photo.caption}</span>
          </div>
        ) : (
          <div className={styles.routes}>
            {slide.routes.map((route, index) => (
              <article className={styles.route} key={route.label}>
                <span className={styles.routeNumber}>0{index + 1} / {route.label}</span>
                <h2>{route.title}</h2>
                <p>{route.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
