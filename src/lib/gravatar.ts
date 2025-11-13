import md5 from "md5";

/**
 * Get Gravatar URL for an email address
 * @param email - User's email address
 * @param size - Image size (default: 80)
 * @param defaultImage - Default image type (default: "identicon")
 * @returns Gravatar URL with MD5 hashed email
 * @example getGravatarUrl("user@example.com") // "https://www.gravatar.com/avatar/..."
 */
export function getGravatarUrl(
	email: string,
	size: number = 80,
	defaultImage: string = "identicon",
): string {
	const trimmedEmail = email.trim().toLowerCase();
	const hash = md5(trimmedEmail);
	return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}
