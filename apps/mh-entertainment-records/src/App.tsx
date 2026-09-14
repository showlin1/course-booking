import Header from './components/Header';
import Hero from './components/Hero';
import ChannelStrip from './components/ChannelStrip';
import Maison from './components/Maison';
import Expertises from './components/Expertises';
import GlobalPower from './components/GlobalPower';
import SubmitProject from './components/SubmitProject';
import RadioTV from './components/RadioTV';
import GlobalVision from './components/GlobalVision';
import News from './components/News';
import Partners from './components/Partners';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <ChannelStrip />
      <Maison />
      <Expertises />
      <GlobalPower />
      <SubmitProject />
      <RadioTV />
      <GlobalVision />
      <News />
      <Partners />
      <CTA />
      <Footer />
    </div>
  );
}
