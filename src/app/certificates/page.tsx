import dynamic from "next/dynamic";

const CertificatesPageContent = dynamic(
  () => import("@/components/CertificatesPageContent"),
  {
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center py-10 text-sm text-muted">
        Loading certificates…
      </div>
    ),
  },
);

export const metadata = {
  title: "Certificates | TasmaFive Solutions",
  description:
    "TasmaFive Solutions is DPIIT-recognised, ISO 9001:2015 certified, GST registered, and MSME listed — certified proof of quality and compliance.",
};

export default function CertificatesPage() {
  return <CertificatesPageContent />;
}
