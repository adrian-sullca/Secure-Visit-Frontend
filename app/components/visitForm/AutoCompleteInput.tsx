import { ReactNode, useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";

export interface AutoCompleteInputProps {
  allItems: [];
  searchKey?: string;
  placeholder?: string;
  onSelect: (item) => void;
  renderItem?: (item) => ReactNode;
  value: string;
  disabled?: boolean;
  hasError?: boolean;
  onChange?: (value: string) => void;
}

export function AutoCompleteInput({
  allItems,
  searchKey = "name",
  placeholder = "Buscar...",
  onSelect,
  renderItem = (item) => item[searchKey],
  value,
  disabled = false,
  hasError,
  onChange
}: AutoCompleteInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  }

  const filteredResults =
    inputValue.length >= 2
      ? allItems.filter((item) =>
          getNestedValue(item, searchKey)
            ?.toLowerCase()
            .includes(inputValue.toLowerCase())
        )
      : [];

  useEffect(() => {
    if (
      !disabled &&
      hasInteracted &&
      filteredResults.length > 0 &&
      inputValue.length >= 2 &&
      !hasSelected
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [filteredResults, inputValue, hasSelected]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  return (
    <div className="relative w-full">
      <Command className="w-full">
        <CommandInput
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onValueChange={(value) => {
            setInputValue(value);
            setHasSelected(false);
            setHasInteracted(true);
            onChange?.(value);
          }}
          className={cn(
            "input",
            hasError &&
              "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
          )}
        />
        {open && (
          <CommandList
            className="z-20 absolute top-full left-0 right-0 bg-white shadow-md rounded-b-md max-h-60 overflow-auto"
            style={{ zIndex: 9999 }}
          >
            {filteredResults.map((item: any) => (
              <CommandItem
                key={item.id}
                value={getNestedValue(item, searchKey)}
                onSelect={() => {
                  setInputValue(getNestedValue(item, searchKey));
                  setHasSelected(true);
                  setOpen(false);
                  onSelect(item);
                }}
              >
                {renderItem(item)}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
}