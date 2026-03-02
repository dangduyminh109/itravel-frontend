import { useEffect, useState } from "react";

export default function useOtpCooldown(key: string, time: number = 180) {
  const [otpCooldown, setOtpCooldown] = useState(0);

  useEffect(() => {
    const lastSent = localStorage.getItem(key);
    if (lastSent) {
      const diff = 180 - Math.floor((Date.now() - Number(lastSent)) / 1000);
      if (diff > 0) setOtpCooldown(diff);
    }
  }, []);

  useEffect(() => {
    if (otpCooldown <= 0) return;

    const timer = setInterval(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpCooldown]);

  const start = () => {
    localStorage.setItem(key, Date.now().toString());
    setOtpCooldown(time);
  };

    const clear = () => {
      localStorage.removeItem(key);
      setOtpCooldown(0);
    };

  return { otpCooldown, start, clear };
}
