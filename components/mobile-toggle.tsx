import { Menu } from "lucide-react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";



const MobileToggle = () => {
    return ( 
        <Sheet>
            <SheetTrigger asChild>
                {/* md:hidden makes this button show only on mobile devices */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
        </Sheet>
    );
}
 
export default MobileToggle;