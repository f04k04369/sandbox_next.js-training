import React from "react";
import CategorySidebar from "./category-sidebar";
import { CategoryMenu } from "@/types";
import Section from "./section";
import CarouselContainer from "./carousel-container";
import MenuCard from "./menu-card";

interface MenuContentProps {
  categoryMenus: CategoryMenu[];
}

export default function MenuContent({ categoryMenus }: MenuContentProps) {
  return (
    <div className="flex gap-4">
      <CategorySidebar categoryMenus={categoryMenus} />
      <div className="w-3/4 bg-red-500">
        {categoryMenus.map((category) => (
          <Section key={category.id} title={category.categoryName}>
            {category.id === "featured" ? (
              <CarouselContainer slideToShow={4}>
                {category.items.map((menu) => (
                  <MenuCard menu={menu} />
                ))}
              </CarouselContainer>
            ) : (
              <div>リストメニュー</div>
            )}
          </Section>
        ))}
      </div>
    </div>
  );
}
