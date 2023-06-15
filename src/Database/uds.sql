-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 15, 2023 at 10:27 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uds`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` varchar(255) NOT NULL,
  `patient` varchar(255) NOT NULL,
  `hc_provider` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'new',
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient`, `hc_provider`, `time`, `subject`, `message`, `status`, `dateadded`) VALUES
('1457909009', '398325557', '1576841100', '2023-06-08 23:15:49', 'demo subject', 'demo message', 'new', '2023-06-09 08:32:13'),
('1613492818', '398325557', '157787752', '2023-06-09 17:10:49', 'demo subject', 'demo message', 'new', '2023-06-13 17:31:28'),
('2031050098', '398325557', '1576841100', '2023-06-09 17:55:50', 'demo subject', 'demo message', 'new', '2023-06-09 09:04:32'),
('513630610', '398325557', '157787752', '2023-06-09 16:15:49', 'demo subject', 'demo message', 'new', '2023-06-13 17:31:40');

-- --------------------------------------------------------

--
-- Table structure for table `cells`
--

CREATE TABLE `cells` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sector` varchar(255) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cells`
--

INSERT INTO `cells` (`id`, `name`, `sector`, `dateadded`) VALUES
('21352415', 'umuganda', '209352040', '2023-06-10 11:06:40');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `dateadded`) VALUES
('1211191958', 'demo department', '2023-06-07 14:12:47'),
('1790485192', 'demo department 2', '2023-06-07 14:23:28'),
('260211734', 'demo department 2', '2023-06-07 14:52:53');

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `province`, `dateadded`) VALUES
('1111292838', 'rubavu', '675870110', '2023-06-10 10:43:20'),
('366917655', 'karongi', '675870110', '2023-06-10 10:58:38'),
('490998868', 'nyabihu', '675870110', '2023-06-10 10:58:33'),
('738010423', 'rutsiro', '675870110', '2023-06-10 10:58:23'),
('971593329', 'rusizi', '675870110', '2023-06-10 10:58:46');

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `departments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT json_array() CHECK (json_valid(`departments`)),
  `employees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT json_array() CHECK (json_valid(`employees`)),
  `province` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `sector` varchar(255) NOT NULL,
  `cell` varchar(255) NOT NULL,
  `dependency` varchar(30) NOT NULL,
  `date added` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `type`, `phone`, `departments`, `employees`, `province`, `district`, `sector`, `cell`, `dependency`, `date added`) VALUES
('1992110766', 'Gacuba Hp', 'health post', '239238445595', '[\"1211191958\",\"1790485192\"]', '[\"157787752\", \"1576841100\", \"2144513620\"]', '675870110', '1111292838', '1346978638', '21352415', 'public', '2023-06-13 12:15:16'),
('631462486', 'Gisenyi Hospital', 'General Hospital', '239238445595', '[\"1211191958\",\"1790485192\"]', '[\"73077013\"]', '675870110', '1111292838', '209352040', '21352415', 'public', '2023-06-13 12:16:15');

-- --------------------------------------------------------

--
-- Table structure for table `inventories`
--

CREATE TABLE `inventories` (
  `id` int(255) NOT NULL,
  `hospital` varchar(255) NOT NULL,
  `medicines` longtext NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventories`
--

INSERT INTO `inventories` (`id`, `hospital`, `medicines`, `dateadded`) VALUES
(1079999049, '631462486', '[{\"id\":\"28674416\",\"quantity\":\"101\"}]', '2023-06-13 12:18:34'),
(1263092970, '1992110766', '[{\"id\":\"28674416\",\"quantity\":93}]', '2023-06-13 13:53:29');

-- --------------------------------------------------------

--
-- Table structure for table `medical_history`
--

