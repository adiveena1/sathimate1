import { Footer } from "@/components/layout/Footer";
import { PremiumHeader } from "@/components/premium/PremiumHeader";
import { TelegramWidget } from "@/components/shared/TelegramWidget";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PremiumHeader />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <TelegramWidget />
    </div>
  );
}
