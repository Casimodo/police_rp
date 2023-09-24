-- Author: tontonCasi [Twitch : https://www.twitch.tv/tontoncasi]
-- Licence : MIT
-- Source : https://github.com/Casimodo/police_rp
-- Terms of use:
--   This file comes from a source code covered by the MIT license please respect this. 
--   All component files this code is filed, signed and certified with the competent international authority 
--   in order to enforce copyright and ensure proof of an MIT license, thank you to respect that.

-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           10.5.8-MariaDB-1:10.5.8+maria~focal - mariadb.org binary distribution
-- SE du serveur:                debian-linux-gnu
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour tontonCasi_police
CREATE DATABASE IF NOT EXISTS `tontonCasi_police` /*!40100 DEFAULT CHARACTER SET utf16 */;
USE `tontonCasi_police`;

-- Listage de la structure de table tontonCasi_police. casiers_judiciaire
CREATE TABLE IF NOT EXISTS `casiers_judiciaire` (
  `id_casier` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `civil_id` int(11) NOT NULL DEFAULT 0,
  `agent_id` varchar(50) NOT NULL DEFAULT '0',
  `detail_fait` longtext DEFAULT NULL,
  `lieu` varchar(50) DEFAULT NULL,
  `timeUpdate` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `retenu_compte_bancaire` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_casier`) USING BTREE,
  KEY `FK_casiers_judiciaire_civils` (`civil_id`),
  KEY `FK_casiers_judiciaire_players` (`agent_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.casiers_judiciaire : ~0 rows (environ)

-- Listage de la structure de table tontonCasi_police. casiers_judiciaire_details
CREATE TABLE IF NOT EXISTS `casiers_judiciaire_details` (
  `id_cas_detail` bigint(20) NOT NULL AUTO_INCREMENT,
  `casier_id` int(11) NOT NULL,
  `amende_id` int(11) NOT NULL,
  `complement` varchar(255) DEFAULT NULL,
  `multiple` int(11) DEFAULT 1,
  PRIMARY KEY (`id_cas_detail`),
  KEY `FK_casiers_judiciaire_details_casiers_judiciaire` (`casier_id`),
  KEY `FK_casiers_judiciaire_details_ref_amendes` (`amende_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.casiers_judiciaire_details : ~0 rows (environ)

-- Listage de la structure de table tontonCasi_police. civils
CREATE TABLE IF NOT EXISTS `civils` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `tail_cm` int(11) DEFAULT 0,
  `genre` varchar(50) DEFAULT 'néan',
  `profession` varchar(255) DEFAULT 'néan',
  `telephone` varchar(50) DEFAULT 'néan',
  `signe_distinctif` varchar(255) DEFAULT 'néan',
  `photo_1` longtext DEFAULT NULL,
  `photo_2` longtext DEFAULT NULL,
  `photo_3` longtext DEFAULT NULL,
  `photo_4` longtext DEFAULT NULL,
  `photo_5` longtext DEFAULT NULL,
  `timeCreate` timestamp NOT NULL DEFAULT current_timestamp(),
  `timeUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.civils : ~0 rows (environ)

-- Listage de la structure de table tontonCasi_police. grades
CREATE TABLE IF NOT EXISTS `grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` int(11) DEFAULT NULL,
  `grade_label` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.grades : ~13 rows (environ)
INSERT INTO `grades` (`id`, `key`, `grade_label`) VALUES
	(1, 0, 'Cadet'),
	(2, 1, 'Officier 1'),
	(3, 2, 'Officier 2'),
	(4, 200, 'Commandant'),
	(5, 3, 'Officier 3'),
	(6, 5, 'Sergent'),
	(7, 10, 'Sergent Chef'),
	(8, 15, 'Lieutenant'),
	(9, 190, 'Sheriff'),
	(10, 180, 'Sheriff Adjoint'),
	(11, 150, 'Sergent'),
	(17, 830, 'Juge'),
	(18, 850, 'Gouverneur');

-- Listage de la structure de table tontonCasi_police. investigations
CREATE TABLE IF NOT EXISTS `investigations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) DEFAULT NULL,
  `agent_id` varchar(50) DEFAULT NULL,
  `date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sujet` varchar(50) DEFAULT NULL,
  `commentaire` longtext DEFAULT NULL,
  `type` varchar(20) DEFAULT 'classique',
  `status` varchar(20) DEFAULT 'en cours',
  `photo_1` longtext DEFAULT NULL,
  `photo_2` longtext DEFAULT NULL,
  `photo_3` longtext DEFAULT NULL,
  `photo_4` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.investigations : ~0 rows (environ)

-- Listage de la structure de table tontonCasi_police. players
CREATE TABLE IF NOT EXISTS `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `grade` int(11) DEFAULT 1,
  `matricule` varchar(15) DEFAULT NULL,
  `investigation` int(11) DEFAULT 0,
  `admin` int(11) DEFAULT 0,
  `actif` int(11) DEFAULT 1,
  `evaluateur` int(11) DEFAULT 0,
  `timeJoin` timestamp NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `service` varchar(50) DEFAULT 'LSPD',
  `telephone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`username`) USING BTREE,
  KEY `FK_players_grades` (`grade`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.players : ~0 rows (environ)

-- Listage de la structure de table tontonCasi_police. rapports
CREATE TABLE IF NOT EXISTS `rapports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) DEFAULT NULL,
  `agent_id` varchar(50) DEFAULT NULL,
  `date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sujet` varchar(50) DEFAULT NULL,
  `commentaire` longtext DEFAULT NULL,
  `type` varchar(20) DEFAULT 'classique',
  `status` varchar(20) DEFAULT 'en cours',
  `photo_1` longtext DEFAULT NULL,
  `photo_2` longtext DEFAULT NULL,
  `photo_3` longtext DEFAULT NULL,
  `photo_4` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.rapports : ~0 rows (environ)

-- Listage de la structure de table tontonCasi_police. ref_amendes
CREATE TABLE IF NOT EXISTS `ref_amendes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `type` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `genre` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `complement` varchar(255) CHARACTER SET utf8 DEFAULT '',
  `tarif` float NOT NULL DEFAULT 0,
  `tig` int(11) NOT NULL DEFAULT 0,
  `heures_prison` int(11) NOT NULL DEFAULT 0,
  `ancien_code` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=845 DEFAULT CHARSET=utf16;

-- Listage des données de la table tontonCasi_police.ref_amendes : ~107 rows (environ)
INSERT INTO `ref_amendes` (`id`, `label`, `type`, `genre`, `complement`, `tarif`, `tig`, `heures_prison`, `ancien_code`) VALUES
	(718, 'Article 1-2-1-1 : Le non-respect de la signalisation', 'infraction', 'code de la route', '', 3000, 0, 0, 0),
	(720, 'Article 1-2-1-6 : L’arrêt ou le stationnement dangereux ou gênant', 'infraction', 'code de la route', '', 3000, 0, 0, 0),
	(722, 'Article 1-2-1-8 : Le demi-tour non autorisé', 'infraction', 'code de la route', '', 3000, 0, 0, 0),
	(723, 'Article 1-2-1-9 : La circulation de nuit sans mettre au minimum les feux de croisement', 'infraction', 'code de la route', '', 3000, 0, 0, 0),
	(724, 'Article 1-2-1-10 : L’entrave à la circulation', 'infraction', 'code de la route', '', 3000, 0, 0, 0),
	(725, 'Article 1-2-1-11 : La circulation hors route ou chemin praticable par un véhicule à moteur', 'infraction', 'code de la route', '', 3000, 0, 0, 0),
	(726, 'Article 1-2-1-12 : Le rodéo motorisé', 'infraction', 'code de la route', '', 6000, 0, 0, 0),
	(727, 'Article 1-2-1-13 : La circulation par un véhicule non homologué sur une route', 'infraction', 'code de la route', '', 9000, 0, 0, 0),
	(728, 'Article 1-2-1-15 : Le fait de conduire sans détenir le permis de conduire', 'infraction', 'code de la route', '', 15000, 0, 0, 0),
	(730, 'Article 1-2-1-17 : La non présentation du permis de conduire', 'infraction', 'code de la route', '', 15000, 0, 0, 0),
	(731, 'Article 1-2-2-1 : La conduite sous l’emprise d’un produit stupéfiant', 'infraction', 'code de la route', '', 9000, 0, 0, 0),
	(732, 'Article 1-2-2-2: La conduite sous l\'emprise d\'alcool', 'infraction', 'code de la route', '', 9000, 0, 0, 0),
	(733, 'Article 1-2-3-1 : Un excès de vitesse à l\'appréciation de l\'agent', 'infraction', 'code de la route', '', 6000, 0, 0, 0),
	(734, 'Article 1-2-3-2 : Un excès de vitesse compris entre 51 km/h et 100 km/h (RADAR OBLIGATOIRE)', 'infraction', 'code de la route', '', 15000, 0, 0, 0),
	(735, 'Article 1-2-3-2 : Un excès de vitesse supérieur à 100km/h (RADAR OBLIGATOIRE)', 'delits', 'code de la route', '', 20000, 0, 0, 0),
	(736, 'Article 2-2-1 : Un excès de vitesse entre 20 nœuds et 40 nœuds avec un véhicule nautique dans une zone réglementé', 'infraction', 'code maritime', '', 6000, 0, 0, 0),
	(737, 'Article 2-2-2 : Un excès de vitesse supérieur à 41 nœuds avec un véhicule nautique dans une zone réglementée', 'infraction', 'code maritime', '', 9000, 0, 0, 0),
	(739, 'Article 2-2-3 : Effectuer une manœuvre dangereuse à bord d’un véhicule nautique. proche d’un ponton. ou dans l’embouchure d’un port.hors parcours balisé', 'infraction', 'code maritime', '', 9000, 0, 0, 0),
	(740, 'Article 2-2-4 : La navigation à l’aide d’un véhicule nautique sans possession de la licence adéquate', 'infraction', 'code maritime', '', 15000, 0, 0, 0),
	(741, 'Article 3-2-1 : Le stationnement d’un aéronef sur un emplacement non prévu', 'infraction', 'code de l\'aviation', '', 15000, 0, 0, 0),
	(742, 'Article 3-2-2 : Le pilotage d’un véhicule aérien sans possession de la licence adéquate', 'infraction', 'code de l\'aviation', '', 30000, 0, 0, 0),
	(743, 'Article 3-2-3 : La non-présence sur la fréquence radio ', 'infraction', 'code de l\'aviation', '', 25000, 0, 0, 0),
	(744, 'Article 3-2-4 : Le non-respect d’une distance de survol', 'infraction', 'code de l\'aviation', '', 25000, 0, 0, 0),
	(745, 'Article 3-2-5 : Le prêt d’un aéronef à une personne ne possédant pas la licence de pilotage adéquate', 'infraction', 'code de l\'aviation', 'la confiscation du véhicule pour une durée maximale d’une semaine', 75000, 0, 0, 0),
	(746, 'Article 2-2-1-1 : Jeter ses déchets sur la voie publique', 'contraventions', 'code penal', '', 500, 0, 0, 0),
	(747, 'Article 2-2-1-2 : Le campement sauvage', 'contraventions', 'code penal', '', 1000, 0, 0, 0),
	(748, 'Article 2-2-1-3 : Le graffiti ou tag', 'contraventions', 'code penal', '', 2500, 0, 0, 0),
	(749, 'Article 2-2-1-4 : Le tapage de jour ou de nuit', 'contraventions', 'code penal', '', 2500, 0, 0, 0),
	(750, 'Article 2-2-1-5 : Participer à une manifestation non déclarée', 'contraventions', 'code penal', '', 3000, 0, 0, 0),
	(751, 'Article 2-2-1-6 : Les violences physiques non consenties sans ITT', 'contraventions', 'code penal', '', 6000, 0, 0, 0),
	(752, 'Article 2-2-1-7 : L’usage illicite de produit stupéfiant', 'contraventions', 'code penal', '', 6000, 0, 0, 0),
	(753, 'Article 2-2-1-8 : Apparaître masqué dans un lieu public', 'contraventions', 'code penal', '', 6000, 0, 0, 0),
	(754, 'Article 2-2-1-9 : L’intrusion dans une propriété de l\'État', 'contraventions', 'code penal', '100 TIG ( masse RP à prendre en compte )', 15000, 100, 0, 0),
	(755, 'Article 2-2-1-10 : Le vol de véhicule ou circuler dans un véhicule volé ( JOUEURS )', 'contraventions', 'code penal', '50 TIG', 10000, 50, 0, 0),
	(757, 'Article 2-2-1-12 : L’outrage public à la pudeur ou le voyeurisme', 'contraventions', 'code penal', '', 1500, 0, 0, 0),
	(758, 'Article 2-2-1-13 : Les dégradations de biens privés', 'contraventions', 'code penal', '', 10000, 0, 0, 0),
	(759, 'Article 2-2-1-14 : La diffamation publique', 'contraventions', 'code penal', '', 5000, 0, 0, 0),
	(760, 'Article 2-2-1-15 : Le refus d’obtempérer', 'contraventions', 'code penal', '', 3000, 0, 0, 0),
	(761, 'Article 2-2-1-16 : Le refus de se soumettre a un controle de police', 'contraventions', 'code penal', '20 TIG', 5000, 20, 0, 0),
	(762, 'Article 2-2-1-17 : Une injure publique', 'contraventions', 'code penal', '', 5000, 0, 0, 0),
	(763, 'Article 2-2-1-18 : Présenter visuellement une arme blanche dans un lieu public', 'contraventions', 'code penal', 'révocation du permis port d’arme + saisie de l\'arme', 25000, 0, 0, 0),
	(764, 'Article 2-2-1-19 : Un outrage commis envers un agent de l\'État', 'contraventions', 'code penal', '50 TIG', 15000, 50, 0, 0),
	(765, 'Article 2-2-1-20 : Organisation d’un événement non déclaré', 'contraventions', 'code penal', '', 10000, 0, 0, 0),
	(766, 'Article 2-2-1-21 : Effectuer un acte de chantage avec menaces', 'contraventions', 'code penal', '', 25000, 0, 0, 0),
	(767, 'Article 2-2-1-22 : Effectuer des menaces', 'contraventions', 'code penal', '', 20000, 0, 0, 0),
	(768, 'Article 2-2-1-23 : L’usurpation d’identité', 'contraventions', 'code penal', '100 TIG', 50000, 100, 0, 0),
	(769, 'Article 2-2-1-24 : Participer ou organiser une course illégale', 'contraventions', 'code penal', '25 TIG', 10000, 25, 0, 0),
	(770, 'Article 2-2-1-25 : Entraver une opération de la LSDP ou des EMS', 'contraventions', 'code penal', '100 TIG', 70000, 100, 0, 0),
	(771, 'Article 2-2-1-26 : La détention de drogue dure (Ecstasy / LSD. par unité saisie)', 'contraventions', 'code penal', 'confiscation et la destruction des objets concernés est appliquée systématiquement', 420, 0, 0, 0),
	(772, 'Article 2-2-1-27 : La détention de drogue douce (Weed) A partir de 10 (par unité supplémentaire)', 'contraventions', 'code penal', 'confiscation et la destruction des objets concernés est appliquée systématiquement', 350, 0, 0, 0),
	(773, 'Article 2-2-1-28 : La détention de drogue dure (Cocaïne/METH. par unité saisie)', 'contraventions', 'code penal', 'confiscation et la destruction des objets concernés est appliquée systématiquement', 400, 0, 0, 0),
	(774, 'Article 2-2-1-29 : Vente à la sauvette (Cocaïne. Meth. weed. par unité saisie)', 'contraventions', 'code penal', 'confiscation et la destruction des objets concernés est appliquée systématiquement', 250, 0, 0, 0),
	(775, 'Article 2-2-1-30 : Vendre des armes blanches sans autorisation', 'contraventions', 'code penal', 'une révocation du permis port d’arme + confiscation et la destruction des objets concernés est appliquée systématiquement', 15000, 0, 0, 0),
	(776, 'Article 2-2-1-31 : Effectuer un délit de fuite', 'contraventions', 'code penal', '', 20000, 0, 0, 0),
	(777, 'Article 2-2-1-32 : La détention d’arme légale sans possession du Permis de Port d’Arme', 'contraventions', 'code penal', 'confiscation et la destruction des objets concernés est appliquée systématiquement', 20000, 0, 0, 0),
	(778, 'Article 2-2-1-33 : La dégradation de biens publics', 'contraventions', 'code penal', '', 3000, 0, 0, 0),
	(779, 'Article 2-2-1-34 : Présenter visuellement une arme à feu dans un lieu public', 'contraventions', 'code penal', '50 TIG + saisie de l\'arme et annulation du permis de port d\'arme', 20000, 50, 0, 0),
	(780, 'Article 2-2-1-35 : Le vol d’un véhicule appartenant à un service de l\'État', 'contraventions', 'code penal', '75 TIG', 70000, 75, 0, 0),
	(781, 'Article 2-2-1-36 : La réalisation d’un Go-Fast', 'contraventions', 'code penal', 'annulation du permis de conduire, confiscation du véhicule pour une durée maximale d’une semaine', 10000, 0, 0, 0),
	(782, 'Article 2-2-1-37 : Le fait de tirer avec une arme dans un lieu public', 'contraventions', 'code penal', '25 TIG + PPA annulé + confiscation et la destruction des objets concernés est appliquée systématiquement', 50000, 25, 0, 0),
	(784, 'Article 2-2-1-38 : L’injure publique commise en fonction de l\'ethnie. la nation. la prétendue race. la religion déterminée. le sexe. l\'orientation sexuelle. l\'identité de genre ou le handicap', 'contraventions', 'code penal', '200 TIG + Avertissement', 100000, 200, 0, 0),
	(785, 'Article 2-2-1-39 : Participer ou aider à la réalisation d’un braquage d’ ATM', 'contraventions', 'code penal', '25 TIG + une révocation du permis de port d’arme + confiscation et la destruction des objets concernés est appliquée systématiquement', 2000, 25, 0, 0),
	(786, 'Article 2-2-1-40 : Participer ou aider à la réalisation d’un braquage d’une Superette', 'contraventions', 'code penal', '25 TIG + une révocation du permis de port d’arme + confiscation et la destruction des objets concernés est appliquée systématiquement', 2000, 25, 0, 0),
	(790, 'Article 2-2-1-44 : Participer ou aider à la réalisation d’un braquage de la banque', 'contraventions', 'code penal', '150 TIG + une révocation du permis de port d’arme + confiscation et la destruction des objets concernés est appliquée systématiquement', 500000, 150, 0, 0),
	(791, 'Article 2-2-1-45 : Les menaces de mort de quelque nature que ce soit', 'contraventions', 'code penal', '', 30000, 0, 0, 0),
	(792, 'Article 2-2-1-46 : La détention d’une arme illégale catégorisée comme arme de poing', 'contraventions', 'code penal', '25 TIG + une révocation du permis de port d’arme + confiscation et la destruction des objets concernés est appliquée systématiquement', 15000, 25, 0, 0),
	(793, 'Article 2-2-1-47 : La détention d’une arme illégale catégorisée comme arme légère', 'contraventions', 'code penal', '25 TIG + une révocation du permis de port d’arme + confiscation et la destruction des objets concernés est appliquée systématiquement', 35000, 25, 0, 0),
	(794, 'Article 2-2-2-1 : Le non-respect du secret professionnel', 'delits', 'code penal', '', 15000, 25, 0, 0),
	(795, 'Article 2-2-2-2: La création de faux ou l’usage de faux', 'delits', 'code penal', '', 50000, 50, 0, 0),
	(796, 'Article 2-2-2-3 : La violation d’un domicile', 'delits', 'code penal', '', 10000, 15, 0, 0),
	(798, 'Article 2-2-2-4 : La discrimation commise en fonction de l\'ethnie. l\'orientation sexuelle. apparence physique. situation familiale. grossesse. domicile. handicap. âge. opinion politique et religion', 'delits', 'code penal', '200 TIG + averto', 100000, 200, 0, 0),
	(799, 'Article 2-2-2-5 : La dissimulation ou la substitution de preuve', 'delits', 'code penal', '', 50000, 50, 0, 0),
	(800, 'Article 2-2-2-6 : Vendre des armes illégales catégorisées comme arme de poing', 'delits', 'code penal', '', 15000, 20, 0, 0),
	(801, 'Article 2-2-2-7 : Vendre des armes illégales catégorisées comme arme légère', 'delits', 'code penal', '', 50000, 30, 0, 0),
	(802, 'Article 2-2-2-8 : Vendre des armes illégales catégorisées comme arme lourde', 'delits', 'code penal', '', 100000, 50, 0, 0),
	(803, 'Article 2-2-2-9 : Vendre des armes illégales catégorisées comme arme de guerre', 'delits', 'code penal', '', 200000, 100, 0, 0),
	(804, 'Article 2-2-2-10 : L’usurpation d’un titre professionnel', 'delits', 'code penal', 'A voir suivant l\'usurpation ( métier, agent de l\'état, force de l\'ordre )', 45000, 35, 0, 0),
	(809, 'Article 2-2-2-14 : Refuser de répondre de manière positive à une réquisition ou un mandat présenté par les forces de l’ordre dans le cadre de l’article 4-2 du Code de Procédure Pénale.', 'delits', 'code penal', '', 50000, 50, 0, 0),
	(810, 'Article 2-2-2-15 : La mise en danger de la vie d’autrui', 'delits', 'code penal', '', 30000, 0, 0, 0),
	(811, 'Article 2-2-2-16 : La détention d’argent liquide supérieur à 10 000$', 'delits', 'code penal', '', 10, 0, 0, 0),
	(812, 'Article 2-2-2-17 : La détention d’argent liquide supérieur à 75 000$', 'delits', 'code penal', '', 20, 0, 0, 0),
	(813, 'Article 2-2-2-18: Faux témoignage', 'delits', 'code penal', '', 45000, 75, 0, 0),
	(814, 'Article 2-2-2-19 : Faux signalement', 'delits', 'code penal', '', 15000, 50, 0, 0),
	(815, 'Article 2-2-2-20 : Port du gilet pare balle visible', 'delits', 'code penal', '', 20000, 75, 0, 0),
	(816, 'Article 2-2-2-21 : Possession d\'arme catégorisée comme arme lourde', 'delits', 'code penal', 'une révocation du permis de port d’arme + confiscation et la destruction des objets concernés est appliquée systématiquement', 100000, 100, 0, 0),
	(817, 'Article 2-2-3-1 : Le recel de bien', 'crime', 'code penal', '', 30000, 50, 0, 0),
	(818, 'Article 2-2-3-2 : La détention d’arme illégale catégorisée comme arme de guerre', 'crime', 'code penal', '', 100000, 100, 0, 0),
	(819, 'Article 2-2-3-3 : Le détournement de fonds', 'crime', 'code penal', '', 150000, 100, 0, 0),
	(820, 'Article 2-2-3-4 : Participer ou aider à la réalisation d’un enlèvement', 'crime', 'code penal', '', 45000, 75, 0, 0),
	(821, 'Article 2-2-3-5 : Participer ou aider lors d’une prise d’otage', 'crime', 'code penal', '', 60000, 100, 0, 0),
	(822, 'Article 2-2-3-6 : Participer ou aider lors d’une séquestration', 'crime', 'code penal', '', 75000, 150, 0, 0),
	(823, 'Article 2-2-3-7 : Participer ou aider à la réalisation d’acte de torture ou de barbarie', 'crime', 'code penal', '', 100000, 250, 0, 0),
	(824, 'Article 2-2-3-8 : L’homicide involontaire', 'crime', 'code penal', '', 50000, 75, 0, 0),
	(825, 'Article 2-2-3-9 : Participer ou aider lors d’une attaque d’un convoi', 'crime', 'code penal', '', 150000, 150, 0, 0),
	(826, 'Article 2-2-3-10 : Participer ou aider à une évasion', 'crime', 'code penal', '', 250000, 0, 24, 0),
	(827, 'Article 2-2-3-11 : Réaliser ou aider lors de la réalisation d’un meurtre', 'crime', 'code penal', '', 350000, 100, 0, 0),
	(828, 'Article 2-2-3-12 : Participer ou aider à un trafic de drogue (Ecstasy / LSD). par unité saisie', 'crime', 'code penal', '', 600, 20, 0, 0),
	(829, 'Article 2-2-3-13 : Participer ou aider à un trafic de drogue (Weed / Meth). par unité saisie', 'crime', 'code penal', '', 400, 20, 0, 0),
	(830, 'Article 2-2-3-14 : Participer ou aider à un trafic de drogue (Cocaïne). par unité saisie', 'crime', 'code penal', '', 800, 20, 0, 0),
	(831, 'Article 2-2-3-15 : Vendre ou participer à un trafic de vente d\'armes', 'crime', 'code penal', '', 100000, 75, 0, 0),
	(832, 'Article 2-2-3-16 : Participer ou aider lors de procédé permettant un blanchiment d’argent', 'crime', 'code penal', '', 250000, 100, 0, 0),
	(833, 'Article 2-2-3-17 : Vendre ou participer à un trafic de vente d\'armes catégorisée comme arme de guerre', 'crime', 'code penal', '', 250000, 0, 24, 0),
	(834, 'Article 2-2-3-18 : Participer ou aider à la réalisation d’acte terrorisme ou faisant l’apologie du terrorisme', 'crime', 'code penal', '', 450000, 0, 24, 0),
	(835, 'Article 2-2-3-19 : L’incitation au suicide', 'crime', 'code penal', '', 100000, 0, 24, 0),
	(836, 'Article 2-2-3-20 :Tentative de coup d\'état', 'crime', 'code penal', '', 250000, 0, 24, 0),
	(837, 'Article 2-2-3-21 : La tentative d\'agression avec un objet non décrit dans le présent code pénal', 'crime', 'code penal', '', 35000, 50, 0, 0),
	(838, 'Article 2-2-3-22 : La tentative d\'agression avec une arme décrite dans le présent code pénal', 'crime', 'code penal', '', 75000, 100, 0, 0);

-- Listage de la structure de déclencheur tontonCasi_police. investigations_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `investigations_before_insert` BEFORE INSERT ON `investigations` FOR EACH ROW BEGIN
  IF new.uuid IS NULL THEN
    SET new.uuid = uuid();
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Listage de la structure de déclencheur tontonCasi_police. rapports_before_insert
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
