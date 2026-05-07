import type { MetadataRoute } from "next";
import { adminDb } from "@/lib/firebase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const storesSnap = await adminDb
    .collection("stores")
    .where("isActive", "==", true)
    .get();

  return storesSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      url: `${baseUrl}/${data.slug}`,
      lastModified: data.updatedAt?.toDate() ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });
}
