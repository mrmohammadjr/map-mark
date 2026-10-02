import MapView from "@/components/map/MapView";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="h-dvh w-screen">
      {/* <Header /> */}
      <MapView />
    </main>
  );
}