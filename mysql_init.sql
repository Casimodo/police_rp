-- --------------------------------------------------------
-- Hôte:                         xxx
-- Version du serveur:           5.7.41 - MySQL Community Server (GPL)
-- SE du serveur:                Linux
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour Reality_Police
DROP DATABASE IF EXISTS `Reality_Police`;
CREATE DATABASE IF NOT EXISTS `Reality_Police` /*!40100 DEFAULT CHARACTER SET utf16 */;
USE `Reality_Police`;

-- Listage de la structure de la table Reality_Police. casiers_judiciaire
DROP TABLE IF EXISTS `casiers_judiciaire`;
CREATE TABLE IF NOT EXISTS `casiers_judiciaire` (
  `id_casier` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `civil_id` int(11) NOT NULL DEFAULT '0',
  `agent_id` varchar(50) NOT NULL DEFAULT '0',
  `detail_fait` longtext,
  `lieu` varchar(50) DEFAULT NULL,
  `timeUpdate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_casier`) USING BTREE,
  KEY `FK_casiers_judiciaire_civils` (`civil_id`),
  KEY `FK_casiers_judiciaire_players` (`agent_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf16;

-- Listage de la structure de la table Reality_Police. casiers_judiciaire_details
DROP TABLE IF EXISTS `casiers_judiciaire_details`;
CREATE TABLE IF NOT EXISTS `casiers_judiciaire_details` (
  `id_cas_detail` bigint(20) NOT NULL AUTO_INCREMENT,
  `casier_id` int(11) NOT NULL,
  `amende_id` int(11) NOT NULL,
  `complement` varchar(255) DEFAULT NULL,
  `multiple` int(11) DEFAULT '1',
  PRIMARY KEY (`id_cas_detail`),
  KEY `FK_casiers_judiciaire_details_casiers_judiciaire` (`casier_id`),
  KEY `FK_casiers_judiciaire_details_ref_amendes` (`amende_id`)
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf16;

-- Listage de la structure de la table Reality_Police. civils
DROP TABLE IF EXISTS `civils`;
CREATE TABLE IF NOT EXISTS `civils` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `tail_cm` int(11) DEFAULT '0',
  `genre` varchar(50) DEFAULT 'néan',
  `profession` varchar(255) DEFAULT 'néan',
  `telephone` varchar(50) DEFAULT 'néan',
  `signe_distinctif` varchar(255) DEFAULT 'néan',
  `photo_1` longtext,
  `photo_2` longtext,
  `photo_3` longtext,
  `photo_4` longtext,
  `photo_5` longtext,
  `timeCreate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timeUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf16;

-- Listage de la structure de la table Reality_Police. grades
DROP TABLE IF EXISTS `grades`;
CREATE TABLE IF NOT EXISTS `grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` int(11) DEFAULT NULL,
  `grade_label` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf16;


-- Listage de la structure de la table Reality_Police. players
DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `matricule` varchar(15) DEFAULT NULL,
  `investigation` int(11) DEFAULT '0',
  `admin` int(11) DEFAULT '0',
  `actif` int(11) DEFAULT '1',
  `timeJoin` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdate` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`username`) USING BTREE,
  KEY `FK_players_grades` (`grade`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf16;

-- Listage de la structure de la table Reality_Police. rapports
DROP TABLE IF EXISTS `rapports`;
CREATE TABLE IF NOT EXISTS `rapports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) DEFAULT NULL,
  `agent_id` varchar(50) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sujet` varchar(50) DEFAULT NULL,
  `commentaire` longtext,
  `photo_1` longtext,
  `photo_2` longtext,
  `photo_3` longtext,
  `photo_4` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf16;

-- Listage de la structure de la table Reality_Police. ref_amendes
DROP TABLE IF EXISTS `ref_amendes`;
CREATE TABLE IF NOT EXISTS `ref_amendes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL DEFAULT '',
  `type` enum('route','maritime','aviation','penal','aggravants','contraventions','délits','crimes') NOT NULL DEFAULT 'crimes',
  `complement` varchar(255) DEFAULT '',
  `tarif` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf16;

