import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { AnimalBrowser } from "@/components/animal-browser";
import { AnimalCollectionContact, AnimalCollectionIntro } from "@/components/animal-collection-intro";

export const Route = createFileRoute("/collection/")({
  component: CollectionIndexPage,
  head: () =>
    pageHead({
      title: "Available Animals — Harris in Wonderland",
      description:
        "Browse reptiles, mammals, birds, and tropical fish at Harris in Wonderland in Canton, CT. Square inventory remains the source for current availability.",
      path: "/collection",
    }),
});

function CollectionIndexPage() {
  return (
    <>
      <AnimalCollectionIntro />
      <AnimalBrowser />
      <AnimalCollectionContact />
    </>
  );
}
