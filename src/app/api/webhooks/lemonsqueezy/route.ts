import crypto from "node:crypto";
import {
	processWebhookEvent,
	storeWebhookEvent,
} from "@/app/actions/lemonsqueezy";
import { env } from "@/env";
import { webhookHasMeta } from "@/lib/lemonsqueezy-typeguards";

export async function POST(request: Request) {
	if (!env.LEMONSQUEEZY_WEBHOOK_SECRET) {
		return new Response(
			"Lemon Squeezy isn't set up correctly one the server.",
			{
				status: 500,
			},
		);
	}

	const rawBody = await request.text();
	const secret = env.LEMONSQUEEZY_WEBHOOK_SECRET;

	const hmac = crypto.createHmac("sha256", secret);
	const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
	const signature = Buffer.from(
		request.headers.get("X-Signature") || "",
		"utf8",
	);

	if (!crypto.timingSafeEqual(digest, signature)) {
		return new Response("Invalid signature.", { status: 401 });
	}

	const data = JSON.parse(rawBody) as unknown;

	if (!webhookHasMeta(data)) {
		return new Response("Data invalid", { status: 400 });
	}

	const webhookEventId = await storeWebhookEvent(
		data.meta.event_name,
		data as unknown as Record<string, unknown>,
	);

	void processWebhookEvent(webhookEventId).catch((err) => {
		console.error(
			"Error processing LemonSqueezy webhook event",
			webhookEventId,
			err,
		);
	});

	return new Response("OK", { status: 200 });
}
