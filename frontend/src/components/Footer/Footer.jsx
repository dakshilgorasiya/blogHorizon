import React from 'react';
import { Copyright } from "lucide-react";

function Footer() {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-priary text-white text-sm">
      <div className="flex items-center gap-2">
        <Copyright size={20} />
        <p>All rights reserved</p>
      </div>
      <p>Developed by Dakshil Gorasiya</p>
    </div>
  );
}

export default Footer;