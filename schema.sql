-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: zssn
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contamination`
--

DROP TABLE IF EXISTS `contamination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contamination` (
     `id` bigint NOT NULL AUTO_INCREMENT,
     `fromSurvivorId` bigint NOT NULL,
     `fromSurvivorName` varchar(255) DEFAULT NULL,
     `toSurvivorId` bigint DEFAULT NULL,
     `toSurvivorName` varchar(255) DEFAULT NULL,
     `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`),
     KEY `fromSurvivorIdToSurvivorId` (`fromSurvivorId`,`toSurvivorId`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contamination`
--

LOCK TABLES `contamination` WRITE;
/*!40000 ALTER TABLE `contamination` DISABLE KEYS */;
INSERT INTO `contamination` VALUES (22,2,'Arif',3,'Arif 2nd','2022-05-22 16:33:01');
/*!40000 ALTER TABLE `contamination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survivor`
--

DROP TABLE IF EXISTS `survivor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survivor` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL DEFAULT '',
    `age` int DEFAULT NULL,
    `gender` varchar(10) NOT NULL,
    `latitude` decimal(18,8) NOT NULL DEFAULT '0.00000000',
    `longitude` decimal(18,8) NOT NULL DEFAULT '0.00000000',
    `isInfected` char(1) NOT NULL DEFAULT 'N',
    `waterTotal` bigint NOT NULL DEFAULT '0',
    `foodTotal` bigint NOT NULL DEFAULT '0',
    `medicationTotal` bigint NOT NULL DEFAULT '0',
    `ammunitionTotal` bigint NOT NULL DEFAULT '0',
    `reportedAsContaminatedTotal` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `isInfected` (`isInfected`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survivor`
--

LOCK TABLES `survivor` WRITE;
/*!40000 ALTER TABLE `survivor` DISABLE KEYS */;
INSERT INTO `survivor` VALUES (2,'Arif',20,'MALE',-21992.39723000,882982.23130000,'Y',14,16,13,2,0);
INSERT INTO `survivor` VALUES (3,'Arif 2nd',20,'MALE',0.00000000,0.00000000,'N',11,14,12,2,0);
INSERT INTO `survivor` VALUES (4,'Arif 2nd',20,'MALE',0.00000000,0.00000000,'N',10,20,10,2,0);
/*!40000 ALTER TABLE `survivor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trade`
--

DROP TABLE IF EXISTS `trade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trade` (
     `id` bigint NOT NULL AUTO_INCREMENT,
     `code` varchar(255) NOT NULL,
     `survivorId` bigint NOT NULL,
     `survivorName` varchar(255) DEFAULT '',
     `type` char(5) DEFAULT NULL,
     `waterTotal` bigint DEFAULT '0',
     `foodTotal` bigint DEFAULT '0',
     `medicationTotal` bigint DEFAULT '0',
     `ammunitionTotal` bigint DEFAULT '0',
     `description` text,
     `createdAt` datetime NOT NULL,
     PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trade`
--
