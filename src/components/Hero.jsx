import { motion } from "framer-motion";
import config from "../config";

/**
 * Invitation hero, mounted behind the opening video from the start.
 * Background is the exact final frame of the opening video so the
 * video's `ended` crossfade lands on a pixel-matching still.
 * Names and details are real HTML text — editable and responsive.
 */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ started }) {
  const { couple, hero } = config;
  return (
    <header
      className="hero hero-arch"
      style={{ backgroundImage: `url(${config.assets.heroFinalFrame})` }}
    >
      <div className="hero-scrim" aria-hidden="true" />
      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate={started ? "show" : "hidden"}
      >
        <motion.p className="hero-kicker" variants={item}>
          {hero.introLine}
        </motion.p>
        <motion.h1 className="script-names hero-names" variants={item}>
          <span>{couple.bride.name}</span>
        </motion.h1>
        <motion.div className="hero-amp" variants={item} aria-hidden="true">
          <i /><em>&amp;</em><i />
        </motion.div>
        <motion.h1 className="script-names hero-names" variants={item}>
          <span>{couple.groom.name}</span>
        </motion.h1>
        <motion.p className="hero-invite" variants={item}>
          {hero.inviteLine}
        </motion.p>
        <motion.div className="hero-bottom" variants={item} aria-hidden="true">
          <span>{hero.bottomLine}</span>
          <b>◆</b>
        </motion.div>
      </motion.div>
      <div className="hero-scallop" aria-hidden="true" />
    </header>
  );
}
