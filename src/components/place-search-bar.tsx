import React from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function PlaceSearchBar() {
  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput placeholder="Type a command or search..." className="" />
      <div className="relative">
        <CommandList className="absolute bg-background w-full ">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandList>
      </div>
    </Command>
  );
}
