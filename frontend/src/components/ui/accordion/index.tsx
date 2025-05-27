"use client";

import { cn } from "@/utils/cn";

type AccordionpProps = {
  children: React.ReactNode;
  title: string;
  id: string;
  active: boolean;
  onToggle: () => void;
};

export default function Accordion({
  children,
  title,
  id,
  active = false,
  onToggle,
}: AccordionpProps) {
  return (
    <div
      className={cn(
        "border-1 border-black/10 lg:px-0",
        // !active ? "pb-4 lg:pb-[18px]" : "pb-[18px]",
      )}
    >
      <h2>
        <button
          className="flex w-full cursor-pointer items-baseline justify-between bg-black/5 py-[14px] pr-[20px] pl-7 text-left duration-300 focus:outline-none"
          onClick={() => {
            onToggle();
          }}
          id={`accordion-title-${id}`}
          aria-expanded={active}
          aria-controls={`accordion-text-${id}`}
        >
          <span className="text-chinese-black hover:text-red w-fit text-sm font-semibold duration-300">
            {title}
          </span>

          {/* <span
            className={cn(
              "transform transition-transform duration-300 ease-in-out",
            )}
          >
            {active ? (
              <FaMinus className="text-pink size-5" />
            ) : (
              <FaPlus className="text-pink size-5" />
            )}
          </span> */}
        </button>
      </h2>
      <div
        id={`accordion-text-${id}`}
        role="region"
        aria-labelledby={`accordion-title-${id}`}
        className={cn(
          "grid overflow-hidden px-4 text-sm font-light transition-all duration-300 ease-in-out sm:text-base lg:text-xl lg:leading-6",
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        {/* <div className="overflow-hidden"> */}
        <div className="w-full overflow-hidden lg:text-base">{children}</div>
        {/* </div> */}
      </div>
    </div>
  );
}
