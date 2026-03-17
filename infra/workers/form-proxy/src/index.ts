interface Env {
	HUBSPOT_PORTAL_ID: string;
	RECAPTCHA_SECRET_KEY: string;
	RECAPTCHA_SCORE_THRESHOLD: string;
	ALLOWED_ORIGIN: string;
}

interface FormSubmission {
	formId: string;
	email: string;
	recaptchaToken: string;
}

interface RecaptchaResponse {
	success: boolean;
	score?: number;
	action?: string;
	challenge_ts?: string;
	hostname?: string;
	"error-codes"?: string[];
}

const ALLOWED_FORM_IDS = new Set([
	"2e0b417f-2e5c-4cc8-8441-b1982aac6638", // waitlist
	"c615fe10-5da1-4b75-aacd-cea7b476d3d3", // newsletter
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin: string): HeadersInit {
	return {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	};
}

function jsonResponse(body: Record<string, unknown>, status: number, env: Env): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			...corsHeaders(env.ALLOWED_ORIGIN),
		},
	});
}

async function verifyRecaptcha(token: string, secretKey: string, threshold: number): Promise<boolean> {
	const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
	});

	const result: RecaptchaResponse = await response.json();
	return result.success === true && (result.score ?? 0) >= threshold;
}

async function submitToHubSpot(portalId: string, formId: string, email: string): Promise<Response> {
	return fetch(
		`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				fields: [{ name: "email", value: email }],
			}),
		}
	);
}

async function handleFormSubmit(request: Request, env: Env): Promise<Response> {
	const contentType = request.headers.get("Content-Type") ?? "";
	if (!contentType.includes("application/json")) {
		return jsonResponse({ error: "Content-Type must be application/json" }, 400, env);
	}

	let body: FormSubmission;
	try {
		body = await request.json();
	} catch {
		return jsonResponse({ error: "Invalid JSON body" }, 400, env);
	}

	const { formId, email, recaptchaToken } = body;

	if (!email || !EMAIL_REGEX.test(email)) {
		return jsonResponse({ error: "Invalid email address" }, 400, env);
	}

	if (!formId || !ALLOWED_FORM_IDS.has(formId)) {
		return jsonResponse({ error: "Invalid form ID" }, 400, env);
	}

	if (!recaptchaToken) {
		return jsonResponse({ error: "Missing reCAPTCHA token" }, 400, env);
	}

	const threshold = parseFloat(env.RECAPTCHA_SCORE_THRESHOLD) || 0.5;
	const recaptchaValid = await verifyRecaptcha(recaptchaToken, env.RECAPTCHA_SECRET_KEY, threshold);
	if (!recaptchaValid) {
		return jsonResponse({ error: "Verification failed" }, 403, env);
	}

	try {
		const hubspotResponse = await submitToHubSpot(env.HUBSPOT_PORTAL_ID, formId, email);
		if (!hubspotResponse.ok) {
			console.error("HubSpot error:", await hubspotResponse.text());
			return jsonResponse({ error: "Submission failed" }, 500, env);
		}
	} catch (err) {
		console.error("HubSpot request failed:", err);
		return jsonResponse({ error: "Submission failed" }, 500, env);
	}

	return jsonResponse({ success: true }, 200, env);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: corsHeaders(env.ALLOWED_ORIGIN),
			});
		}

		if (request.method === "GET" && url.pathname === "/api/health") {
			return jsonResponse({ status: "ok" }, 200, env);
		}

		if (request.method === "POST" && url.pathname === "/api/form-submit") {
			return handleFormSubmit(request, env);
		}

		return jsonResponse({ error: "Not found" }, 404, env);
	},
} satisfies ExportedHandler<Env>;
