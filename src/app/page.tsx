"use client";

import Footer from "@/components/Footer/Footer";
import HomeHeader from "@/components/Header/HomeHeader";
import Physician from "@/components/Physician/Physician";
import { GoogleMapsProvider } from "@/context/GoogleMapsContext";
export default function Home() {
  return (
    <GoogleMapsProvider>
      <HomeHeader />
      <Physician />
      <Footer />
    </GoogleMapsProvider>
  );
}

 