-- Listage des données de la table Reality_Police.ref_amendes : ~145 rows (environ)
INSERT INTO `ref_amendes` (`id`, `label`, `type`, `complement`, `tarif`) VALUES
	(1, 'Article 1-2-1-1 : Le non-respect de la signalisation', 'route', '', 6000),
	(2, 'Article 1-2-1-2 : Un usage abusif du klaxon ', 'route', '', 6000),
	(3, 'Article 1-2-1-3 : Ne pas porter la ceinture de sécurité au sein d’un véhicule qui en est équipé', 'route', '', 6000),
	(4, 'Article 1-2-1-4 : Le chevauchement d’une ligne blanche ou le dépassement sur celle-ci', 'route', '', 6000),
	(5, 'Article 1-2-1-5 : Le non-respect des distances de sécurité', 'route', '', 6000),
	(6, 'Article 1-2-1-6 : L’arrêt ou le stationnement dangereux ou gênant', 'route', '', 6000),
	(7, 'Article 1-2-1-7 : Le non-respect des règles de priorité', 'route', '', 6000),
	(8, 'Article 1-2-1-8 : Le demi-tour non autorisé', 'route', '', 6000),
	(9, 'Article 1-2-1-9 : La circulation de nuit sans mettre au minimum les feux de croisement', 'route', '', 6000),
	(10, 'Article 1-2-1-10 : L’entrave à la circulation', 'route', '', 6000),
	(11, 'Article 1-2-1-11 : La circulation hors route ou chemin praticable par un véhicule à moteur', 'route', '', 6000),
	(12, 'Article 1-2-1-12 : Le rodéo motorisé', 'route', '', 9000),
	(13, 'Article 1-2-1-13 : La circulation par un véhicule non homologué sur une route ', 'route', '', 9000),
	(14, 'Article 1-2-1-14 : L’usage du téléphone au volant ', 'route', '', 9000),
	(15, 'Article 1-2-1-15 : Le fait de conduire sans détenir le permis de conduire', 'route', '', 13500),
	(16, 'Article 1-2-1-16 : Circuler à contre-sens', 'route', '', 13500),
	(17, 'Article 1-2-1-17 : La non présentation du permis de conduire', 'route', '', 15000),
	(18, 'Article 1-2-1-18 : Circuler avec un véhicule en surcharge', 'route', '', 15000),
	(19, 'Article 1-2-1-19 : Le non port du casque pour les véhicules 2 roues', 'route', '', 6000),
	(20, 'Article 1-2-2-1 : La conduite sous l’emprise d’un produit stupéfiant', 'route', '', 9000),
	(21, 'Article 1-2-2-2: La conduite sous l\'emprise d\'alcool', 'route', '', 9000),
	(22, 'Article 1-2-3-1 : Un excès de vitesse compris entre 10 km/h et 50 km/h*', 'route', '', 6000),
	(23, 'Article 1-2-3-2 : Un excès de vitesse compris entre 51 km/h et 100 km/h *', 'route', '', 15000),
	(24, 'Article 1-2-3-3 : Un excès de vitesse au-dessus de 100 km/h*', 'route', '', 10000),
	(25, 'Article 1-2-3-4 : Un excès de vitesse au-dessus de 100 km/h commis en ville *', 'route', '', 25000),
	(26, 'Article 2-2-1 : Un excès de vitesse entre 20 nœuds et 40 nœuds avec un véhicule nautique dans une zone réglementé', 'maritime', '', 6000),
	(27, 'Article 2-2-2 : Un excès de vitesse supérieur à 41 nœuds avec un véhicule nautique dans une zone réglementée ', 'maritime', '', 9000),
	(28, 'Article 2-2-3 : Effectuer une manœuvre dangereuse à bord d’un véhicule nautique, proche d’un ponton, ou dans\nl’embouchure d’un port,hors parcours balisé', 'maritime', '', 9000),
	(29, 'Article 2-2-4 : La navigation à l’aide d’un véhicule nautique sans possession de la licence adéquate', 'maritime', '', 15000),
	(30, 'Article 3-2-1 : Le stationnement d’un aéronef sur un emplacement non prévu', 'aviation', '', 9000),
	(31, 'Article 3-2-2 : Le pilotage d’un véhicule aérien sans possession de la licence adéquate', 'aviation', '', 30000),
	(32, 'Article 3-2-3 : La non-présence sur la fréquence radio de la tour de contrôle la LCPD', 'aviation', '', 27000),
	(33, 'Article 3-2-4 : Le non-respect d’une distance de survol', 'aviation', '', 27000),
	(34, 'Article 3-2-5 : Le prêt d’un aéronef à une personne ne possédant pas la licence de pilotage adéquate', 'aviation', '', 75000),
	(35, 'Article 2-2-1-1 : Jeter ses déchets sur la voie publique', 'contraventions', '', 6000),
	(36, 'Article 2-2-1-2 : Le campement sauvage ', 'contraventions', '', 6000),
	(37, 'Article 2-2-1-3 : Le graffiti ou tag', 'contraventions', '', 6000),
	(38, 'Article 2-2-1-4 : Le tapage de jour ou de nuit', 'contraventions', '', 6000),
	(39, 'Article 2-2-1-5 : L’ivresse publique et manifeste', 'contraventions', '', 6000),
	(40, 'Article 2-2-1-6 : L’abandon de véhicule ou d’épave ', 'contraventions', '', 6000),
	(41, 'Article 2-2-1-7 : Participer à une manifestation non déclarée', 'contraventions', '', 6000),
	(42, 'Article 2-2-1-8 : Les violences physiques non consenties sans ITT ', 'contraventions', '', 9000),
	(43, 'Article 2-2-1-9 : La profanation ', 'contraventions', '', 9000),
	(44, 'Article 2-2-1-10 : L’usage illicite de produit stupéfiant', 'contraventions', '', 9000),
	(45, 'Article 2-2-1-11 : Réaliser ou participer à un feu de camp sauvage', 'contraventions', '', 9000),
	(46, 'Article 2-2-1-12 : Participer à une rave party ', 'contraventions', '', 9000),
	(47, 'Article 2-2-1-13 : Apparaître masqué dans un lieu public ', 'contraventions', '', 6000),
	(48, 'Article 2-2-1-14 : L’intrusion dans une propriété de l\'État ', 'contraventions', '', 10000),
	(49, 'Article 2-2-1-15 : Le vol de véhicule ou circuler dans un véhicule volé ', 'contraventions', '', 6000),
	(50, 'Article 2-2-1-16 : Le vol simple ', 'contraventions', '', 6000),
	(51, 'Article 2-2-1-17 : L’outrage public à la pudeur ou le voyeurisme', 'contraventions', '', 10000),
	(52, 'Article 2-2-1-18 : Les dégradations de biens privés ', 'contraventions', '', 10000),
	(53, 'Article 2-2-1-19 : La diffamation publique', 'contraventions', '', 10000),
	(54, 'Article 2-2-1-20 : Le refus d’obtempérer ', 'contraventions', '', 6000),
	(55, 'Article 2-2-1-21 : Le refus de se soumettre a un controle de police', 'contraventions', '', 15000),
	(56, 'Article 2-2-1-22 : La non présentation d’une pièce d’identité lors d’un contrôle', 'contraventions', '', 15000),
	(57, 'Article 2-2-1-23 : La non déclaration de la perte ou du vol d’une arme ou d’une munition ', 'contraventions', '', 10000),
	(58, 'Article 2-2-1-24 : Une injure publique', 'contraventions', '', 20000),
	(59, 'Article 2-2-1-25 : Présenter visuellement une arme blanche dans un lieu public', 'contraventions', '', 25000),
	(60, 'Article 2-2-1-26 : Un outrage commis envers un agent de l\'État', 'contraventions', '', 20000),
	(61, 'Article 2-2-1-27 : L’organisateur d’une manifestation non déclarée ', 'contraventions', '', 35000),
	(62, 'Article 2-2-1-28 : Chasser ou pêcher sans possession du permis adéquat ou en chassant ou pêchant\n une espèce protégée', 'contraventions', '', 30000),
	(63, 'Article 2-2-1-29 : Effectuer un acte de chantage avec menaces', 'contraventions', '', 45000),
	(64, 'Article 2-2-1-30 : Effectuer des menaces', 'contraventions', '', 40000),
	(65, 'Article 2-2-1-31 : Le harcèlement physique consiste en un acte de violence réitéré dans le temps', 'contraventions', '', 70000),
	(66, 'Article 2-2-1-32 : Le harcèlement moral', 'contraventions', '', 65000),
	(67, 'Article 2-2-1-33 : L’usurpation d’identité', 'contraventions', '', 35000),
	(68, 'Article 2-2-1-34 : La possession d\'objets illégaux non décrits dans d’autres articles du présent Code Pénal ', 'contraventions', '', 10000),
	(69, 'Article 2-2-1-35 : Participer ou organiser une course illégale', 'contraventions', '', 10000),
	(70, 'Article 2-2-1-36 : Entraver une opération de la LSDP ou des EMS ', 'contraventions', '', 40000),
	(71, 'Article 2-2-1-37 : La détention de drogue dure (Ecstasy / LSD) entre 1 et 654 unités (par unité saisie)', 'contraventions', '', 420),
	(72, 'Article 2-2-1-38 : La détention de drogue dure (Weed / Meth) entre 1 et 654 unités (par unité saisie)', 'contraventions', '', 350),
	(73, 'Article 2-2-1-39 : La détention de drogue dure (Cocaïne) entre 1 et 654 unités (par unité saisie)', 'contraventions', '', 400),
	(74, 'Article 2-2-1-40 : La détention de drogue pure ( Ecstasy / LSD) entre 6 et 654 unités (par unité saisie)', 'contraventions', '', 260),
	(75, 'Article 2-2-1-41 : La détention de drogue pure (Weed / Meth) entre 6 et 654 unités (par unité saisie)', 'contraventions', '', 175),
	(76, 'Article 2-2-1-42 : La détention de drogue pure (Cocaïne) entre 6 et 654 unités (par unité saisie)', 'contraventions', '', 200),
	(77, 'Article 2-2-1-43 : Vendre des armes blanches sans autorisation', 'contraventions', '', 45000),
	(78, 'Article 2-2-1-44 : Effectuer un délit de fuite', 'contraventions', '', 35000),
	(79, 'Article 2-2-1-45 : La détention d’arme légale sans possession du Permis de Port d’Arme', 'contraventions', '', 45000),
	(80, 'Article 2-2-1-46 : Les violences physiques non consenties avec une ITT inférieure à 1 mois', 'contraventions', '', 20000),
	(81, 'Article 2-2-1-47 : La dégradation de biens publics', 'contraventions', '', 6000),
	(82, 'Article 2-2-1-48 : Jeter ses déchets dans une zone à risque (boisée, station essence, industrielle,...)', 'contraventions', '', 6000),
	(83, 'Article 2-2-1-49 : Présenter visuellement une arme à feu dans un lieu public', 'contraventions', '', 20000),
	(84, 'Article 2-2-1-50 : Le vol d’un véhicule appartenant à un service de l\'État ', 'contraventions', '', 60000),
	(85, 'Article 2-2-1-51 : La réalisation d’un Go-Fast', 'contraventions', '', 10000),
	(86, 'Article 2-2-1-52 : L’incitation à la haine ou à la violence', 'contraventions', '', 15000),
	(87, 'Article 2-2-1-54 :  Le fait de tirer avec une arme dans un lieu public', 'contraventions', '', 50000),
	(88, 'Article 2-2-1-55 : L’injure publique commise en fonction de l\'ethnie, la nation, la prétendue race, la religion\n déterminée, le sexe, l\'orientation sexuelle, l\'identité de genre ou le handicap"""', 'contraventions', '', 50000),
	(89, 'Article 2-2-1-56 : Participer ou aider à la réalisation d’un braquage d’ ATM', 'contraventions', '', 2000),
	(90, 'Article 2-2-1-57 : Participer ou aider à la réalisation d’un braquage d’une Superette', 'contraventions', '', 3000),
	(91, 'Article 2-2-1-58: Participer ou aider à la réalisation d’un braquage d\'une galerie d\'art', 'contraventions', '', 50000),
	(92, 'Article 2-2-1-59 : Participer ou aider à la réalisation d’un braquage de la Fleeca', 'contraventions', '', 150000),
	(93, 'Article 2-2-1-60 : Participer ou aider à la réalisation d’un braquage d’une bijouterie', 'contraventions', '', 200000),
	(94, 'Article 2-2-1-61 : Participer ou aider à la réalisation d’un braquage de la banque central / Paleto Bank', 'contraventions', '', 450000),
	(95, 'Article 2-2-1-62 : L’encombrement volontaire d’un canal d’urgence, par radio ou appels téléphoniques', 'contraventions', '', 10000),
	(96, 'Article 2-2-1-63 : Les menaces de mort de quelque nature que ce soit', 'contraventions', '', 75000),
	(97, 'Article 2-2-1-64 : La détention d’une arme illégale catégorisée comme arme de poing', 'contraventions', '', 35000),
	(98, 'Article 2-2-1-65 : La détention d’une arme illégale catégorisée comme arme légère', 'contraventions', '', 40000),
	(99, 'Article 2-2-2-1 : Le non-respect du secret professionnel', 'délits', 'peine 10mn', 25000),
	(100, 'Article 2-2-2-2: La création de faux ou l’usage de faux ', 'délits', 'peine 30mn', 10000),
	(101, 'Article 2-2-2-3 : Employer un individu sans contrat de travail', 'délits', 'peine 20mn', 20000),
	(102, 'Article 2-2-2-4 : La violation d’un domicile', 'délits', 'peine 10mn', 10000),
	(103, 'Article 2-2-2-5 : Le harcèlement moral commis par un supérieur dans un cadre professionnel ', 'délits', 'peine 45mn', 30000),
	(104, 'Article 2-2-2-6 : La discrimation commise en fonction de l\'ethnie, l\'orientation sexuelle, apparence\nphysique, situation familiale, grossesse, domicile, handicap, âge, opinion politique et religion', 'délits', 'peine 1h', 50000),
	(105, 'Article 2-2-2-7 : La dissimulation ou la substitution de preuve ', 'délits', 'peine 1h', 50000),
	(106, 'Article 2-2-2-8 : Vendre des armes illégales catégorisées comme arme de poing', 'délits', 'peine 20mn', 25000),
	(107, 'Article 2-2-2-9 : Vendre des armes illégales catégorisées comme arme légère', 'délits', 'peine 25mn', 50000),
	(108, 'Article 2-2-2-10 : Vendre des armes illégales catégorisées comme arme lourde', 'délits', 'peine 35mn', 100000),
	(109, 'Article 2-2-2-11 : Vendre des armes illégales catégorisées comme arme de guerre', 'délits', 'peine 40mn', 200000),
	(110, 'Article 2-2-2-12 : L’extorsion', 'délits', 'peine 35mn', 75000),
	(111, 'Article 2-2-2-13 : La corruption', 'délits', 'peine 1h', 60000),
	(112, 'Article 2-2-2-14 : L’usurpation d’un titre professionnel ', 'délits', 'peine 35mn', 45000),
	(113, 'Article 2-2-2-16 : Participer ou aider à un trafic de drogue (Ecstasy / LSD), comprenant entre 654 unités et \n1310 unités', 'délits', '', 600),
	(114, 'Article 2-2-2-17 : Participer ou aider à un trafic de drogue (Weed / Meth), comprenant entre 654 unités et \n1310 unités', 'délits', '', 400),
	(115, 'Article 2-2-2-18 : Participer ou aider à un trafic de drogue (Cocaïne), comprenant entre 654 unités et \n1310 unités', 'délits', '', 800),
	(116, 'Article 2-2-2-19 : Le non-respect d’une peine d’une mesure complémentaire dans un délai de 3 jours ', 'délits', '', 75000),
	(117, 'Article 2-2-2-20 : Refuser de répondre de manière positive à une réquisition ou un mandat présenté par \nles forces de l’ordre dans le cadre de l’article 4-2 du Code de Procédure Pénale,', 'délits', '', 50000),
	(118, 'Article 2-2-2-21 : La mise en danger de la vie d’autrui', 'délits', '', 81000),
	(119, 'Article 2-2-2-25 : La non-réalisation d’un stage à la sensibilisation routière ou de sensibilisation aux dangers \nde l’usage de produits stupéfiants', 'délits', '', 50000),
	(120, 'Article 2-2-2-26:  Faux témoignage', 'délits', '', 45000),
	(121, 'Article 2-2-2-27 :  Faux signalement', 'délits', '', 45000),
	(122, 'Article 2-2-2-28 : Port du gilet pare balle visible', 'délits', '', 15000),
	(123, 'Article 2-2-2-29 : Possession d\'arme catégoriser comme arme lourd ', 'délits', '', 50000),
	(124, 'Article 2-2-3-1 : Le recel de bien', 'crimes', '', 50000),
	(125, 'Article 2-2-3-2 : La détention d’arme illégale catégorisée comme arme de guerre ', 'crimes', '', 75000),
	(126, 'Article 2-2-3-3 : Le détournement de fonds ', 'crimes', '', 125000),
	(127, 'Article 2-2-3-4 : Participer ou aider à la réalisation d’un enlèvement', 'crimes', '', 45000),
	(128, 'Article 2-2-3-5 : Participer ou aider lors d’une prise d’otage', 'crimes', '', 60000),
	(129, 'Article 2-2-3-6 : Participer ou aider lors d’une séquestration ', 'crimes', '', 75000),
	(130, 'Article 2-2-3-7 : Participer ou aider à la réalisation d’acte de torture ou de barbarie ', 'crimes', '', 100000),
	(131, 'Article 2-2-3-8 : L’homicide involontaire', 'crimes', '', 50000),
	(132, 'Article 2-2-3-9 : Participer ou aider lors d’une attaque d’un convoi ', 'crimes', '', 150000),
	(133, 'Article 2-2-3-10 : Participer ou aider à une évasion ', 'crimes', '', 200000),
	(134, 'Article 2-2-3-11 : Réaliser ou aider lors de la réalisation d’un meurtre', 'crimes', '', 150000),
	(135, 'Article 2-2-3-12 : Participer ou aider à un trafic de drogue (Ecstasy / LSD), comprenant plus de 1 311 unités', 'crimes', '', 600),
	(136, 'Article 2-2-3-13 : Participer ou aider à un trafic de drogue (Weed / Meth), comprenant plus de 1 311 unités', 'crimes', '', 400),
	(137, 'Article 2-2-3-14 : Participer ou aider à un trafic de drogue (Cocaïne), comprenant plus de 1 311 unités', 'crimes', '', 800),
	(138, 'Article 2-2-3-15 : Vendre ou participer à un trafic de vente d\'armes ', 'crimes', '', 100000),
	(139, 'Article 2-2-3-16 : Participer ou aider lors de procédé permettant un blanchiment d’argent', 'crimes', '', 250000),
	(140, 'Article 2-2-3-17 : Vendre ou participer à un trafic de vente d\'armes catégorisée comme arme de guerre ', 'crimes', '', 250000),
	(141, 'Article 2-2-3-18 : Participer ou aider à la réalisation d’acte terrorisme ou faisant l’apologie du terrorisme ', 'crimes', '', 450000),
	(142, 'Article 2-2-3-19 : L’incitation au suicide', 'crimes', '', 250000),
	(143, 'Article 2-2-3-20 :Tentative de coup d\'état', 'crimes', '', 150000),
	(144, 'Article 2-2-3-21 : La tentative d\'agression avec un objet non décrit dans le présent code pénal', 'crimes', '', 75000),
	(145, 'Article 2-2-3-21 : La tentative d\'agression avec une arme décrite dans le présent code pénal', 'crimes', '', 85000);

-- Listage de la structure de le déclencheur Reality_Police. rapports_before_insert
DROP TRIGGER IF EXISTS `rapports_before_insert`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `rapports_before_insert` BEFORE INSERT ON `rapports` FOR EACH ROW BEGIN
  IF new.uuid IS NULL THEN
    SET new.uuid = uuid();
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
