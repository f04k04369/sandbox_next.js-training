import { ReactNode } from "react";
import { Button } from "./ui/button";
import TextToggleButton from "./text-toggle-button";

interface SectionProps {
  children: ReactNode;
  title: string;
}

export default function Section({ children, title }: SectionProps) {
  return (
    <section>
        <div className="flex items-center justify-between py-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <TextToggleButton />
        </div>
        {children}
    </section>
  )
}