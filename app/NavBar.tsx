import Link from "next/link";
import { AiFillBug } from "react-icons/ai";

const NavBar = () => {
  return (
    <nav className="flex space-x-6 border-b-2 mb-5 px-5 h-14 items-center">
      <Link className="scale-150" href="/">
        <AiFillBug />
      </Link>
      <ul className="flex space-x-6">
        <li>
          <Link className="hover:text-zinc-500 transition-colors" href="/">Dashboard</Link>
        </li>
        <li>
          <Link className="hover:text-zinc-500 transition-colors" href="/issues">Issues</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
