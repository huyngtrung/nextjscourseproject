ALTER TABLE `purchases` MODIFY COLUMN `stripe_session_id` varchar(255);--> statement-breakpoint
ALTER TABLE `purchases` ADD `vnp_txn_ref` varchar(255);--> statement-breakpoint
ALTER TABLE `purchases` ADD `vnp_transaction_date` varchar(14);--> statement-breakpoint
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_vnp_transaction_id_unique` UNIQUE(`vnp_transaction_id`);--> statement-breakpoint
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_momo_transaction_id_unique` UNIQUE(`momo_transaction_id`);