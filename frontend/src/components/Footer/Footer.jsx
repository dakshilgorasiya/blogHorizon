import React from "react";
import { Copyright, Heart, Code } from "lucide-react";

function Footer() {
  return (
    <div className="relative mt-16">
      {/* Decorative background elements */}
      <div className="absolute -top-20 left-1/4 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute -top-20 right-1/4 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

      {/* Main footer container */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 overflow-hidden">
        {/* Glass morphism overlay */}
        <div className="bg-black/10 backdrop-blur-sm">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          <div className="flex flex-col items-center justify-center p-8 text-white">
            {/* Main content */}
            <div className="flex flex-col items-center space-y-4 max-w-md text-center">
              {/* Copyright section */}
              <div className="flex items-center gap-2 group">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full group-hover:bg-white/20 transition-all duration-300">
                  <Copyright
                    size={18}
                    className="group-hover:rotate-12 transition-transform duration-300"
                  />
                </div>
                <p className="text-lg font-medium">All rights reserved</p>
              </div>

              {/* Developer credit */}
              <div className="flex items-center gap-2 text-white/90 group">
                <span className="text-sm">Developed with</span>
                <Heart
                  size={16}
                  className="text-red-300 group-hover:scale-110 group-hover:text-red-400 transition-all duration-300 animate-pulse"
                />
                <span className="text-sm">by</span>
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer group-hover:scale-105">
                  <Code size={14} />
                  <span className="font-semibold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                    Dakshil Gorasiya
                  </span>
                </div>
              </div>

              {/* Decorative separator */}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

              {/* Additional footer info */}
              <div className="text-xs text-white/70 space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <span>Built with</span>
                  <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent font-medium">
                    React & Tailwind CSS
                  </span>
                </p>
                <p>© {new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>

            {/* Subtle animation elements */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-purple-400 via-white/20 to-blue-400 animate-pulse"></div>
          </div>
        </div>

        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
