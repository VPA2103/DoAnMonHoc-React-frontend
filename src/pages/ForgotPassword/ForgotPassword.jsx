import { useState } from "react";
import SendOtp from "./SendOtp";
import ResetPassword from "./ResetPassword";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");


  return (
    <>
      {step === 1 && (
        <SendOtp
          email={email}
          setEmail={setEmail}
          onSuccess={() => setStep(2)}
        />
      )}

      {step === 2 && <ResetPassword email={email} onBack={() => setStep(1)} />}
    </>
  );
}
