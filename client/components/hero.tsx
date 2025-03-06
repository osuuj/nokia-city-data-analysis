import ButtonStart from "@/components/button";

export default function Hero() {
  return (
    <div className="relative h-[calc(100vh-28rem)] w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 top-0 h-full w-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute left-0 top-0 h-full w-full bg-black/40"></div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="inline-block max-w-xl justify-center text-center">
          <span className="text-4xl font-bold">Find&nbsp;</span>
          <span className="text-4xl font-bold text-violet-500">
            Companies in Finland&nbsp;
          </span>
          <br />
          <span className="text-4xl font-bold">Close to You.</span>
          <div className="mt-4 text-lg">
            We built this platform to showcase our skills and abilities. Without
            industry experience, it's challenging to get opportunities—so we
            created this project to prove our expertise in real-world
            applications.
          </div>
          <div className="mt-8">
            <ButtonStart />
          </div>
        </div>
      </div>
    </div>
  );
}
