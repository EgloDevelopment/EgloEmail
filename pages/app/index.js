// Main index page (NO-AUTH)
import React, { useState, useEffect } from 'react';


// UI imports
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";


// Function imports
import makePostRequest from '@/functions/make-post-request';
import Cookies from "js-cookie";
import parse from "html-react-parser"


// Start of page
export default function Page() {
    const [ownedMailboxes, setOwnedMailboxes] = useState([])
    const [activeMailbox, setActiveMailbox] = useState("")

    const [currentEmail, setCurrentEmail] = useState([])

    const [emails, setEmail] = useState([])

    const { isOpen, onOpen, onClose } = useDisclosure();

    const DATE_OPTIONS = {
        minute: "numeric",
        hour: "numeric",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: false,
    };

    async function getOwnedMailboxes() {
        await makePostRequest("/api/user/get-owned-mailboxes").then((response) => {
            setOwnedMailboxes(response)
        })
    }

    async function getEmailPreviews(mailbox) {
        setActiveMailbox(mailbox)

        await makePostRequest(`/api/emails/get?auth=${Cookies.get("get_token")}`, {
            email: mailbox
        }).then((response) => {
            setEmail(response)
        })
    }

    async function openEmail(email_id) {
        setCurrentEmail(email_id)
        window.sessionStorage.setItem("email_id", email_id)
        onOpen()
    }

    useEffect(() => {
        getOwnedMailboxes()
    }, []);

    return (
        <main>
            <div className="absolute top-0 left-0 m-2">
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered">
                            Mailboxes
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        {ownedMailboxes.map((mailbox) => (
                            <DropdownItem key={mailbox} onClick={() => getEmailPreviews(mailbox)}>{mailbox}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className="absolute top-0 right-0 m-2">
                <p className="font-bold">{activeMailbox}</p>
            </div>

            <div className="px-5 mt-16">
                {emails.map((email) => (
                    <Card className="mt-3 w-full cursor-pointer">
                        <CardBody onClick={() => { openEmail(email.messageId) }}>
                            <p className="">{email.subject}</p>
                            <p className="text-xs text-content4 mt-1">{new Date(email.date).toLocaleDateString("en-US", DATE_OPTIONS)}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div>
                <Modal
                    size="5xl"
                    isOpen={isOpen}
                    onClose={onClose}
                    scrollBehavior="outside"
                    className="h-3/4"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">{currentEmail.subject}</ModalHeader>
                                <iframe src="/app/email-viewer" className="h-full" />
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>


        </main>
    );
}
