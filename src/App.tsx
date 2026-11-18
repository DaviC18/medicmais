import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFab from '@/components/layout/WhatsAppFab'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Services from '@/sections/Services'
import Team from '@/sections/Team'
import Clinic from '@/sections/Clinic'
import Testimonials from '@/sections/Testimonials'
import Stats from '@/sections/Stats'
import FAQ from '@/sections/FAQ'
import Contact from '@/sections/Contact'
import { clinica } from '@/data/clinica'

// Ordem das seções: docs/SPEC.md §3.
export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
      >
        {clinica.ui.skipLink}
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Services />
        <Team />
        <Clinic />
        <Testimonials />
        {/* Seção opcional: só com dado real (clinica.numeros) */}
        {clinica.numeros.length > 0 && <Stats />}
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
