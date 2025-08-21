CREATE TABLE `courses` (
	`id` varchar(255) NOT NULL DEFAULT (UUID()),
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_products` (
	`course_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `course_products_course_id_product_id_pk` PRIMARY KEY(`course_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `course_sections` (
	`id` varchar(255) NOT NULL DEFAULT (UUID()),
	`name` text NOT NULL,
	`status` enum('public','private') NOT NULL DEFAULT 'private',
	`order` int NOT NULL,
	`course_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `course_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` varchar(255) NOT NULL DEFAULT (UUID()),
	`name` text NOT NULL,
	`description` text,
	`youtube_video_id` text NOT NULL,
	`order` int NOT NULL,
	`status` enum('public','private','preview') NOT NULL DEFAULT 'private',
	`section_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(255) NOT NULL DEFAULT (UUID()),
	`name` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text NOT NULL,
	`price_in_dollars` int NOT NULL,
	`status` enum('public','private') NOT NULL DEFAULT 'private',
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` varchar(255) NOT NULL DEFAULT (UUID()),
	`price_paid_in_cents` int NOT NULL,
	`product_details` json NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	`stripe_session_id` varchar(255) NOT NULL,
	`payment_provider` varchar(50) NOT NULL,
	`vnp_transaction_id` varchar(255),
	`momo_transaction_id` varchar(255),
	`refunded_at` timestamp,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchases_stripe_session_id_unique` UNIQUE(`stripe_session_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL DEFAULT (UUID()),
	`clerk_user_id` varchar(255) NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`image_url` text,
	`deleted_at` datetime,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_clerk_user_id_unique` UNIQUE(`clerk_user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_course_access` (
	`user_id` varchar(255) NOT NULL,
	`course_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `user_course_access_user_id_course_id_pk` PRIMARY KEY(`user_id`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `user_lesson_complete` (
	`user_id` varchar(255) NOT NULL,
	`lesson_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (NOW()),
	`updated_at` datetime NOT NULL DEFAULT (NOW()),
	CONSTRAINT `user_lesson_complete_user_id_lesson_id_pk` PRIMARY KEY(`user_id`,`lesson_id`)
);
--> statement-breakpoint
ALTER TABLE `course_products` ADD CONSTRAINT `course_products_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_products` ADD CONSTRAINT `course_products_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_sections` ADD CONSTRAINT `course_sections_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_section_id_course_sections_id_fk` FOREIGN KEY (`section_id`) REFERENCES `course_sections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_course_access` ADD CONSTRAINT `user_course_access_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_course_access` ADD CONSTRAINT `user_course_access_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_lesson_complete` ADD CONSTRAINT `user_lesson_complete_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_lesson_complete` ADD CONSTRAINT `user_lesson_complete_lesson_id_lessons_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE cascade ON UPDATE no action;