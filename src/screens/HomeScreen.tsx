import { Button } from "../components/Button";
import { PwaInstallBanner } from "../components/PwaInstallBanner";
import type { PwaInstallState } from "../hooks/usePwaInstall";
import type { ScreenId } from "../types";

export interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onStartTraining?: () => void;
  pwaInstall: PwaInstallState;
}

export function HomeScreen({ onNavigate, onStartTraining, pwaInstall }: HomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen p-8">
      <PwaInstallBanner pwa={pwaInstall} />
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="font-display text-[3.5rem] md:text-[5rem] tracking-tight leading-[1.1] mb-4">
          MUAY
          <br />
          THAI
          <br />
          <span className="text-brand-primary drop-shadow-[0_0_10px_rgba(255,143,115,0.4)] text-[2.75rem] md:text-[3.75rem] block mt-1">
            BAG TRAINER
          </span>
        </h1>
        <p className="font-body text-brand-outline text-[1.2rem] mb-[2.75rem]">
          Structured rounds for heavy-bag training
        </p>
      </div>

      <div className="flex flex-col gap-[1.4rem] mt-auto">
        <Button
          variant="primary"
          onClick={() =>
            onStartTraining ? onStartTraining() : onNavigate("active")
          }
        >
          Start Training
        </Button>
        <Button variant="secondary" onClick={() => onNavigate("settings")}>
          App Settings
        </Button>
      </div>
    </div>
  );
}
