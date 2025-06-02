import { cn } from "@/utils/cn";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IoIosArrowForward,
  IoIosArrowUp,
  IoIosArrowDown,
} from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/slices/categorySlice";

// Additional links shown at the bottom of sidebar
const additionalLinks = [
  { title: "Made To Measure", path: "#" },
  { title: "Order Tracking", path: "#" },
  { title: "Shipping Policy", path: "#" },
  { title: "Wishlist", path: "/wishlist" },
];

// Transform category data to match sidebar structure
const transformCategoryToSidebarItem = (category: any) => ({
  title: category.name,
  path: `/category/${category.slug}`,
  submenu: category.subcategories || [], // If your API returns subcategories
});

export default function MultilevelSidebar({
  isOpen,
  onClose,
}: Readonly<{ isOpen: boolean; onClose: () => void }>) {
  const dispatch = useAppDispatch();
  const { categories, isLoading } = useAppSelector((state) => state.category);

  const [isMobile, setIsMobile] = useState(false);
  // const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  // const [submenuPosition, setSubmenuPosition] = useState<number>(0);
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>(
    {},
  );

  // Transform categories to sidebar data format
  const sidebarData = categories.map(transformCategoryToSidebarItem);

  useEffect(() => {
    // Fetch categories if not already loaded
    if (categories.length === 0 && !isLoading) {
      dispatch(fetchCategories(6)); // Fetch all categories for sidebar
    }
  }, [dispatch, categories.length, isLoading]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // const handleMouseEnter = (
  //   index: number,
  //   e: React.MouseEvent<HTMLLIElement>,
  // ) => {
  //   if (!isMobile) {
  //     const rect = e.currentTarget.getBoundingClientRect();
  //     // Calculate top relative to parent container
  //     setSubmenuPosition(rect.top);
  //     setActiveSubmenu(index);
  //   }
  // };

  // const handleWrapperLeave = () => {
  //   if (!isMobile) setActiveSubmenu(null);
  // };

  const toggleSubmenu = (index: number) => {
    if (isMobile)
      setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleBack = () => {
    // setActiveSubmenu(null);
    onClose();
  };

  // Show loading state if categories are being fetched
  if (isLoading && categories.length === 0) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 z-[998] bg-black opacity-50"
            onClick={handleBack}
          />
        )}
        <div
          className={cn(
            "fixed top-0 left-0 z-[999] flex h-full min-h-screen transition-transform duration-500",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="w-64 bg-white text-gray-900 shadow-lg">
            <button
              onClick={handleBack}
              className="flex items-center p-4 hover:text-gray-600"
            >
              <IoIosArrowForward className="mr-2 h-5 w-5 rotate-180 transform" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-gray-500">Loading categories...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black opacity-50"
          onClick={handleBack}
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 z-[999] flex h-full min-h-screen transition-transform duration-500",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* wrapper for hover region */}
        <div
          className="relative flex h-full"
          // onMouseLeave={handleWrapperLeave}
        >
          {/* Sidebar (scrollable) */}
          <div className="w-64 overflow-y-auto bg-white text-gray-900 shadow-lg">
            <button
              onClick={handleBack}
              className="flex items-center p-4 hover:text-gray-600"
            >
              <IoIosArrowForward className="mr-2 h-5 w-5 rotate-180 transform" />
              <span className="font-medium">Back</span>
            </button>
            <nav className="mt-2">
              <ul>
                {sidebarData.map((item, idx) => (
                  <li
                    key={`${item.title}-${idx}`}
                    // onMouseEnter={(e) => handleMouseEnter(idx, e)}
                    className="relative"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between px-4 py-3"
                      onClick={() => toggleSubmenu(idx)}
                    >
                      <Link
                        onClick={handleBack}
                        href={item.path}
                        className="block text-sm font-medium capitalize"
                      >
                        {item.title}
                      </Link>
                      {item.submenu.length > 0 &&
                        (isMobile ? (
                          expandedMenus[idx] ? (
                            <IoIosArrowUp className="h-4 w-4" />
                          ) : (
                            <IoIosArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <IoIosArrowForward className="h-4 w-4" />
                        ))}
                    </div>
                    {/* {isMobile && expandedMenus[idx] && (
                      <div className="bg-gray-50 pl-8">
                        <ul className="py-2">
                          {item.submenu.map((sub: any, subIdx: number) => (
                            <li key={subIdx}>
                              <Link
                                href={sub.path || "#"}
                                className="block px-4 py-2 text-sm"
                                onClick={handleBack}
                              >
                                {sub.title || sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )} */}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 border-t border-gray-200">
              <ul className="py-2">
                {additionalLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      onClick={handleBack}
                      href={link.path}
                      className="block px-4 py-2 text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop submenu outside scroll */}
          {/* {!isMobile &&
            activeSubmenu !== null &&
            sidebarData[activeSubmenu]?.submenu.length > 0 && (
              <div
                className="absolute left-64 z-[1000] w-64 overflow-y-auto bg-white shadow-lg transition-all duration-300"
                style={{ top: submenuPosition }}
              >
                <ul className="py-2">
                  {sidebarData[activeSubmenu].submenu.map(
                    (sub: any, i: number) => (
                      <li key={i} className="px-4 py-2">
                        <Link
                          href={sub.path || "#"}
                          className="group relative block w-fit text-sm"
                          onClick={handleBack}
                        >
                          {sub.title || sub.name}
                          <span className="border-red absolute -bottom-1 left-0 w-0 transform border-b-2 duration-300 ease-in group-hover:w-full" />
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )} */}
        </div>
      </div>
    </>
  );
}
