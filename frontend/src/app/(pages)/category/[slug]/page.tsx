"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/product-card";
import Pagination from "@/components/pagination";
import ProductFilters from "@/components/product-filters";
import { Product } from "@/types";
import api from "@/utils/axiosInstance";

export default function ProductCategoryPage() {
  const params = useParams();
  // const categories = useAppSelector((state) => state.category.categories);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  // const [selectedCategoryId, setSelectedCategoryId] = useState(
  //   typeof params.slug === "string" ? params.slug : "all"
  // );

  useEffect(() => {
    fetchProducts();
  }, [currentPage, limit, searchTerm]);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/${params.slug}`, {
        params: {
          page: currentPage,
          limit,
          searchTerm,
        },
      });

      setProducts(res.data.results);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotalResults(res.data.totalResults);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setCurrentPage(1);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  const slug = params?.slug as string;
  // const categoryTitle = categories.find((cat) => cat.id === selectedCategoryId)?.name;
  const title = slug?.replace("-", " ") || "Products";

  if (products.length === 0 && isLoaded) {
    return (
      <h2 className="text-dark-grey mt-10 text-center text-xl lg:text-2xl">
        No products found
      </h2>
    );
  }
  return (
    <div className="main-padding mt-20">
      {products.length > 0 && (
        <h2 className="main-heading capitalize">{title}</h2>
      )}

      <ProductFilters
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onClearFilters={handleClearFilters}
        currentSearch={searchTerm}
        // currentCategoryId={selectedCategoryId}
      />

      <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:mt-7 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-8">
        {products.map((product) => (
          <div key={product.id} className="h-[30vh] sm:h-[80vh]">
            <ProductCard
              id={product.id}
              frontImage={product.images[0]}
              backImage={product.images[1]}
              title={product.name}
              sizes={product.variants.sizes}
              slug={product.slug}
              fits={product.variants.fits}
              colors={product.variants.colors}
              description={product.description}
              discountedPrice={product.discountedPrice}
              price={product.price}
            />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          limit={limit}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}
