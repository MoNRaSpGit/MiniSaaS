import { TemplateCatalogView } from "./components/TemplateCatalogView";
import { useTemplateController } from "./hooks/useTemplateController";

export function TemplateDemo() {
  const controller = useTemplateController();
  return <TemplateCatalogView controller={controller} />;
}
