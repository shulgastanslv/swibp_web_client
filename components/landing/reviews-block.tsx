import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const REVIEWS = [
  {
    quote:
      "I used to spend the evening on the cover. Now the frames are already there and I only fix the wording.",
    name: "Mira",
    title: "Editor",
  },
  {
    quote:
      "We ship a launch carousel the same day the feature lands. Cover, middle, ending — then export.",
    name: "Leo",
    title: "Founder",
  },
  {
    quote:
      "The ratio switch is the part I did not expect to care about. One story, four feeds.",
    name: "Ana",
    title: "Social",
  },
  {
    quote:
      "No watermark on the download. I post the frames as they come out of the studio.",
    name: "Jonah",
    title: "Marketer",
  },
];

export function ReviewsBlock() {
  return (
    <section id="reviews" className="scroll-mt-24 py-8">
      <div className="mx-auto mb-2 max-w-6xl px-4 sm:px-6">
        <p className="text-[13px] font-bold tracking-wide text-[#2f5bff]">Reviews</p>
        <h2 className="mt-2 max-w-md text-3xl font-extrabold tracking-tight sm:text-4xl">
          From topic to post, in one sitting
        </h2>
      </div>
      <div className="mx-auto mb-2 max-w-6xl px-4 sm:px-6">

        <InfiniteMovingCards items={REVIEWS} direction="left" speed="slow" />
      </div>
    </section>
  );
}
