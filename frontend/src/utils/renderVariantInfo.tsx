const renderVariantInfo = (variants: Record<string, string>) => {
  return Object.entries(variants).map(([variantType, value]) => {
    if (!value) return null;

    const displayName =
      variantType.charAt(0).toUpperCase() + variantType.slice(1);
    return (
      <p key={variantType} className="py-0.5 text-xs text-gray-600">
        {displayName}: {value}
      </p>
    );
  });
};

export default renderVariantInfo;
