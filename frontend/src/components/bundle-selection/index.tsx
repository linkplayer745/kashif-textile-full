import React, { useState, useEffect } from "react";
import { renderVariant } from "@/components/ui/renderVariant";
import { Product, VariantOption } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaBoxOpen, FaCartShopping } from "react-icons/fa6";

interface BundleSelectionProps {
  product: Product;
  onBundleAdd: (bundleItems: BundleItem[]) => void;
}

interface BundleItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  selectedVariants: Record<string, string>;
  image: string;
}

const BUNDLE_OPTIONS = [
  { size: 3, label: "Bundle of 3" },
  { size: 5, label: "Bundle of 5" },
  { size: 7, label: "Bundle of 7" },
  { size: 10, label: "Bundle of 10" },
];

export default function BundleSelection({
  product,
  onBundleAdd,
}: BundleSelectionProps) {
  const [selectedBundleSize, setSelectedBundleSize] = useState<number>(3);
  const [bundleVariants, setBundleVariants] = useState<
    Record<string, string>[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize bundle variants when bundle size changes
  useEffect(() => {
    const initialVariants: Record<string, string>[] = [];

    for (let i = 0; i < selectedBundleSize; i++) {
      const initialSelectedVariants: Record<string, string> = {};

      // Set default variants for each bundle item
      Object.keys(product.variants).forEach((variantType) => {
        if (product.variants[variantType]?.length > 0) {
          // For first item, use first option, for others use different options if available
          const options = product.variants[variantType];
          const optionIndex = i < options.length ? i : i % options.length;
          initialSelectedVariants[variantType] = options[optionIndex].name;
        }
      });

      initialVariants.push(initialSelectedVariants);
    }

    setBundleVariants(initialVariants);
  }, [selectedBundleSize, product.variants]);

  const handleBundleVariantSelect = (
    bundleIndex: number,
    variantType: string,
    optionName: string,
  ) => {
    setBundleVariants((prev) => {
      const updated = [...prev];
      updated[bundleIndex] = {
        ...updated[bundleIndex],
        [variantType]: optionName,
      };
      return updated;
    });
  };

  const calculateBundlePrice = () => {
    const basePrice = product.discountedPrice || product.price;
    return basePrice * selectedBundleSize;
  };

  const handleAddBundle = () => {
    const hasVariants = Object.keys(product.variants).some(
      (variantType) => product.variants[variantType]?.length > 0,
    );

    const bundleItems: BundleItem[] = bundleVariants.map((variants, index) => ({
      id: product.id,
      name: hasVariants
        ? `${product.name} (Bundle Item ${index + 1})`
        : product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      quantity: hasVariants ? 1 : selectedBundleSize,
      selectedVariants: variants,
      image: product.images[0],
    }));

    // If no variants, add single item with bundle quantity
    if (!hasVariants) {
      const singleBundleItem: BundleItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity: selectedBundleSize,
        selectedVariants: {},
        image: product.images[0],
      };
      onBundleAdd([singleBundleItem]);
    } else {
      onBundleAdd(bundleItems);
    }

    setIsOpen(false);
  };

  // Check if all variants are selected for all bundle items (only if variants exist)
  const hasVariants = Object.keys(product.variants).some(
    (variantType) => product.variants[variantType]?.length > 0,
  );

  const isValidBundle =
    !hasVariants ||
    (bundleVariants.length === selectedBundleSize &&
      bundleVariants.every((variants) =>
        Object.keys(product.variants).every(
          (variantType) =>
            !product.variants[variantType]?.length ||
            (variants[variantType] && variants[variantType].length > 0),
        ),
      ));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 mb-3 flex w-full items-center gap-2 py-3"
          onClick={() => setIsOpen(true)}
        >
          <FaBoxOpen className="size-4" />
          Create Bundle
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaBoxOpen className="size-5" />
            Create Your Bundle
          </DialogTitle>
          <DialogDescription>
            Select multiple items with different variants to create your custom
            bundle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bundle Size Selection */}
          <div>
            <h3 className="mb-3 font-medium">Select Bundle Size:</h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {BUNDLE_OPTIONS.map((option) => (
                <Button
                  key={option.size}
                  variant={
                    selectedBundleSize === option.size ? "default" : "outline"
                  }
                  onClick={() => setSelectedBundleSize(option.size)}
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Bundle Price Display */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Bundle Total:</span>
              <span className="text-xl font-bold">
                Rs.{calculateBundlePrice().toFixed(2)}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {selectedBundleSize} items × Rs.
              {(product.discountedPrice || product.price).toFixed(2)} each
            </div>
          </div>

          {/* Individual Bundle Item Selections */}
          {hasVariants && (
            <div>
              <h3 className="mb-4 font-medium">Configure Each Item:</h3>
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {Array.from({ length: selectedBundleSize }, (_, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <span className="text-sm text-gray-600">
                          {product.name}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 space-y-3 gap-x-3 lg:gap-x-6">
                      {Object.keys(product.variants).map((variantType) => {
                        if (!product.variants[variantType]?.length) return null;

                        return (
                          <div key={`${index}-${variantType}`}>
                            {renderVariant({
                              variantType,
                              options: product.variants[variantType],
                              selectedVariants: bundleVariants[index] || {},
                              handleVariantSelect: (
                                vType: string,
                                optionName: string,
                              ) =>
                                handleBundleVariantSelect(
                                  index,
                                  vType,
                                  optionName,
                                ),
                              headingAlign: "start",
                              buttonsAlign: "start",
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Variants Message */}
          {!hasVariants && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-12 w-12 rounded object-cover"
                />
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedBundleSize} items will be added to your cart
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBundle}
              disabled={!isValidBundle}
              className="bg-gold hover:bg-gold/90 flex-1 text-white"
            >
              <FaCartShopping className="mr-2 size-4" />
              Add Bundle to Cart (Rs.{calculateBundlePrice().toFixed(2)})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
