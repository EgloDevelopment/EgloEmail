// Main index page (NO-AUTH)
import React, { useState, useEffect } from 'react';


// UI imports


// Function imports
import makePostRequest from '@/functions/make-post-request';
import parse from "html-react-parser"


// Start of page
export default function Page() {
  const [email, setEmail] = useState({ html: "" })


  async function getEmail() {
    const email_id = window.sessionStorage.getItem("email_id")

    await makePostRequest("/api/emails/read-email", {
      id: email_id
    }).then((response) => {
      setEmail(response)
    })
  }

  useEffect(() => {
    getEmail()
  }, []);

  return (
    <main className="bg-content1">
      {parse(email.html)}
    </main>
  );
}