CREATE TABLE `medical_history` (
  `id` varchar(255) NOT NULL,
  `patient` varchar(255) NOT NULL,
  `hospital` varchar(255) NOT NULL,
  `departments` varchar(255) NOT NULL,
  `hc_provider` varchar(255) NOT NULL,
  `symptoms` varchar(255) NOT NULL,
  `tests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tests`)),
  `medicines` longtext NOT NULL,
  `decision` varchar(255) NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_history`
--

INSERT INTO `medical_history` (`id`, `patient`, `hospital`, `departments`, `hc_provider`, `symptoms`, `tests`, `medicines`, `decision`, `comment`, `status`, `date`) VALUES
('1017943130', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:50:54'),
('1051478701', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 12:39:41'),
('1075905886', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:52:28'),
('1100008191', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:45:48'),
('1128757597', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:34:07'),
('1147742402', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:53:29'),
('1150111620', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:38:34'),
('116573754', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:33:34'),
('1204251125', '398325557', '1992110766', '[\"1211191958\",\"1790485192\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"862363307\",\"qty\":2},{\"id\":\"645475106\",\"qty\":3}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-08 10:05:38'),
('1323978279', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:51:37'),
('1380009276', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:42:51'),
('1410595476', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:40:03'),
('1588388953', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:40:31'),
('1676723272', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 12:38:46'),
('1706594301', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 12:58:35'),
('1786789162', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 12:48:55'),
('1947834183', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:47:19'),
('1992509697', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 12:56:22'),
('2093029651', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:40:53'),
('217816201', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:37:58'),
('349122820', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:52:46'),
('448847493', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:03:13'),
('449318993', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:43:08'),
('507126787', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:46:33'),
('560761030', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:43:39'),
('643388474', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:44:17'),
('691819114', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:49:53'),
('711233214', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:35:09'),
('743803407', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:17:22'),
('780917139', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:49:15'),
('827677529', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 12:50:16'),
('872090157', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 13:48:25'),
('947981932', '398325557', '1992110766', '[\"department 1\",\"department 2\"]', '157787752', '[\"symptom 1\",\"symptom 2\",\"symptom 3\"]', '[{\"id\":\"796832866\",\"result\":\"test result\"}]', '[{\"id\":\"28674416\",\"qty\":2}]', '[\"decision 1\",\"decision 2\"]', 'demo comment', 'open', '2023-06-13 12:50:55');

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `unit` varchar(255) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `name`, `price`, `unit`, `dateadded`) VALUES
('28674416', 'paracetamol', 80.05, 'demo unit', '2023-06-13 10:00:57'),
('645475106', 'demo medicine name 2', 0.05, 'demo unit', '2023-06-08 00:33:46'),
('862363307', 'demo medicine name 1', 80.05, 'demo unit', '2023-06-07 15:29:24');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `user`, `receiver`, `type`, `content`, `dateadded`) VALUES
('2074231021', '157787752', '1576841100', 'messagez', 'your hospital is good', '2023-06-12 11:30:37'),
('770703628', '157787752', '', '', '', '2023-06-12 11:01:03');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` varchar(255) NOT NULL,
  `NID` varchar(255) DEFAULT NULL,
  `Full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `DOB` date NOT NULL,
  `resident_province` varchar(30) NOT NULL,
  `resident_district` varchar(30) NOT NULL,
  `resident_sector` varchar(30) NOT NULL,
  `resident_cell` varchar(30) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'patient',
  `last_diagnosed` date DEFAULT NULL,
  `FA` int(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `NID`, `Full_name`, `email`, `phone`, `username`, `password`, `DOB`, `resident_province`, `resident_district`, `resident_sector`, `resident_cell`, `role`, `last_diagnosed`, `FA`, `status`, `dateadded`) VALUES
('398325557', '12004815443305', 'dummy user', 'hesh.teo@gmail.com', '078086182', 'dummy.ser', '123', '2022-07-30', 'west', 'rubavu', 'gisenyi', 'umuganda', 'patient', NULL, NULL, 'active', '2023-06-08 15:33:15');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(30) NOT NULL,
  `user` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user`, `session`, `amount`, `status`, `date`) VALUES
