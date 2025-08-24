"use client";

export default function FeaturedGrid({ features }) {
  return (
    <section className="flex justify-center items-center w-full bg-white pt-0 pb-8 px-2 md:px-4">
      <div className="flex flex-col md:flex-row gap-4 w-[135vw] max-w-7xl -mt-4">
        {features?.map((feature, idx) => (
          <div
            key={feature.title}
            className="relative flex-1 aspect-[1/1.65] min-h-[525px] max-h-[900px] overflow-hidden bg-gray-100"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
            <div className="absolute top-0 left-0 p-6 md:p-8 z-10 text-white max-w-[320px]">
              <h3 className="text-lg md:text-xl font-bold mb-1">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm mb-6 font-normal">
                {feature.subtitle}
              </p>
              <button className="text-xs font-semibold tracking-widest border-b-2 border-white pb-1 uppercase bg-transparent hover:opacity-80 transition">
                {feature.button}
              </button>
            </div>
            <div className="absolute inset-0 bg-black/0" />
          </div>
        ))}
      </div>
    </section>
  );
}
