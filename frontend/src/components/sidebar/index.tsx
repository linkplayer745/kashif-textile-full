import { cn } from "@/utils/cn";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  IoIosArrowForward,
  IoIosArrowUp,
  IoIosArrowDown,
} from "react-icons/io";
// Define the sidebar item structure
const sidebarData = [
  {
    title: "SUMMER TRACKSUITS",
    path: "/category/8",
    submenu: [
      { title: "Lightweight Tracksuits", path: "/lightweight-tracksuits" },
      { title: "Breathable Fabrics", path: "/breathable-fabrics" },
      { title: "Athletic Fit", path: "/athletic-fit" },
      { title: "Casual Wear", path: "/casual-wear" },
    ],
  },
  {
    title: "Polo Shirts",
    path: "/category/1",
    submenu: [
      { title: "Printed Shirts", path: "/printed-shirts" },
      { title: "Textured Shirts", path: "/textured-shirts" },
      { title: "Designer Shirts", path: "/designer-shirts" },
      { title: "Plain Shirts", path: "/plain-shirts" },
    ],
  },

  {
    title: "KIDS COLLECTION",
    path: "/category/7",
    submenu: [],
  },
  { title: "TROUSERES & SHORTS", path: "/category/3", submenu: [] },
];

// Additional links shown at the bottom of sidebar
const additionalLinks = [
  { title: "Made To Measure", path: "#" },
  { title: "Order Tracking", path: "#" },
  { title: "Shipping Policy", path: "#" },
  { title: "Wishlist", path: "/wishlist" },
];

export default function MultilevelSidebar({
  isOpen,
  onClose,
}: Readonly<{ isOpen: boolean; onClose: () => void }>) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<number>(0);
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleMouseEnter = (
    index: number,
    e: React.MouseEvent<HTMLLIElement>,
  ) => {
    if (!isMobile) {
      const rect = e.currentTarget.getBoundingClientRect();
      // Calculate top relative to parent container
      setSubmenuPosition(rect.top);
      setActiveSubmenu(index);
    }
  };

  const handleWrapperLeave = () => {
    if (!isMobile) setActiveSubmenu(null);
  };

  const toggleSubmenu = (index: number) => {
    if (isMobile)
      setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleBack = () => {
    setActiveSubmenu(null);
    onClose();
  };

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
        <div className="relative flex h-full" onMouseLeave={handleWrapperLeave}>
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
                    key={idx}
                    onMouseEnter={(e) => handleMouseEnter(idx, e)}
                    className="relative"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between px-4 py-3"
                      onClick={() => toggleSubmenu(idx)}
                    >
                      <Link
                        onClick={handleBack}
                        href={item.path}
                        className="block text-sm font-medium"
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
                    {isMobile && expandedMenus[idx] && (
                      <div className="bg-gray-50 pl-8">
                        <ul className="py-2">
                          {item.submenu.map((sub, subIdx) => (
                            <li key={subIdx}>
                              <Link
                                // href={sub.path}
                                href={"#"}
                                className="block px-4 py-2 text-sm"
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
          {!isMobile &&
            activeSubmenu !== null &&
            sidebarData[activeSubmenu].submenu.length > 0 && (
              <div
                className="absolute left-64 z-[1000] w-64 overflow-y-auto bg-white shadow-lg transition-all duration-300"
                style={{ top: submenuPosition }}
              >
                <ul className="py-2">
                  {sidebarData[activeSubmenu].submenu.map((sub, i) => (
                    <li key={i} className="px-4 py-2">
                      <Link
                        href={"#"}
                        className="group relative block w-fit text-sm"
                      >
                        {sub.title}
                        <span className="border-red absolute -bottom-1 left-0 w-0 transform border-b-2 duration-300 ease-in group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
