This document handles all the pages and the corresponding APIs that will be used on each page and the shared APIs amoung the pages

Working:
- An application where i can upload contacts as email and upload pdf files
- I can send PDF files to a contact as an contract
- receiver will receive it on an email
- receiver will open the url sent to them and sign with their initials in the input box added by the contract creator.
- When they sign the agreement the aggrement sender will get the email that it was signed.
- These are the agreement statuses [DRAFT, SENT, SIGNED, EXPIRED]
All the pages in document journey frontend:
PAGE: /dashboard
- Will showcase actions buttons [Send for signature, upload document, upload contact ] & a recent document activity section
- ROLES: CREATOR, SIGNER

PAGE: /agreements
- Send and manage your agreements here.
- view list of all the agreements with their surrent statuses
- click on each agreement takes you to /agreements/[id] and view that document there

PAGE: /agreements/create
- A page showcaseing the uploaded pdf with option to add name of agreement, on pdf canvas add a signature field where the receiver will sign.

PAGE: /agreements/[id]

PAGE: /contacts
- we can add or remove a email contact

PAGE: /documents
- Shows all the uploaded documents with an option to send to as agreement to a contact or delete it.

PAGE: /sign/:token	
- signing page for receiver
- Only the assigned signer can access this page