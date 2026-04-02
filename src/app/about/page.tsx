'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Crown,
  Scissors,
  Ruler,
  Heart,
  Award,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star,
  Target,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

const team = [
  {
    name: 'Joseph Malipula',
    role: 'Founder & Master Tailor',
    image: '/images/malipula/team1.jpg',
    bio: 'With over 15 years of experience, Joseph founded Malipula Suits with a vision to bring world-class tailoring to Tanzania.',
  },
  {
    name: 'Grace Mwakasege',
    role: 'Head of Design',
    image: '/images/malipula/team2.jpg',
    bio: 'Grace brings creative excellence to every design, blending African heritage with contemporary fashion.',
  },
  {
    name: 'Peter Kimaro',
    role: 'Senior Tailor',
    image: '/images/malipula/team3.jpg',
    bio: 'Peter\'s precision and attention to detail ensure every garment meets our exacting standards.',
  },
  {
    name: 'Anna Mbeki',
    role: 'Customer Relations',
    image: '/images/malipula/team4.jpg',
    bio: 'Anna ensures every client receives personalized attention and leaves with a smile.',
  },
];

const milestones = [
  { year: '2015', title: 'Founded', description: 'Malipula Suits was established in Dar es Salaam' },
  { year: '2017', title: 'First Showroom', description: 'Opened our flagship store in Sinza' },
  { year: '2019', title: '500+ Customers', description: 'Reached 500 satisfied customers milestone' },
  { year: '2021', title: 'Online Launch', description: 'Launched our e-commerce platform' },
  { year: '2023', title: 'Team Growth', description: 'Expanded to 15+ skilled artisans' },
  { year: '2025', title: 'EAGMA Award', description: 'Won Award-Winning Stylist at EAGMA 2025' },
];

const values = [
  {
    icon: Crown,
    title: 'Royal Quality',
    description: 'We use only the finest fabrics and materials, ensuring every piece meets royal standards.',
  },
  {
    icon: Heart,
    title: 'African Heritage',
    description: 'We celebrate our roots by incorporating African designs and patterns into modern tailoring.',
  },
  {
    icon: Scissors,
    title: 'Expert Craftsmanship',
    description: 'Our artisans have decades of combined experience in traditional and modern tailoring.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Every client receives personalized attention and custom-fitted garments.',
  },
];

const stats = [
  { label: 'Years Experience', value: '10+' },
  { label: 'Happy Customers', value: '5,000+' },
  { label: 'Custom Designs', value: '15,000+' },
  { label: 'Team Members', value: '15+' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-charcoal to-charcoal" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Our Story
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              About <span className="text-gold-gradient">Malipula</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Where craftsmanship meets elegance, and tradition blends seamlessly with modern style. 
              We take pride in creating exceptional wardrobes for the discerning gentleman.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/malipula/about.jpg"
                  alt="Malipula Story"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-gold text-charcoal p-6 rounded-2xl shadow-xl"
              >
                <Award className="w-8 h-8 mb-2" />
                <div className="text-sm font-medium">EAGMA 2025</div>
                <div className="text-xs">Award Winner</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">Our Journey</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Crafting <span className="text-gold-gradient">Excellence</span> Since 2015
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Welcome to Malipula Suits, where craftsmanship meets elegance, and tradition blends 
                seamlessly with modern style. As a visionary tailor and fashion designer based in 
                the vibrant city of Dar es Salaam, Tanzania, we take pride in creating exceptional 
                wardrobes for the discerning working class.
              </p>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Every garment we create is a labor of love, a testament to our dedication to the 
                art of tailoring. Our team of skilled artisans, with years of experience in the 
                world of fashion, pour their heart and soul into every stitch, ensuring that each 
                piece is a masterpiece.
              </p>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                From the initial consultation to the final fitting, we work closely with our 
                clients to understand their needs, preferences, and style. We believe that every 
                individual deserves to look and feel their best, and we&apos;re committed to making 
                that a reality.
              </p>

              <div className="flex gap-4">
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  Our Awards
                </Button>
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-charcoal">
                  Meet the Team
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-gold/10 bg-gradient-to-br from-navy to-charcoal">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed">
                    To provide exceptional custom tailoring services that blend traditional 
                    craftsmanship with modern style, creating garments that empower our clients 
                    to present their best selves to the world.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-gold/10 bg-gradient-to-br from-gold/10 to-gold/5">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mb-6">
                    <Eye className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become East Africa&apos;s premier destination for bespoke tailoring, 
                    renowned for our commitment to quality, innovation, and customer satisfaction, 
                    while celebrating our African heritage.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">What We Stand For</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Core <span className="text-gold-gradient">Values</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-gold/30 transition-shadow"
                >
                  <value.icon className="w-8 h-8 text-charcoal" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">Our Journey</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Key <span className="text-gold-gradient">Milestones</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold/30 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block p-6 rounded-2xl bg-white/5 ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} max-w-md`}>
                      <div className="text-gold font-bold text-2xl mb-2">{milestone.year}</div>
                      <h3 className="text-white font-semibold text-lg mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-gold rounded-full shadow-lg shadow-gold/50 hidden md:block" />

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">The Experts</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet Our <span className="text-gold-gradient">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The skilled artisans behind every masterpiece at Malipula Suits.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-gold text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-navy via-charcoal to-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white mb-6"
            >
              Ready to Experience <span className="text-gold-gradient">Excellence?</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8"
            >
              Book a consultation with our master tailors and discover the Malipula difference.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-lg px-10 py-7">
                Book Appointment
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-charcoal font-semibold text-lg px-10 py-7">
                View Collection
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
