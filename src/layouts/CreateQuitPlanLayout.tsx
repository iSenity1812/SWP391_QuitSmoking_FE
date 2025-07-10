import { QuitPlanProvider } from "@/context/QuitPlanContext";
import CreateQuitPlanStep1 from "@/pages/plan/quitPlan/createPlan/CreateQuitPlanStep1";
import CreateQuitPlanStep2 from "@/pages/plan/quitPlan/createPlan/CreateQuitPlanStep2";
import CreateQuitPlanStep3 from "@/pages/plan/quitPlan/createPlan/CreateQuitPlanStep3";
import CreateQuitPlanStep4 from "@/pages/plan/quitPlan/createPlan/CreateQuitPlanStep4";

import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CreateQuitPlanLayout() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)

  const goToNext = () => setStep((prev) => Math.min(prev + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6)
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1) as 1 | 2 | 3 | 4 | 5 | 6)

  return (
    <QuitPlanProvider>
      {step === 1 && <CreateQuitPlanStep1 onNext={goToNext} />}
      {step === 2 && <CreateQuitPlanStep2 onNext={goToNext} onBack={goBack} />}
      {step === 3 && <CreateQuitPlanStep3 onNext={goToNext} onBack={goBack} />}
      {step === 4 && <CreateQuitPlanStep4 onNext={goToNext} onBack={goBack} />}
      {step === 5 && <Navigate to="/plan" />}
    </QuitPlanProvider>
  );
}