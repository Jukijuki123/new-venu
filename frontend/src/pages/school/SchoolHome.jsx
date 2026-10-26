import SchoolNavbar from "../../components/layout/SchoolNavbar";
import SchoolHero from "../../components/school/SchoolHero";
import SchoolCtaBanner from "../../components/school/SchoolCtaBanner";

import StatsBar from "../../components/common/StatsBar";
import AiAssistantIntro from "../../components/common/AiAssistantIntro";
import NearbyEvents from "../../components/common/NearbyEvents";
import AnalyticsShowcase from "../../components/common/AnalyticsShowcase";
import Footer from "../../components/layout/Footer";

import { useNearbyEvents } from "../../features/event-discovery/useNearbyEvents";
import { useAvailableUmkms } from "../../features/umkm/useAvailableUmkms";
import AvailableUmkm from "../../components/umkm/AvailableUmkm";

export default function SchoolHome() {
  const { umkms, isLoading } = useAvailableUmkms(3);

  return (
    <div className="min-h-screen bg-surface">
      <SchoolNavbar />

      <main>
        <SchoolHero />

        <StatsBar />

        <AiAssistantIntro
          description="Disini aku akan membantu kamu menemukan UMKM yang sesuai dengan kebutuhan event sekolahmu."
          buttonText="Cari UMKM"
          targetPath="/school/ai-match"
        />

        <AvailableUmkm umkms={umkms} isLoading={isLoading} />

        <SchoolCtaBanner />

        <AnalyticsShowcase
          description="Fitur ini membantu pihak sekolah menganalisis performa event dan kolaborasi UMKM secara otomatis."
          benefits={[
            "Mempermudah sekolah dalam menganalisis event.",
            "Menampilkan insight berdasarkan performa event.",
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
