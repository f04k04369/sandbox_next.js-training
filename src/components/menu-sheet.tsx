
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MenuSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"ghost"} size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー情報</SheetTitle>
          <SheetDescription>
            ユーザー情報とメニュー情報を表示  
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
