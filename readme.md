# 📄 DocuSign Clone – Document Signing Platform

A minimal, secure document-signing platform inspired by DocuSign/Docll. This project allows users to upload documents, send them as agreements to contacts, and enables receivers to sign digitally via secure links.

---

## 🚀 Features

- Upload PDF documents and contact emails.
- Create and send agreements for e-signature.
- Secure email-based signing links (no login required for signers).
- Track agreement statuses: `DRAFT`, `SENT`, `SIGNED`, `EXPIRED`.
- Notification emails on signature completion.

---

## 🧩 User Roles

- **CREATOR**: Can upload documents, manage contacts, and send agreements.
- **SIGNER**: Receives and signs documents via secure tokenized links.

---

## 📚 Frontend Pages & APIs

### 🔸 `/dashboard`
- **Purpose**: Central hub for quick actions and activity tracking.
- **Features**:
  - Action buttons: `Send for Signature`, `Upload Document`, `Upload Contact`
  - Recent activity section

---

### 🔸 `/agreements`
- **Purpose**: Manage all agreements.
- **Features**:
  - View list of agreements with status
  - Navigate to individual agreement via `/agreements/[id]`

---

### 🔸 `/agreements/create`
- **Purpose**: Create a new agreement from an uploaded document.
- **Features**:
  - Upload/choose PDF document
  - Add agreement name
  - Place signature field for signer on canvas

---

### 🔸 `/agreements/[id]`
- **Purpose**: View a specific agreement and its signing details.

---

### 🔸 `/contacts`
- **Purpose**: Manage contact list.
- **Features**:
  - Add or remove email contacts

---

### 🔸 `/documents`
- **Purpose**: Document repository.
- **Features**:
  - View uploaded documents
  - Send as agreement
  - Delete documents

---

### 🔸 `/sign/:token`
- **Purpose**: Secure signing page for the receiver.
- **Features**:
  - Only accessible to the intended signer
  - Display agreement details and signature input
  - After signing: mark agreement as `SIGNED` and notify creator

---

## 🔐 Auth Flow

- **Creator**: Full login-based (JWT or session)
- **Signer**: Tokenized URL in email (one-time access, expiring link)

---

## 🛠️ Stack (Example)

- **Frontend**: React / Next.js
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (e.g., hosted on Railway)
- **Email Service**: Nodemailer / Resend / AWS SES
- **Storage**: AWS S3 (or local initially)
- **PDF Rendering**: `pdf-lib` or `react-pdf`

---

## 📦 Agreement Lifecycle

```text
1. Creator uploads PDF and selects a contact.
2. Agreement created in DRAFT state.
3. When sent, status = SENT and email sent to signer.
4. Signer signs using secure link → status = SIGNED.
5. Link expires after signing or expiry time → status = EXPIRED.