(88038458, '398325557', '827677529', 1160.15, 'awaiting payment', '2023-06-13 12:50:16'),
(222786140, '398325557', '560761030', 1160.15, 'awaiting payment', '2023-06-13 13:43:39'),
(291014309, '398325557', '1786789162', 1160.15, 'awaiting payment', '2023-06-13 12:48:55'),
(298573617, '398325557', '217816201', 1160.15, 'awaiting payment', '2023-06-13 13:37:58'),
(322587165, '398325557', '349122820', 1160.15, 'awaiting payment', '2023-06-13 13:52:46'),
(457820676, '398325557', '1075905886', 1160.15, 'awaiting payment', '2023-06-13 13:52:28'),
(866539522, '398325557', '1676723272', 1160.15, 'awaiting payment', '2023-06-13 12:38:46'),
(866652732, '398325557', '1017943130', 1160.15, 'awaiting payment', '2023-06-13 13:50:54'),
(883798083, '398325557', '1204251125', 1160.15, 'awaiting payment', '2023-06-07 23:14:32'),
(974788121, '398325557', '1128757597', 1160.15, 'awaiting payment', '2023-06-13 13:34:07'),
(1231595233, '398325557', '1147742402', 1160.15, 'awaiting payment', '2023-06-13 13:53:29'),
(1238032025, '398325557', '1150111620', 1160.15, 'awaiting payment', '2023-06-13 13:38:34'),
(1381577310, '398325557', '1323978279', 1160.15, 'awaiting payment', '2023-06-13 13:51:37'),
(1387272939, '398325557', '1588388953', 1160.15, 'awaiting payment', '2023-06-13 13:40:31'),
(1420561651, '398325557', '448847493', 1160.15, 'awaiting payment', '2023-06-13 13:03:13'),
(1545510919, '398325557', '1051478701', 1160.15, 'awaiting payment', '2023-06-13 12:39:41'),
(1576396893, '398325557', '691819114', 1160.15, 'awaiting payment', '2023-06-13 13:49:53'),
(1618743056, '398325557', '780917139', 1160.15, 'awaiting payment', '2023-06-13 13:49:15'),
(1657775567, '398325557', '872090157', 1160.15, 'awaiting payment', '2023-06-13 13:48:25'),
(1678022537, '398325557', '947981932', 1160.15, 'awaiting payment', '2023-06-13 12:50:55'),
(1680215448, '398325557', '1706594301', 1160.15, 'awaiting payment', '2023-06-13 12:58:35'),
(1748152475, '398325557', '1947834183', 1160.15, 'awaiting payment', '2023-06-13 13:47:19'),
(1750914507, '398325557', '1992509697', 1160.15, 'awaiting payment', '2023-06-13 12:56:22'),
(1834011169, '398325557', '711233214', 1160.15, 'awaiting payment', '2023-06-13 13:35:09'),
(2017631421, '398325557', '643388474', 1160.15, 'awaiting payment', '2023-06-13 13:44:18'),
(2093869166, '398325557', '743803407', 1160.15, 'awaiting payment', '2023-06-13 13:17:22'),
(2122915664, '398325557', '2093029651', 1160.15, 'awaiting payment', '2023-06-13 13:40:53');

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`id`, `name`, `dateadded`) VALUES
('675870110', 'west', '2023-06-10 10:43:00');

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--

CREATE TABLE `sectors` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sectors`
--

INSERT INTO `sectors` (`id`, `name`, `district`, `dateadded`) VALUES
('1034027553', 'nyakiriba', '1775546739', '2023-06-10 09:48:29'),
('1113250230', 'rubavu', '1111292838', '2023-06-10 11:02:10'),
('1153354270', 'muhoza', '636894418', '2023-06-10 08:28:07'),
('1346978638', 'gisenyi', '1775546739', '2023-06-10 09:48:02'),
('1644208413', 'rugerero', '1775546739', '2023-06-10 09:48:34'),
('209352040', 'gisenyi', '1111292838', '2023-06-10 11:01:35'),
('270114803', 'rubavu', '1775546739', '2023-06-10 09:48:07'),
('3442920', 'nyakiriba', '1111292838', '2023-06-10 11:01:40'),
('700696413', 'kanzenze', '1111292838', '2023-06-10 11:02:21'),
('702791819', 'rugerero', '1111292838', '2023-06-10 11:01:31'),
('880670562', 'cyanzarwe', '1775546739', '2023-06-10 09:48:16');

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `dateadded` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`id`, `name`, `price`, `dateadded`) VALUES
('796832866', 'demo test name 1', 1000.05, '2023-06-07 23:14:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `NID` varchar(20) DEFAULT NULL,
  `email` varchar(70) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `Full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `FA` int(11) DEFAULT NULL,
  `role` varchar(30) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `ll_atmpt` date NOT NULL DEFAULT current_timestamp(),
  `date added` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `NID`, `email`, `phone`, `Full_name`, `username`, `password`, `FA`, `role`, `title`, `status`, `ll_atmpt`, `date added`) VALUES
