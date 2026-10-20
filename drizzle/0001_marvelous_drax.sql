CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`channel` varchar(80) NOT NULL DEFAULT 'WhatsApp Business',
	`startedAt` date NOT NULL,
	`objective` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`company` varchar(160),
	`phone` varchar(32) NOT NULL,
	`contactedAt` date NOT NULL,
	`responseStatus` enum('responded','no_response') NOT NULL DEFAULT 'no_response',
	`responseQuality` enum('positive','follow_up','negative','none') NOT NULL DEFAULT 'none',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `touchpoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerId` int NOT NULL,
	`happenedAt` timestamp NOT NULL DEFAULT (now()),
	`kind` enum('message','call','note') NOT NULL DEFAULT 'message',
	`detail` text NOT NULL,
	CONSTRAINT `touchpoints_id` PRIMARY KEY(`id`)
);
