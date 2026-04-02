import AnimatedSection from "@/components/AnimatedSection";
import PageHero from "@/components/PageHero";
import { Heart, Users, Award, Sparkles } from "lucide-react";
import shopDay from "@/assets/shop-day.jpg";

const timeline = [
  { year: "1998", title: "Founded in Hisar", desc: "Started as a small family sweet shop with traditional Haryanvi recipes." },
  { year: "2005", title: "Expanded", desc: "Grew to a bigger shop with namkeen and bakery items added." },
  { year: "2012", title: "Added South Indian", desc: "Introduced dosa, idli and South Indian specialties by popular demand." },
  { year: "2020", title: "Home Delivery", desc: "Launched delivery service across Hisar city during challenging times." },
  { year: "2025", title: "Still Going Strong", desc: "Serving Hisar with the same love, quality and tradition since day one." },
];

const values = [
  { icon: Heart, title: "Made with Love", desc: "Every sweet is handcrafted with passion by our family of halwais." },
  { icon: Users, title: "Family Legacy", desc: "Three generations of sweet-making tradition, passed down with pride." },
  { icon: Award, title: "Quality First", desc: "We never compromise — only the finest ingredients make it to your plate." },
  { icon: Sparkles, title: "Fresh Daily", desc: "Everything is prepared fresh every morning in our Hisar kitchen." },
];

const About = () => (
  <div>
    <PageHero title="Our Story" subtitle="25 years of sweetening Hisar" bgImage={shopDay} />

    {/* Story */}
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div className="relative">
              <img src={shopDay} alt="Saini Sweets Shop" className="rounded-xl shadow-lg w-full" />
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-primary flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <span className="font-display text-2xl font-bold text-primary-foreground">25</span>
                  <span className="font-body text-xs text-primary-foreground/80 block">Years</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">From a Small Shop to Hisar's Favourite</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Founded in 1998 by the Saini family, our journey began with a simple mission — to bring the authentic taste of Haryanvi sweets to every home in Hisar. What started as a modest mithai shop has grown into a beloved institution, trusted by generations.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              We use pure desi ghee, real saffron, and time-honoured recipes passed down through our family. Every ladoo, every barfi, every samosa is made with the same care and love that our founders believed in.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-padding bg-muted">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Our Journey</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4" />
        </AnimatedSection>
        <div className="max-w-2xl mx-auto">
          {timeline.map((t, i) => (
            <AnimatedSection key={i}>
              <div className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="font-display text-xs font-bold text-primary-foreground">{t.year}</span>
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 h-full bg-secondary/30 mt-2" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">{t.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{t.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Our Values</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4" />
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <AnimatedSection key={i}>
              <div className="bg-card gold-border rounded-xl p-6 text-center hover-lift">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{v.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Quote */}
    <section className="section-padding bg-muted">
      <div className="container mx-auto text-center max-w-3xl">
        <AnimatedSection>
          <p className="text-2xl md:text-4xl font-display italic text-foreground leading-relaxed">
            "We don't just make sweets — we make memories. Every piece carries the warmth of our family and the spirit of Hisar."
          </p>
          <p className="font-body text-muted-foreground mt-6">— The Saini Family</p>
        </AnimatedSection>
      </div>
    </section>
  </div>
);

export default About;
