"use client";

import * as React from "react";
import { CalendarIcon, ResetIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const today = new Date();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <div className="border-b border-border p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Select range</h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => onChange?.(undefined)}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  <ResetIcon className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button
                  onClick={() => onChange?.({ from: today, to: today })}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  Today
                </Button>
              </div>
            </div>
          </div>
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={value?.from || today}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            className="p-3"
            classNames={{
              nav_button: "h-8 w-8",
              table: "w-full border-collapse space-y-1",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              ),
              selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              today: "bg-accent text-accent-foreground",
              outside:
                "text-muted-foreground/30 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              disabled: "text-muted-foreground opacity-50",
              range_start: "rounded-l-md bg-primary text-primary-foreground",
              range_end: "rounded-r-md bg-primary text-primary-foreground",
              range_middle: cn(
                "rounded-none",
                "aria-selected:bg-accent aria-selected:text-accent-foreground"
              ),
              hidden: "invisible",
            }}
            components={{
              PreviousMonthButton: (props) => (
                <Button
                  {...props}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              ),
              NextMonthButton: (props) => (
                <Button
                  {...props}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
