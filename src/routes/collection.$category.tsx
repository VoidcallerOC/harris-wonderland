import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { AnimalBrowser, categoryFromSlug } from "@/components/animal-browser";
import { AnimalCollectionIntro } from "@/components/animal-collection-intro";
import { MammalsSection } from "@/components/mammals-section";

export const Route = createFileRoute("/collection/$category")({
  component: CategoryCollectionPage,
  loader: ({ params }) => {
    const category = categoryFromSlug(params.category);
    if (!category) throw notFound();
    return category;
  },
  head: ({ loaderData }) =>
    pageHead({
      title: `${loaderData?.name ?? "Animal category"} — Harris in Wonderland`,
      description:
        loaderData?.description ?? "Browse available animals at Harris in Wonderland in Canton, Connecticut.",
      path: `/collection/${loaderData?.slug ?? ""}`,
    }),
});

function CategoryCollectionPage() {
  const { category: categorySlug } = Route.useParams();
  if (categorySlug === "mammals" || categorySlug === "sugar-gliders") {
    return <MammalsSection sugarGlidersOnly={categorySlug === "sugar-gliders"} />;
  }
  return (
    <>
      <AnimalCollectionIntro />
      <AnimalBrowser selectedSlug={categorySlug} />
    </>
  );
}
