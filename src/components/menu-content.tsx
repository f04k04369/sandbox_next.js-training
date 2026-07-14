"use client";
import React, { useState } from "react";
import CategorySidebar from "./category-sidebar";
import { CategoryMenu } from "@/types";
import Section from "./section";
import CarouselContainer from "./carousel-container";
import MenuCard from "./menu-card";
import FlatMenuCard from "./flat-menu-card";
import { InView } from "react-intersection-observer";

interface MenuContentProps {
  categoryMenus: CategoryMenu[];
}

export default function MenuContent({ categoryMenus }: MenuContentProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categoryMenus[0].id);
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    console.log("categoryId: ", categoryId);

    const element = document.getElementById(`${categoryId}-menu`);
    console.log("element: ", element);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-4">
      <CategorySidebar
        categoryMenus={categoryMenus}
        onSelectCategory={handleSelectCategory}
        activeCategoryId={activeCategoryId}
      />
      <div className="w-3/4 bg-red-500">
        {categoryMenus.map((category) => (
            <InView
              as="div"
              onChange={(inView, entry) => inView && setActiveCategoryId(category.id)}
              key={category.id}
              id={`${category.id}-menu`}
              className="scroll-mt-16"
              threshold={0.7}
  
            >
              <Section title={category.categoryName}>
                {category.id === "featured" ? (
                  <CarouselContainer slideToShow={4}>
                    {category.items.map((menu) => (
                      <MenuCard menu={menu} />
                    ))}
                  </CarouselContainer>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {category.items.map((menu) => (
                      <FlatMenuCard key={menu.id} menu={menu} />
                    ))}
                  </div>
                )}
              </Section>
            </InView>
        ))}
      </div>
    </div>
  );
}
