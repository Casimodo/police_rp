CREATE TABLE `intra_gn_rapports` (
	`id` BIGINT NOT NULL AUTO_INCREMENT,
	`uuid` VARCHAR(10) NOT NULL DEFAULT '',
    `date_create` TIMESTAMP NOT NULL DEFAULT NOW(),
	`agent_playerid` VARCHAR(50) NOT NULL DEFAULT '',
	`type` VARCHAR(10) NOT NULL DEFAULT '',
	`civil_playerid` VARCHAR(50) NOT NULL DEFAULT '',
	`sujet` VARCHAR(255) NOT NULL DEFAULT '',
	PRIMARY KEY (`id`),
	UNIQUE KEY (`uuid`)
)
COLLATE='utf16_general_ci';

