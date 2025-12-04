# Bengkulu Mulus - Sistem Pelaporan Kerusakan Jalan

**Bengkulu Mulus** adalah aplikasi *mobile* berbasis Sistem Informasi Geografis Partisipatif (PGIS) untuk memetakan dan melaporkan kerusakan infrastruktur jalan di Kota Bengkulu. Aplikasi ini memanfaatkan data geospasial *real-time* yang memungkinkan masyarakat berkontribusi dalam pemantauan infrastruktur, visualisasi sebaran kerusakan via *heatmap*, serta analisis statistik kondisi jalan.

Proyek ini dikembangkan untuk memenuhi tugas **Responsi Praktikum Pemrograman Perangkat Lunak Bergerak Lanjut (SVIG223542)**.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi (Tech Stack)](#teknologi-tech-stack)
- [Tampilan Aplikasi](#tampilan-aplikasi)
- [Instalasi & Pengaturan](#instalasi--pengaturan)
- [Struktur Proyek](#struktur-proyek)
- [Author](#author)

## Fitur Utama

* **Pelaporan Kerusakan:** Pengguna dapat mengirim laporan lengkap dengan bukti foto (kamera/galeri), titik koordinat GPS presisi, tingkat kerusakan (Ringan, Sedang, Berat), dan deskripsi detail.
* **Visualisasi Geospasial:** Integrasi peta interaktif menggunakan Leaflet.js untuk menampilkan sebaran titik kerusakan (marker) dan kepadatan area kerusakan (*heatmap*).
* **Manajemen Data (CRUD):** Fitur lengkap untuk Membuat, Melihat, Mengedit, dan Menghapus laporan yang telah dikirim.
* **Optimasi Gambar:** Kompresi gambar otomatis menggunakan Cloudinary untuk performa aplikasi yang lebih cepat dan hemat kuota.
* **Dashboard Statistik:** Ringkasan data total laporan, tingkat urgensi perbaikan, dan metrik partisipasi masyarakat.
* **Database Real-time:** Sinkronisasi data instan antar perangkat menggunakan Firebase Firestore.

## Teknologi (Tech Stack)

Proyek ini dibangun menggunakan teknologi modern berikut:

* **Framework:** React Native (via Expo SDK 52)
* **Bahasa:** TypeScript
* **Routing:** Expo Router
* **Database:** Firebase Firestore
* **Storage:** Cloudinary API (untuk hosting gambar)
* **Peta:** Leaflet.js (di-render via React Native WebView)
* **UI Components:** Komponen kustom dengan styling modern dan ikon dari Lucide React Native.

## Tampilan Aplikasi

| Dashboard Utama | Visualisasi Heatmap | Form Pelaporan |
|:---:|:---:|:---:|
| <img src="./docs/screenshots/home.png" width="250"> | <img src="./docs/screenshots/map.png" width="250"> | <img src="./docs/screenshots/form.png" width="250"> |

| Fitur Edit Data | Notifikasi Kustom | Statistik |
|:---:|:---:|:---:|
| <img src="./docs/screenshots/edit.png" width="250"> | <img src="./docs/screenshots/alert.png" width="250"> | <img src="./docs/screenshots/stats.png" width="250"> |

## Instalasi & Pengaturan

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda.

### Prasyarat

Pastikan Anda sudah menginstal:
* **Node.js** (Disarankan versi LTS)
* **npm** atau **yarn**
* **Expo CLI**: `npm install -g expo-cli`
* **Aplikasi Expo Go**: Terinstal di HP Android/iOS fisik Anda.

### Langkah Instalasi

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username-anda/ResponsiPGPBL.git](https://github.com/username-anda/ResponsiPGPBL.git)
    cd ResponsiPGPBL
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Environment**
    Proyek ini membutuhkan layanan eksternal (Firebase & Cloudinary). Buat file `.env` di *root directory* atau sesuaikan konfigurasi di `constants/firebase.ts`.

    *Key yang dibutuhkan:*
    * `FIREBASE_API_KEY`
    * `FIREBASE_AUTH_DOMAIN`
    * `FIREBASE_PROJECT_ID`
    * `FIREBASE_STORAGE_BUCKET`
    * `CLOUDINARY_CLOUD_NAME`
    * `CLOUDINARY_API_KEY`
    * `CLOUDINARY_UPLOAD_PRESET`

4.  **Jalankan Aplikasi**
    Mulai server development:
    ```bash
    npx expo start -c
    ```
    *Catatan: Flag `-c` digunakan untuk membersihkan cache agar aset termuat dengan benar.*

5.  **Jalankan di HP**
    Scan QR code yang muncul di terminal menggunakan aplikasi **Expo Go** di Android atau Kamera di iOS.

## Struktur Proyek

Aplikasi ini menggunakan arsitektur modular berbasis Expo Router:

* `app/`: Berisi layar utama (screens) dan logika routing.
    * `(tabs)/`: Navigasi menu bawah (Home, Peta, Statistik).
    * `forminputlocation.tsx`: Layar input laporan baru.
    * `formeditlocation.tsx`: Layar edit laporan.
    * `LocationPicker.tsx`: Interface peta untuk memilih titik koordinat.
* `assets/`: Aset gambar, font, dan file HTML untuk Leaflet.
* `components/`: Komponen UI yang dapat digunakan kembali (Forms, Cards, Alerts).
* `constants/`: Konstanta styling, tema warna, dan konfigurasi API.
* `hooks/`: Custom React Hooks untuk fetching data (contoh: `useMapReports`).

## Author

**Muhammad Naufal Hidayat**
* **NIM:** 23/520500/SV/23249
* **Program Studi:** Sarjana Terapan Sistem Informasi Geografis
* **Institusi:** Universitas Gadjah Mada

---
*Copyright © 2025 Bengkulu Mulus Project.*
