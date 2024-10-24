CREATE TABLE `projects` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp DEFAULT NOW(),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `steps` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(150) NOT NULL,
	`api` varchar(150) NOT NULL,
	`workflow_id` int unsigned,
	`validate` json DEFAULT ('{}'),
	`on_success` json DEFAULT ('{"next":"complete"}'),
	`on_failure` json DEFAULT ('{"next":"error"}'),
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp DEFAULT NOW(),
	CONSTRAINT `steps_id` PRIMARY KEY(`id`),
	CONSTRAINT `workflowIdSlugUniqueIndex` UNIQUE(`workflow_id`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(150) NOT NULL,
	`version` varchar(5) NOT NULL DEFAULT 'v1',
	`project_id` int unsigned NOT NULL,
	`description` text,
	`metadata` json DEFAULT ('{}'),
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp DEFAULT NOW(),
	CONSTRAINT `workflows_id` PRIMARY KEY(`id`),
	CONSTRAINT `projectVersionSlugUniqueIndex` UNIQUE(`project_id`,`version`,`slug`)
);
--> statement-breakpoint
ALTER TABLE `steps` ADD CONSTRAINT `steps_workflow_id_workflows_id_fk` FOREIGN KEY (`workflow_id`) REFERENCES `workflows`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workflows` ADD CONSTRAINT `workflows_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;