import { Wind } from "lucide-react";
import { Button } from "./components/ui/button";
import { NavItem } from "./components/ui/nav-item";

export default function App() {
  return (
    <div>
      <Button size={"lg"} variant="outline">
        Click Me
      </Button>
      <NavItem href="/*" icon={Wind}>
        Home
      </NavItem>
    </div >
  );
}