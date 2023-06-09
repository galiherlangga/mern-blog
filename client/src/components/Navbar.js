import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border b-4 border-green-700 text-center fixed top-0 bg-green-600 font-bold w-full text-lg text-white">
      <div className="flex justify-between mx-auto">
        <div className="py-4 ml-20">Logo</div>
        <ul className="mr-10">
          <li className="inline-block pt-4 pb-4 w-1/4">
            <Link to="/" className="pl-6 pr-8">
              Home
            </Link>
          </li>
          <li className="inline-block pt-4 pb-4 w-1/4">
            <Link to="/about" className="pl-6 pr-8">
              About
            </Link>
          </li>
          <li className="inline-block pt-4 pb-4 w-1/4">
            <Link to="/article" className="pl-6 pr-8">
              Articles
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
