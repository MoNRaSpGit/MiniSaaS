import { useEffect, useState } from "react";
import { ORDER_STATUS, useOrderFlow } from "../../../shared/commerce/orderFlow";
import { useUxMode } from "../../../shared/ux/useUxMode";
import {
  CAFETERIA_UX_PROFILES,
  getProjectUxProfile
} from "../../../shared/ux/projectUxProfiles";
import { FEATURED_PRODUCTS } from "../data/menuCatalog";

function getDateLabel() {
  return new Date().toLocaleString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function useCafeteriaController() {
  const [activeTab, setActiveTab] = useState("menu");
  const [slideIndex, setSlideIndex] = useState(0);
  const { activeMode, cycleMode } = useUxMode({ initialModeId: "modern" });
  const uxProfile = getProjectUxProfile(CAFETERIA_UX_PROFILES, activeMode.id);

  const commerce = useOrderFlow({ getDateLabel });

  useEffect(() => {
    if (!uxProfile.showCarousel) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % FEATURED_PRODUCTS.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [uxProfile.showCarousel]);

  const goPrevSlide = () => {
    setSlideIndex((prev) => (prev === 0 ? FEATURED_PRODUCTS.length - 1 : prev - 1));
  };

  const goNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % FEATURED_PRODUCTS.length);
  };

  const goToSlide = (index) => {
    setSlideIndex(index);
  };

  const handleConfirmOrder = () => {
    const order = commerce.confirmOrder();
    if (order) {
      setActiveTab("orders");
    }
  };

  return {
    activeTab,
    setActiveTab,
    slideIndex,
    activeMode,
    cycleMode,
    uxProfile,
    commerce,
    actions: {
      goPrevSlide,
      goNextSlide,
      goToSlide,
      handleConfirmOrder,
      setActiveTab
    },
    constants: {
      ORDER_STATUS
    }
  };
}
