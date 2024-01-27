// Main index page (NO-AUTH)
import React, { useState, useEffect } from 'react';


// UI imports
import { Button, ButtonGroup } from "@nextui-org/react";


// Function imports
import Cookies from "js-cookie";


// Start of page
export default function Page() {
  useEffect(() => {
    if (Cookies.get("token") === undefined) {
      window.location.href = "/login"
    } else {
      window.location.href = "/app"
    }
  }, []);

  return (
    <main>
      {/* Redirect page, so nothing here */}
    </main>
  );
}
