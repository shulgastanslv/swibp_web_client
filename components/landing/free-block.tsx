import { Check } from "lucide-react";
import { CleanArt, FormatsArt, FreeArt, SavedArt } from "@/components/landing/landing-art";

export function FreeBlock() {
  return (
    <section id="free" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-5 sm:px-6">
      <div className="mb-6 max-w-2xl sm:mb-8">
        <p className="text-[13px] font-bold tracking-wide text-[#2f5bff]">Free</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          A studio with no bill
        </h2>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-[#5c6170]">
          No plan, no trial clock, no logo on the cover. You open the studio and post.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <article className="overflow-hidden rounded-[2rem] bg-[#fff4cc] p-6 sm:rounded-[2.4rem] sm:p-8 md:col-span-7">
          <p className="text-[13px] font-bold text-[#8a7a3a]">#Free</p>
          <h3 className="mt-3 max-w-sm text-3xl font-extrabold tracking-tight sm:text-4xl">
            Open the studio and start
          </h3>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[#5c6170]">
            The topic, the canvas, and the download stay free. Nothing expires after the first carousel.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {[
              "Generate the whole carousel",
              "Edit text, photos, and order",
              "PNG and ZIP export",
              "No watermark on the frames",
              "Projects stay on your account",
              "Every ratio, same studio",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[13px] font-semibold">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#14151c] text-white">
                  <Check className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center">
            <FreeArt />
          </div>
        </article>

        <div className="grid gap-3 md:col-span-5">
          <article className="rounded-[2rem] bg-[#14151c] p-6 text-white sm:rounded-[2.4rem] sm:p-7">
            <p className="text-[13px] font-bold text-[#ffe08a]">$0</p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight">No subscription</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/70">
              There is no paid tier hiding the export. What you make is what you download.
            </p>
          </article>
          <article className="overflow-hidden rounded-[2rem] bg-[#e4ebff] p-6 sm:rounded-[2.4rem] sm:p-7">
            <p className="text-[13px] font-bold text-[#3a4f9a]">#Formats</p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Four formats to choose from for your carousel</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#5c6170]">
              One layout switches for the feed, a square, a story, or a wide frame.
            </p>
            <FormatsArt />
          </article>
        </div>

        <article className="overflow-hidden rounded-[2rem] bg-[#e5f6ea] p-6 sm:rounded-[2.4rem] sm:p-7 md:col-span-5">
          <p className="text-[13px] font-bold text-[#3d6b4f]">#Projects</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight">The carousel stays yours</h3>
          <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-[#5c6170]">
            Sign in and the slides are still there. Close the tab and come back.
          </p>
          <SavedArt />
        </article>

        <article className="overflow-hidden rounded-[2rem] bg-[#ffe4ef] p-6 sm:rounded-[2.4rem] sm:p-8 md:col-span-7">
          <div className="grid items-center gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[13px] font-bold text-[#9a4f6b]">#Export</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                PNG and ZIP, no watermark
              </h3>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[#5c6170]">
                Download the frames as they are. No studio logo on the cover.
              </p>
            </div>
            <CleanArt />
          </div>
        </article>
      </div>
    </section>
  );
}
