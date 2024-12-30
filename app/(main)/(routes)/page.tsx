import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

//This page is Equivalent to our local 3000
export default function Home() {
  const state = true;
  return (
    <div >
        <p className="text-3xl font-bold text-indigo-500">Hello Discord Clone</p>  
        <Button className={cn(
          "bg-indigo-50",
          state && "bg-red-500"
        )}>Click me</Button>
   </div>
  );
}