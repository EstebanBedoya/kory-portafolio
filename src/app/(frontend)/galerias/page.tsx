import { redirect } from "next/navigation";
import { GALERIAS } from "@/lib/menu";

export default function GaleriasPage() {
  redirect(`/galerias/${GALERIAS[0].id}`);
}
