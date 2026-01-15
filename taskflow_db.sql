-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 15 Oca 2026, 18:28:13
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `taskflow_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `manager_id` int(11) NOT NULL,
  `status` enum('aktif','tamamlandi','bekleyen') DEFAULT 'bekleyen',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `manager_id`, `status`, `created_at`) VALUES
(6, 'Yeni Proje', 'Proje Detayları...', 2, 'bekleyen', '2025-12-26 14:07:09'),
(8, 'BackDEv', 'BackDEv', 2, 'bekleyen', '2025-12-26 14:46:22');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `assigned_to` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `due_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `tasks`
--

INSERT INTO `tasks` (`id`, `project_id`, `assigned_to`, `title`, `description`, `status`, `due_date`, `created_at`) VALUES
(11, 6, 4, 'Stajla', 'Stajla görevini yap...', 'pending', '2025-12-31 00:00:00', '2025-12-26 14:07:38'),
(12, 8, 3, 'Gökhanın Görevi', 'BackDEv', 'pending', '2025-12-31 00:00:00', '2025-12-26 14:47:13'),
(13, 8, 4, 'Nihatın Görevi', 'BackDEv', 'in_progress', '2025-12-31 00:00:00', '2025-12-26 14:48:35');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','employee') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Hasan Yılmaz', 'hasanciyilmaz@gmail.com', '$2b$10$j1jLZTBvwpGpGzUjH5U1KOPnjd07rh3Be4QSt5qHfSfZM.JOheiPm', 'admin', '2025-12-24 00:03:06'),
(3, 'Gokhan', 'gokhan@taskflow.com', '$2b$10$DZawR3.QDyu3J55xecT9KuV1ODHfTWrufYuIQ9GrvxDiUTlvxpeqW', 'employee', '2025-12-24 18:38:57'),
(4, 'Nihat Ademoğlu', 'nihat@taskflow.com', '$2b$10$AerKfrnVBAoA72sYWBnEXe.L78XkTZn6q1kCD/gNjERAUy2cXB68y', 'employee', '2025-12-26 13:32:41');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Tablo için indeksler `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
