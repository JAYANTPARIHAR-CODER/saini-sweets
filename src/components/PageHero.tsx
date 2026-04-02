import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
}

const PageHero = ({ title, subtitle, bgImage }: PageHeroProps) => (
  <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
    {bgImage ? (
      <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
    ) : (
      <div className="absolute inset-0 gradient-placeholder" />
    )}
    <div className="absolute inset-0 bg-dark-brown/70" />
    <div className="relative text-center z-10 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-cream"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg text-cream/80 font-body"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </section>
);

export default PageHero;
