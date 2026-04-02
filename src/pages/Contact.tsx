import { useState } from "react";
import { MapPin, Clock, Phone, Truck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { sendContact } from "@/api/index";
import PageHero from "@/components/PageHero";
import shopDay from "@/assets/shop-day.jpg";

const contactInfo = [
  { icon: MapPin, title: "Address", detail: "Near Hotel Jai Shree, Hisar, Haryana" },
  { icon: Clock, title: "Hours", detail: "8:00 AM – 10:00 PM Daily", showPulse: true },
  { icon: Phone, title: "Phone", detail: "+91 98765 43210" },
  { icon: Truck, title: "Delivery", detail: "Home Delivery Available in Hisar" },
];

const enquiryCategories = ["General", "Bulk Order", "Catering", "Gift Box"];

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "", category: "General" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        // Send form data to backend
        await sendContact({
            name: form.name,
            phone: form.phone,   // your form uses phone instead of email
            message: `[${form.category}] ${form.message}` // include category in message
        });

        // Show success message
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm({ name: "", phone: "", message: "", category: "General" });

    } catch (error) {
        alert("Failed to send message. Make sure backend is running!");
    }
};

  return (
    <div>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you" bgImage={shopDay} />

      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info Cards */}
            <div>
              <AnimatedSection>
                <h2 className="text-3xl font-bold text-foreground mb-8">Get in Touch</h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((c, i) => (
                  <AnimatedSection key={i}>
                    <div className="bg-card gold-border rounded-xl p-5 hover-lift">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <c.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-bold text-foreground">{c.title}</h3>
                            {c.showPulse && (
                              <span className="flex items-center gap-1 text-xs text-whatsapp font-body">
                                <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse-dot" />
                                Open Now
                              </span>
                            )}
                          </div>
                          <p className="font-body text-sm text-muted-foreground mt-1">{c.detail}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Form */}
            <AnimatedSection>
              <div className="bg-card gold-border rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-display text-xl font-bold text-primary">Message Sent!</p>
                    <p className="font-body text-sm text-muted-foreground mt-2">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="font-body text-sm font-medium text-foreground block mb-1">Enquiry Type</label>
                      <div className="flex flex-wrap gap-2">
                        {enquiryCategories.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setForm({ ...form, category: c })}
                            className={`font-body text-sm px-3 py-1.5 rounded-full transition-all ${
                              form.category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-foreground block mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-foreground block mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-foreground block mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground font-body font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111536.38928995498!2d75.65653!3d29.15394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391232d60ed1458d%3A0x2baba1b2f30e5098!2sHisar%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Saini Sweets Location - Hisar"
        />
      </section>
    </div>
  );
};

export default Contact;
