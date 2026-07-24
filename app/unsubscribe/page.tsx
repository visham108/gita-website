import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import UnsubscribeForm from "@/components/UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  // Nothing to gain from indexing a page that only makes sense from an email.
  robots: { index: false, follow: false },
};

export default async function Unsubscribe({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <PolicyPage title="Unsubscribe" updated="July 2026">
      <UnsubscribeForm id={id ?? ""} />
    </PolicyPage>
  );
}
