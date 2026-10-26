import UmkmNavbar from "../../components/layout/UmkmNavbar";
import UmkmHero from "../../components/umkm/UmkmHero";
import StatsBar from "../../components/common/StatsBar";
import AiAssistantIntro from "../../components/common/AiAssistantIntro";
import AvailableUmkm from "../../components/umkm/AvailableUmkm";
import { useAvailableUmkms } from "../../features/umkm/useAvailableUmkms";
import UmkmCtaBanner from "../../components/umkm/UmkmCtaBanner";
import AnalyticsShowcase from "../../components/common/AnalyticsShowcase";
import Footer from "../../components/layout/Footer";
import NearbyEvents from "../../components/common/NearbyEvents";

export default function UmkmHome() {
    const { umkms, isLoading } = useAvailableUmkms(3);

    return (
        <div className="min-h-screen bg-surface">
            <UmkmNavbar />
            <main>
                <UmkmHero />
                <StatsBar />
                <AiAssistantIntro
                    description="Disini aku akan membantu kamu menyinkronkan usaha kamu dengan event yang sedang berlangsung."
                    buttonText="Ayo sinkronkan"
                    targetPath="/umkm/ai-match"
                />
                <UmkmCtaBanner />
                <NearbyEvents />

                <Footer />
            </main>
        </div>
    );
}
