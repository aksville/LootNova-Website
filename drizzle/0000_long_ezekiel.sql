CREATE TABLE `reward_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`country` text NOT NULL,
	`country_code` text NOT NULL,
	`phone` text NOT NULL,
	`game` text NOT NULL,
	`game_username` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reward_requests_status_created` ON `reward_requests` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_reward_requests_phone` ON `reward_requests` (`phone`);