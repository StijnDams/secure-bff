CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
