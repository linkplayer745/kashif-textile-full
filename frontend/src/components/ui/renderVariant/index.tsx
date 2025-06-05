// import { VariantOption } from "@/types";
// import { cn } from "./cn";

// type AlignmentType = "start" | "center" | "end";

// export const renderVariant = ({
//   variantType,
//   options,
//   selectedVariants,
//   handleVariantSelect,
//   headingAlign = "start",
//   buttonsAlign = "start",
// }: {
//   variantType: string;
//   options: VariantOption[];
//   selectedVariants: Record<string, string>;
//   handleVariantSelect: (variantType: string, optionName: string) => void;
//   headingAlign?: AlignmentType;
//   buttonsAlign?: AlignmentType;
// }) => {
//   const selectedValue = selectedVariants[variantType] || "";
//   const variantTypeDisplay =
//     variantType.charAt(0).toUpperCase() + variantType.slice(1);

//   // Helper function to get alignment classes
//   const getAlignmentClass = (align: AlignmentType) => {
//     switch (align) {
//       case "center":
//         return "justify-center text-center";
//       case "end":
//         return "justify-end text-right";
//       default:
//         return "justify-start text-left";
//     }
//   };

//   const getFlexAlignmentClass = (align: AlignmentType) => {
//     switch (align) {
//       case "center":
//         return "justify-center";
//       case "end":
//         return "justify-end";
//       default:
//         return "justify-start";
//     }
//   };

//   // Special rendering for color variants
//   if (
//     variantType.toLowerCase() === "colors" ||
//     variantType.toLowerCase() === "color"
//   ) {
//     return (
//       <div className="mb-4" key={variantType}>
//         <div className={cn("flex", getAlignmentClass(headingAlign))}>
//           <p className="font-medium">
//             Select {variantTypeDisplay}:{" "}
//             <span className="font-normal">{selectedValue}</span>
//           </p>
//         </div>
//         <div
//           className={cn(
//             "my-2 flex items-start space-x-2",
//             getFlexAlignmentClass(buttonsAlign),
//           )}
//         >
//           {options.map((option, index) => (
//             <button
//               className="rounded-t outline"
//               aria-label={`Select ${option.name} ${variantType}`}
//               onClick={() => handleVariantSelect(variantType, option.name)}
//               key={index}
//             >
//               <div
//                 className="h-9 w-14 rounded-t"
//                 style={{
//                   backgroundColor: option.code || option.name.toLowerCase(),
//                 }}
//               />
//               <div
//                 className={cn(
//                   "w-14 border-t py-2 text-[12px] font-medium",
//                   selectedValue === option.name
//                     ? "bg-gold text-white"
//                     : "bg-white text-black",
//                 )}
//               >
//                 {option.name}
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Special rendering for size variants (circular buttons)
//   if (
//     variantType.toLowerCase() === "sizes" ||
//     variantType.toLowerCase() === "size"
//   ) {
//     return (
//       <div className="mb-6" key={variantType}>
//         <div className={cn("mb-2 flex", getAlignmentClass(headingAlign))}>
//           <p className="font-medium">
//             Select {variantTypeDisplay}: {selectedValue}
//           </p>
//         </div>
//         <div
//           className={cn(
//             "flex flex-wrap gap-2",
//             getFlexAlignmentClass(buttonsAlign),
//           )}
//         >
//           {options.map((option, index) => (
//             <button
//               key={index}
//               className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-2 ${
//                 selectedValue === option.name
//                   ? "border-gray-700 bg-gray-100"
//                   : "border-gray-300"
//               }`}
//               onClick={() => handleVariantSelect(variantType, option.name)}
//             >
//               {option.name}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Default rendering for other variants (rectangular buttons)
//   return (
//     <div className="my-4" key={variantType}>
//       <div className={cn("flex pb-3", getAlignmentClass(headingAlign))}>
//         <p className="font-medium">
//           Select {variantTypeDisplay}:{" "}
//           <span className="font-normal">{selectedValue}</span>
//         </p>
//       </div>
//       <div
//         className={cn(
//           "flex flex-wrap gap-2",
//           getFlexAlignmentClass(buttonsAlign),
//         )}
//       >
//         {options.map((option, index) => (
//           <button
//             key={index}
//             className={`border px-4 py-2 text-[12px] font-semibold ${
//               selectedValue === option.name
//                 ? "bg-platinum border-gray-700"
//                 : "border-gray-300"
//             } text-center`}
//             onClick={() => handleVariantSelect(variantType, option.name)}
//           >
//             {option.name.toUpperCase()}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

import { VariantOption } from "@/types";
import { cn } from "../../../utils/cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AlignmentType = "start" | "center" | "end";

export const renderVariant = ({
  variantType,
  options,
  selectedVariants,
  handleVariantSelect,
  headingAlign = "start",
  buttonsAlign = "start",
}: {
  variantType: string;
  options: VariantOption[];
  selectedVariants: Record<string, string>;
  handleVariantSelect: (variantType: string, optionName: string) => void;
  headingAlign?: AlignmentType;
  buttonsAlign?: AlignmentType;
}) => {
  const selectedValue = selectedVariants[variantType] || "";
  const variantTypeDisplay =
    variantType.charAt(0).toUpperCase() + variantType.slice(1);

  // Helper function to get alignment classes
  const getAlignmentClass = (align: AlignmentType) => {
    switch (align) {
      case "center":
        return "justify-center text-center";
      case "end":
        return "justify-end text-right";
      default:
        return "justify-start text-left";
    }
  };

  const getFlexAlignmentClass = (align: AlignmentType) => {
    switch (align) {
      case "center":
        return "justify-center";
      case "end":
        return "justify-end";
      default:
        return "justify-start";
    }
  };

  // Special rendering for color variants with visual color boxes
  if (
    variantType.toLowerCase() === "colors" ||
    variantType.toLowerCase() === "color"
  ) {
    return (
      <div className="mb-4" key={variantType}>
        <div className={cn("mb-2 flex", getAlignmentClass(headingAlign))}>
          <p className="font-medium">Select {variantTypeDisplay}:</p>
        </div>
        <div className={cn("flex", getFlexAlignmentClass(buttonsAlign))}>
          <Select
            value={selectedValue}
            onValueChange={(value) => handleVariantSelect(variantType, value)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue
                placeholder={`Select ${variantTypeDisplay.toLowerCase()}`}
              >
                {selectedValue && (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded border border-gray-300"
                      style={{
                        backgroundColor:
                          options.find((opt) => opt.name === selectedValue)
                            ?.code || selectedValue.toLowerCase(),
                      }}
                    />
                    <span>{selectedValue}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={index} value={option.name}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded border border-gray-300"
                      style={{
                        backgroundColor:
                          option.code || option.name.toLowerCase(),
                      }}
                    />
                    <span>{option.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // Default rendering for all other variants (sizes, materials, etc.)
  return (
    <div className="mb-4" key={variantType}>
      <div className={cn("mb-2 flex", getAlignmentClass(headingAlign))}>
        <p className="font-medium">Select {variantTypeDisplay}:</p>
      </div>
      <div className={cn("flex", getFlexAlignmentClass(buttonsAlign))}>
        <Select
          value={selectedValue}
          onValueChange={(value) => handleVariantSelect(variantType, value)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue
              placeholder={`Select ${variantTypeDisplay.toLowerCase()}`}
            />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option, index) => (
              <SelectItem key={index} value={option.name}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
