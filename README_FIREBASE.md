# Panduan Membuat Project Firebase untuk Bara AI

Berikut adalah langkah-langkah lengkap untuk membuat project Firebase sendiri dan menghubungkannya dengan aplikasi Bara AI:

## 1. Membuat Project Baru di Firebase Console
1. Buka browser dan pergi ke [Firebase Console](https://console.firebase.google.com/).
2. Login menggunakan akun Google Anda (bagoesrahmatulloh@gmail.com).
3. Klik tombol **"Create a project"** (Buat proyek) atau **"Add project"** (Tambahkan proyek).
4. Masukkan nama project, misalnya: `bara-ai-project`.
5. Anda bisa mengaktifkan atau menonaktifkan Google Analytics (untuk tahap awal, boleh dinonaktifkan saja).
6. Klik **"Create project"** dan tunggu prosesnya selesai, lalu klik **"Continue"**.

## 2. Menambahkan Aplikasi Web ke Project
1. Di halaman utama (Overview) project Firebase Anda, klik ikon **Web** (ikon berbentuk kurung sudut `</>`).
2. Masukkan julukan aplikasi, misalnya: `Bara AI Web`.
3. Anda tidak perlu mencentang opsi "Also set up Firebase Hosting" untuk saat ini.
4. Klik **"Register app"**.
5. **Penting:** Firebase akan menampilkan blok kode yang berisi `firebaseConfig`. **Salin (copy)** konfigurasi tersebut karena akan kita gunakan nanti. Konfigurasinya terlihat seperti ini:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "bara-ai-....firebaseapp.com",
     projectId: "bara-ai-...",
     storageBucket: "bara-ai-....appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
6. Klik **"Continue to console"**.

## 3. Mengaktifkan Firebase Authentication (Login Google)
Agar pengguna bisa login dengan Google di aplikasi Bara AI Anda:
1. Di menu sebelah kiri, klik **"Build"** -> **"Authentication"**.
2. Klik tombol **"Get started"**.
3. Pilih tab **"Sign-in method"**.
4. Di bagian "Additional providers", klik **Google**.
5. Aktifkan (Enable) toggle-nya.
6. Pilih "Project support email" dengan email Anda.
7. Klik **"Save"**.

## 4. Mengaktifkan Firestore Database (Penyimpanan Chat)
Jika Anda ingin chat tersimpan di database cloud (bukan cuma di memori lokal HP/PC):
1. Di menu sebelah kiri, klik **"Build"** -> **"Firestore Database"**.
2. Klik tombol **"Create database"**.
3. Pilih lokasi server (bebas, misalnya `asia-southeast2` untuk Jakarta atau `nam5` default).
4. Pilih **"Start in Test mode"** (Mulai dalam mode pengujian) agar aplikasi bisa langsung membaca/menulis data tanpa error izin sementara waktu. (Penting: Mode ini akan kadaluarsa dalam 30 hari, nanti aturannya bisa diubah).
5. Klik **"Create"**.

## 5. Menghubungkan ke Aplikasi Bara AI (Langkah Selanjutnya)
Setelah Anda melakukan 4 langkah di atas, jika Anda ingin saya (Agent) memasukkan dan menghubungkan Firebase tersebut ke dalam kode Bara AI, beri tahu saya dengan membagikan nilai `firebaseConfig` yang Anda dapatkan di Langkah 2.

Anda cukup memberikan konfigurasi tersebut ke saya, dan saya akan melakukan *setup* kodenya secara otomatis!
