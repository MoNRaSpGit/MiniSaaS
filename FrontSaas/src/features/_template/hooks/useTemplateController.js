import { useOrderFlow } from "../../../shared/commerce/orderFlow";

function getDateLabel() {
  return new Date().toLocaleString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function useTemplateController() {
  const commerce = useOrderFlow({ getDateLabel });
  return { commerce };
}
