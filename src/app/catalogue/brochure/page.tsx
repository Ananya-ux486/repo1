import { redirect } from "next/navigation";

// Redirect to the standalone full-page brochure (no header/footer)
export default function BrochureRedirect() {
  redirect("/brochure");
}