('1576841100', '23454323234', 'hesheo@gmail.com', '0790862884', 'dummy director general', 'dummy.directo.general', '123', 167346, 'director_general', NULL, 'unverified', '2023-06-05', '2023-06-12 12:00:42'),
('157787752', '232323434343434', 'hesfheo@gmail.com', '07908618843', 'dummy health care provider', 'dummy.hcp', '123', NULL, 'hc_provider', NULL, 'active', '2023-06-05', '2023-06-11 11:59:58'),
('2144513620', '345432345432345400', 'hesh.teo@gmail.com', '0790861884', 'dummy pharmacist', 'dummy.pharmacist', '123', NULL, 'pharmacist', 'Pharmacist', 'active', '2023-06-11', '2023-06-11 09:44:25'),
('684025588', '0', 'heshteo@gmail.com', '0123456789', 'Super admin', 'admin', 'admin', NULL, 'Admin', NULL, 'active', '2023-06-01', '2023-06-12 12:42:51'),
('73077013', 'wefcserfcs', 'hesteo@gmail.com', '0790841884', 'dummy pharmacist 2', 'dummy.pharmacist2', '123', NULL, 'pharmacist', 'Pharmacist', 'active', '2023-06-13', '2023-06-13 12:17:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient` (`patient`),
  ADD KEY `hc_provider` (`hc_provider`);

--
-- Indexes for table `cells`
--
ALTER TABLE `cells`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sector` (`sector`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `province` (`province`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `province` (`province`),
  ADD KEY `district` (`district`),
  ADD KEY `sector` (`sector`),
  ADD KEY `cell` (`cell`);

--
-- Indexes for table `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hospital` (`hospital`);

--
-- Indexes for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient` (`patient`),
  ADD KEY `hospital` (`hospital`),
  ADD KEY `hc_provider` (`hc_provider`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `session` (`session`);

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `district` (`district`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`hc_provider`) REFERENCES `users` (`id`);

--
-- Constraints for table `cells`
--
ALTER TABLE `cells`
  ADD CONSTRAINT `cells_ibfk_1` FOREIGN KEY (`sector`) REFERENCES `sectors` (`id`);

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`province`) REFERENCES `provinces` (`id`);

--
-- Constraints for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD CONSTRAINT `hospitals_ibfk_1` FOREIGN KEY (`province`) REFERENCES `provinces` (`id`),
  ADD CONSTRAINT `hospitals_ibfk_2` FOREIGN KEY (`district`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `hospitals_ibfk_3` FOREIGN KEY (`sector`) REFERENCES `sectors` (`id`),
  ADD CONSTRAINT `hospitals_ibfk_4` FOREIGN KEY (`cell`) REFERENCES `cells` (`id`);

--
-- Constraints for table `inventories`
--
ALTER TABLE `inventories`
  ADD CONSTRAINT `inventories_ibfk_1` FOREIGN KEY (`hospital`) REFERENCES `hospitals` (`id`);

--
-- Constraints for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD CONSTRAINT `medical_history_ibfk_1` FOREIGN KEY (`patient`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `medical_history_ibfk_2` FOREIGN KEY (`hospital`) REFERENCES `hospitals` (`id`),
  ADD CONSTRAINT `medical_history_ibfk_3` FOREIGN KEY (`hc_provider`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`session`) REFERENCES `medical_history` (`id`);

--
-- Constraints for table `sectors`
--
ALTER TABLE `sectors`
  ADD CONSTRAINT `sectors_ibfk_1` FOREIGN KEY (`district`) REFERENCES `districts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
